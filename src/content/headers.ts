import type { Bytes } from "../dependencies/bytes";
import { Field, FieldType, Struct } from "../dependencies/struct";
import { DeserializeArr, StructArray } from "../dependencies/struct_arr";

import { Frame, FrameArray, FrameType } from "./frame";
import type { Crypto } from "./frames";
import { VarId } from "./varid";

export const enum MatpContentFlags {
  None = 0,
  IsHandshake = 1 << 7,

}

export class MatpDatagramTarget extends Struct {
  @Field(FieldType.u32) target: number;
  @Field(VarId) position: VarId;
  constructor(target: number, position: VarId) {
    super();
    this.target = target;
    this.position = position;
  }
  override byte_size(): number {
    return 4 + this.position.byte_size();
  }
}

export class MatpDatagramId extends StructArray(MatpDatagramTarget) {
  static override deserialize(bytes: Bytes): MatpDatagramId | undefined {
    const len = VarId.deserialize(bytes);
    const sender = bytes.read_u32();
    const arr = DeserializeArr(MatpDatagramTarget, bytes);
    return new this(+len, sender, ...arr);
  }
  @Field(VarId) len: VarId;
  @Field(FieldType.u32) sender: number;
  /** Creates a new datagram id, used to transfer minimal data about the datagram being sent*/
  constructor(datagram_size: number, sender: number, ...targets: MatpDatagramTarget[]) {
    super(...targets);
    this.sender = sender;
    this.len = new VarId(datagram_size);
  }
  override serialize(bytes: Bytes): void {
    this.len.serialize(bytes);
    bytes.write_u32(this.sender);
    super.serialize(bytes);
  }
  /** Retrieves the amount of size in bytes this Id will require */
  override byte_size() {
    return this.len.byte_size() + super.byte_size();
  }
  /** Finds the offset on the datagram of the provided `target`*/
  offset_of(target: number) {
    for (const end_target of this) if (end_target.target == target) return end_target.position;
  }
}
/** A Content that is being sent to an specific End(addon)*/
export class MatpContent extends Struct {
  @Field(FieldType.u8) flags: number;
  @Field(FrameArray) frames = new FrameArray();
  constructor(flags: MatpContentFlags) {
    super();
    this.flags = flags;
  }
  override serialize(bytes: Bytes): void {
    bytes.write_u8(this.flags);

    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    for (const frame of this.frames) {
      if (bytes.remaining() <= 0) break;
      switch (frame.id.ty) {
        case FrameType.Ping:
          frame.serialize(bytes);
          break;
        case FrameType.Crypto:
        case FrameType.Content:
          const typed_frame = frame as Crypto;
          typed_frame.sliced(Math.min(typed_frame.payload_len(), bytes.remaining()));
          break;
        case FrameType.CloseConnection: throw new Error("Not implemented");
      }
    }
    bytes.write_u16_at(bytes.cursor - curr, cursor);
  }
  is_handshake() {
    return (this.flags & MatpContentFlags.IsHandshake) !== 0
  }
  /** Serializes this Content on the provided `bytes` removing the contents written and returning
    if all contents were successfully written and the index where this Content starts on the provided `bytes` */
  serialize_checking(bytes: Bytes): [boolean, number] {
    const old_cursor = bytes.cursor;
    bytes.write_u8(this.flags);
    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    let frame: Frame | undefined;
    while (bytes.remaining() > 0 && (frame = this.frames.pop())) {
      switch (frame.id.ty) {
        case FrameType.Ping:
          frame.serialize(bytes);
          break;
        case FrameType.Crypto:
        case FrameType.Content:
          const remaining = bytes.remaining();
          const typed_frame = frame as Crypto;
          const sliced = typed_frame.sliced(
            Math.min(typed_frame.payload_len(), remaining - (typed_frame.len() - typed_frame.payload_len()))
          );
          const flag = sliced.len() === typed_frame.len();
          if (flag) sliced.mark_fin();
          else this.frames.push(sliced);
          sliced.serialize(bytes);

          break;
        case FrameType.CloseConnection: throw new Error("Not implemented");
      }
    }
    bytes.write_u16_at(bytes.cursor - curr, cursor);
    return [this.frames.length === 0, old_cursor];
  }
}

export const MatpContents = StructArray(MatpContent);

/** Datagram is the name used to send data between addons on a single scriptevent call */
export class MatpDatagram extends MatpContents {
  private id: MatpDatagramId;
  constructor(target: number) {
    super();
    this.id = new MatpDatagramId(0, target)
  }
  /** Creates a new content with the provided `target` and initial `frames` and returns a reference to it. */
  create_content(target: number, frames: Frame[], for_handshake: boolean) {
    const content = new MatpContent(for_handshake ? MatpContentFlags.IsHandshake : MatpContentFlags.None);
    this.push(content);
    content.frames.push(...frames);
    this.id.push(new MatpDatagramTarget(target, new VarId(0)));
    
    return content;
  }

  override serialize(bytes: Bytes): void {
    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    for (const content of this) content.serialize(bytes);
    bytes.write_u16_at(bytes.cursor - curr, cursor);
  }
  /** Serializes this Datagram removing the ones properly written and returns if all the contents were successfully written and returns the indexes of the contents on `bytes` */
  serialize_deleting(bytes: Bytes): [boolean, MatpDatagramId] {
    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    let current: MatpContent | undefined;
    {
      let idx = this.length;
      while (bytes.remaining() > 0 && (current = this.pop())) {
        const [written, index] = current.serialize_checking(bytes);
        this.id[--idx]?.position.set_raw(index);
        if (!written) { this.push(current); break };
      }
    }
    bytes.write_u16_at(bytes.cursor - curr, cursor); //many bytes written
    this.id.len.set_raw(bytes.slice_to_written().length());
    const out = [this.length === 0, this.id] as [boolean, MatpDatagramId];
    this.id = new MatpDatagramId(0, this.id.sender);
    return out;
  }
  reset() {
    this.length = 0;
    this.id.length = 0;
  }
}
