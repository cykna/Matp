import { VarId } from "../content/varid";
import { Bytes } from "./bytes";
import { Struct } from "./struct";
import { type ConstructorOf, } from "./struct";

export function StructArray<S extends Struct, Cs extends ConstructorOf<S>>(ty: Cs) {
  return class StructArray extends Array<S> implements Struct {
    private static readonly target = ty;
    static deserialize(bytes: Bytes): StructArray | undefined {
      const len = VarId.deserialize(bytes);
      const slice = bytes.slice_from_current_with_length(+len);

      const out = new this();
      while (slice.remaining() > 0) {
        const current = this.target.deserialize(slice);
        if (current) out.push(current);
      }
      return out
    }
    constructor(...args: S[]) {
      super();
      this.push(...args);
    }
    byte_size(): number {
      let out = 0;
      for (const data of this) out += data.byte_size();
      return out;
    }
    serialize(bytes: Bytes): void {
      const offset = bytes.advance_cursor(2);
      const cursor = bytes.cursor;
      for (const content of this) content.serialize(bytes);
      bytes.write_u16_at(bytes.cursor - cursor, offset);
    }
  }
}

declare global {
  interface Uint8Array extends Struct { }
  interface Uint16Array extends Struct { }
  interface Uint32Array extends Struct { }
  interface Int8Array extends Struct { }
  interface Int16Array extends Struct { }
  interface Int32Array extends Struct { }
  interface Float16Array extends Struct { }
  interface Float32Array extends Struct { }
  interface Float64Array extends Struct { }
}

Uint8Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(this);
}
Uint8Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return bytes.slice_from_current_with_length(len).raw();
}


Uint16Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Uint16Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Uint16Array(bytes.slice_from_current_with_length(len).raw());
}



Uint32Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Uint32Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Uint32Array(bytes.slice_from_current_with_length(len).raw());
}

Int8Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Int8Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Int8Array(bytes.slice_from_current_with_length(len).raw());
}


Int16Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Int16Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Int16Array(bytes.slice_from_current_with_length(len).raw());
}

Int32Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Int32Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Int32Array(bytes.slice_from_current_with_length(len).raw());
}

Float16Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Float16Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Float16Array(bytes.slice_from_current_with_length(len).raw());
}
Float32Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Float32Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Float32Array(bytes.slice_from_current_with_length(len).raw());
}
Float64Array.prototype.serialize = function(bytes: Bytes) {
  const len = this.byteLength;
  bytes.write_u16(len);
  bytes.write_slice(new Uint8Array(this));
}
Float64Array.deserialize = function(bytes: Bytes) {
  const len = bytes.read_u16();
  return new Float64Array(bytes.slice_from_current_with_length(len).raw());
}

