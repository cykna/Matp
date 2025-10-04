import type { Bytes } from "../dependencies/bytes";
import { VarId } from "./varid";
import { Struct } from "../dependencies/struct";
import { StructArray } from "../dependencies/struct_arr";

export namespace Frame {

  export const enum FrameType {
    Ping = 1,
    Crypto = 2,
    Content = 3,
    CloseConnection = 4,
  }

  export const enum FrameFlags {
    None = 0,
    Fin = 1 << 0,
    Lz4Compression = 1 << 1,
    GzipCompression = 0b10 << 1,//1 << 2
    ReservedCompression = 3 << 1, //11 << 1, 2 bits
    Encrypted = 1 << 3
  }

  /** A class to track the identifier of a Frame. Note that this has nothing to do with the index of some */
  export class FrameId {
    static from(byte: number) {
      return new this((byte & 0b11110000) >> 4, byte & 0b1111);
    }
    constructor(public readonly ty: FrameType, public readonly flags: FrameFlags) {
    }
    /** Checks weather this ID is a Fin */
    is_fin() {
      return (this.flags & FrameFlags.Fin) != 0;
    }
    is_compressed() {
      return (this.flags & 0b110) != 0;
    }
    is_encrypted() {
      return (this.flags & FrameFlags.Encrypted) != 0
    }
    valueOf() {
      
      return (this.ty << 4) | this.flags;
    }
  }
  export class Frame extends Struct {
    /** Deserialized the given `bytes` and tries to return some valid frame. If none, then returns undefined*/
    static override deserialize(bytes: Bytes): Frame | undefined {
      const id = FrameId.from(bytes.read_u8());
      switch (id.ty) {
        case FrameType.Ping: return new Ping;
        case FrameType.Crypto:{
          const identifier = VarId.deserialize(bytes);
          const len = VarId.deserialize(bytes);
          const slice = bytes.slice_from_current_with_length(+len);
          return new Crypto(id.flags, slice, identifier);
        };
        case FrameType.Content: {
          const identifier =VarId.deserialize(bytes);
          const len = VarId.deserialize(bytes);
          const slice = bytes.slice_from_current_with_length(+len);
          return new Content(id.flags, slice, identifier);
        }
        default: return undefined;
      }
    }

    constructor(public id: FrameId) {
      super();
    }
    
    /** Retrieves the length in bytes of all this frame*/
    len(): number {
      return 0;
    };
    
    override serialize(bytes: Bytes): void {
      bytes.write_u8(+this.id);
    }
  }
  export const FrameArray = StructArray(Frame);

  export class Ping extends Frame {
    constructor() {
      super(new FrameId(FrameType.Ping, FrameFlags.None))
    }
    
  }
  export class Crypto extends Frame {
    static index = 0;
    constructor(flags: FrameFlags, private data: Bytes, private identifier = new VarId(Crypto.index++)) {
      super(new FrameId(FrameType.Crypto, flags));
    }
    
    override len(): number {
      return 1 + new VarId(this.data.length()).byte_size() + this.identifier.byte_size() + this.data.length();
    }
    
    override serialize(bytes: Bytes): void {
      bytes.write_u8(+this.id);
      this.identifier.serialize(bytes);
      new VarId(this.data.length()).serialize(bytes);
      bytes.write_slice(this.data.raw());
    }

    payload_len(){
      return this.data.length();
    }
    
    /**Returns a new ContentFrame but with data sliced to `amount` */
    sliced(amount: number) {
      return new Content(this.id.flags, this.data.slice_to(amount), this.identifier);
    }
  }
  export class Content extends Struct implements Frame {
    static index = 0;
    id: FrameId;
    constructor(flags: FrameFlags, private data: Bytes, private identifier = new VarId(Content.index++)) {
      super()
      this.id = new FrameId(FrameType.Content, flags);
    }
    len() {
      return 1 + new VarId(this.data.length()).byte_size() + this.data.length();
    }

    payload_len() {
      return this.data.length();
    }

    override serialize(bytes: Bytes): void {
      bytes.write_u8(+this.id);
      this.identifier.serialize(bytes);
      new VarId(this.data.length()).serialize(bytes);
      bytes.write_slice(this.data.raw());
    }

    /**Returns a new ContentFrame but with data sliced to `amount` */
    sliced(amount: number) {
      return new Content(this.id.flags, this.data.slice_to(amount), this.identifier);
    }

    content() {
      return this.data.slice_to(this.data.length()).raw();
    }
  }

}
