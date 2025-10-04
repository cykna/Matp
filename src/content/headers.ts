import type { Bytes } from "../dependencies/bytes";
import { Field, FieldType, Struct } from "../dependencies/struct";
import { StructArray } from "../dependencies/struct_arr";

import { Frame } from "./frame";
import { VarId } from "./varid";

export const enum MatpDatagramFlags {
  None = 0,
  MultipleData = 1 << 7,
}

export const enum MatpContentFlags {
  None = 0,
  IsHandshake = 1 << 7,
}

export class MatpDatagramTarget extends Struct {
  @Field(FieldType.u32) target: number;
  @Field(VarId) position: VarId;
  constructor(target: number, position:VarId) {
    super();
    this.target = target;
    this.position = position;
  }
}

export class MatpDatagramId extends StructArray(MatpDatagramTarget){
  @Field(VarId) len: VarId;
  /** The datagram size in bytes this ID will track*/
  constructor(datagram_size:number, ...targets:MatpDatagramTarget[]) {
    super(...targets)
    this.len = new VarId(datagram_size);
  }
}
/** A Content that is being sent to an specific End(addon)*/
export class MatpContent extends Struct {
  @Field(FieldType.u8) flags: number;
  @Field(FieldType.u32) receiver: number;
  @Field(Frame.FrameArray) frames = new Frame.FrameArray();
  private written_idx = 0;
  constructor(receiver: number, flags: MatpContentFlags) {
    super();
    this.receiver = receiver;
    this.flags = flags;
  }
  override serialize(bytes: Bytes): void {
    bytes.write_u8(this.flags);
    bytes.write_u32(this.receiver);
    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    for (const frame of this.frames) {
      if (bytes.remaining() <= 0) break;
      switch (frame.id.ty) {
        case Frame.FrameType.Ping:
          frame.serialize(bytes);
          break;
        case Frame.FrameType.Crypto:
        case Frame.FrameType.Content:
          const typed_frame = frame as Frame.Crypto;
          typed_frame.sliced(Math.min(typed_frame.payload_len(), bytes.remaining()));
          break;
        case Frame.FrameType.CloseConnection: throw new Error("Not implemented");
      }
    }
    bytes.write_u16_at(bytes.cursor - curr, cursor);
  }
  /** Serializes this Content on the provided `bytes` removing the contents written and returning if all contents were successfully written and the index where this Content starts on the provided `bytes` */
  serialize_checking(bytes: Bytes): [boolean, number] {

    bytes.write_u8(this.flags);
    bytes.write_u32(this.receiver);
    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    for (const len = this.frames.length; this.written_idx < len; this.written_idx++) {
      const frame = this.frames[this.written_idx]! as Frame.Frame;
      if (bytes.remaining() <= 0) break;
      switch (frame.id.ty) {
        case Frame.FrameType.Ping:
          frame.serialize(bytes);
          break;
        case Frame.FrameType.Crypto:
        case Frame.FrameType.Content:
          const typed_frame = frame as Frame.Crypto;
          typed_frame.sliced(Math.min(typed_frame.payload_len(), bytes.remaining()));
          break;
        case Frame.FrameType.CloseConnection: throw new Error("Not implemented");
      }
    }
    bytes.write_u16_at(bytes.cursor - curr, cursor);
    return [this.written_idx == this.frames.length, cursor];
  }
}

export const MatpContents = StructArray(MatpContent);

/** Datagram is the name used to send data between addons on a single scriptevent call */
export class MatpDatagram extends Struct {
  /** Finds the header for the provided `target` and returns it if some */
  static find_content_for(bytes: Bytes, target: number) {
    const cursor = bytes.cursor;
    const flags = bytes.read_u8();
    bytes.advance_cursor(4); //sizeof(u32)
    let receiver = bytes.read_u32();
    if (flags & MatpDatagramFlags.MultipleData) {
      while (receiver != target) {
        const len = bytes.read_u16();
        bytes.advance_cursor(len);
        receiver = bytes.read_u32();
        if (bytes.remaining() <= 0) {
          bytes.reset_cursor();
          bytes.advance_cursor(cursor);
          return;
        };
      }
    } else if (receiver != target) {
      bytes.reset_cursor();
      bytes.advance_cursor(cursor);
      return;
    };
    const len = bytes.read_u16();
    const owned_data = bytes.slice_from_current_with_length(len);
    return MatpContent.deserialize(owned_data);
  }
  @Field(FieldType.u8) flags: MatpDatagramFlags = MatpDatagramFlags.None;
  @Field(FieldType.u32) sender: number;
  @Field(MatpContents) contents = new MatpContents();
  private content_ids = new Map<number, number>;
  private written_idx = 0;
  constructor(flags: MatpDatagramFlags, sender: number) {
    super();
    this.flags = flags;
    this.sender = sender;
  }
  content_of(target: number) {
    const index = this.content_ids.get(target);
    if (undefined === index) return;
    return this.contents[index];
  }
  override serialize(bytes: Bytes): void {
    bytes.write_u8(this.flags);
    bytes.write_u32(this.sender);
    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    for (const content of this.contents) {
      if (bytes.remaining() <= 0) break;
      content.serialize(bytes);
    }
    bytes.write_u16_at(bytes.cursor - curr, cursor);
  }
  /** Serializes this Datagram removing the ones properly written and returns if all the contents were successfully written and returns the indexes of the contents on `bytes` */
  serialize_deleting(bytes: Bytes): [boolean, MatpDatagramTarget[]] {
    bytes.write_u8(this.flags);
    bytes.write_u32(this.sender);
    const cursor = bytes.advance_cursor(2);
    const curr = bytes.cursor;
    let idx = 0;
    const indexes = [];
    for (const len = this.contents.length; this.written_idx < len; this.written_idx++) {
      const content = this.contents[this.written_idx] as MatpContent
      if (bytes.remaining() <= 0) break;
      const [written, index] = content.serialize_checking(bytes);
      if (written) idx++;
      indexes.push(new MatpDatagramTarget(content.receiver, new VarId(index)));
    }
    bytes.write_u16_at(bytes.cursor - curr, cursor);
    return [this.written_idx == this.contents.length, indexes];
  }
  reset() {
    this.contents.length = 0;
    this.content_ids.clear();
  }
}
