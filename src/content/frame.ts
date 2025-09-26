import { ok } from "neverthrow";
import type { Bytes } from "../dependencies/bytes";
import { VarId } from "../encoding/varid";

export namespace Frame {
  export class FrameError extends Error {
    static readonly InvalidType = class InvalidFrameType extends this {
      constructor(public readonly ty:number){
        super();
      }
      override toString(){
        return `Not recognized Type with value ${this.ty}`;
      }
      
    }    
  }
  export function read_frame(bytes:Bytes):Result<Frame, FrameError> {
    const id = FrameId.from(bytes.read_u8());
    switch(id.ty) {
      case FrameType.Content: {
        
        const len = +VarId.from(bytes);
        const slice = bytes.slice_to(len);
        bytes.advance_cursor(len);
        return ok(new ContentFrame(id.flags, slice));
      }
      default: throw new FrameError.InvalidType(id.ty);
    }
  }
  export interface Frame {
    id: FrameId;
    len(): number;
    write_to(bytes: Bytes): void;
    content():Uint8Array;
  }


  export const enum FrameType {
    Content = 0,
    NewKey = 1,
    Ping = 2,
    Padding = 3,
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

  export class FrameId {
    static from(byte: number) {
      return new this(byte & 0b111, byte & ~0b111);
    }
    constructor(public readonly ty: FrameType, public readonly flags: FrameFlags) { }
    /** Checks weather this ID is a Fin */
    is_fin(){
      return (this.flags & FrameFlags.Fin) != 0;
    }
    is_compressed(){
      return (this.flags & 0b110) != 0;
    }
    is_encrypted(){
      return (this.flags & FrameFlags.Encrypted) != 0
    }
    valueOf() {
      return (this.flags << 3) | this.ty;
    }
  }

  export class ContentFrame implements Frame {
    id: FrameId;
    constructor(flags: FrameFlags, private data: Bytes) {
      this.id = new FrameId(FrameType.Content, flags);
    }
    len(){
      return 1 + new VarId(this.data.length()).byte_size() + this.data.length();
    }

    payload_len(){
      return this.data.length();
    }
    
    write_to(bytes: Bytes): void {
      bytes.write_u8(+this.id);
      new VarId(this.data.length()).write_on(bytes);
      bytes.write_slice(this.data.raw());
    }

    /**Returns a new ContentFrame but with data sliced to `amount` */
    sliced(amount:number) {
      return new ContentFrame(this.id.flags, this.data.slice_to(amount));
    }

    content(){
      
      return this.data.slice_to(this.data.length()).raw();
    }
  }
}
