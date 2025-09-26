/** An instance for reading/writing bytes on a buffer */
export class Bytes {
  static new(len: number) {
    return new Bytes(new ArrayBuffer(len));
  }

  static from_string(str: string) {
    const out = Bytes.new(str.length);
    out.write_string(str);
    return out;
  }

  view: DataView;
  cursor = 0;
  constructor(private buffer: ArrayBuffer, private offset: number = 0, private len?: number) {
    this.view = new DataView(buffer);
  }

  current_position() {
    return this.cursor;
  }

  /** Advances the cursor in `amount` bytes and returns the old position*/
  advance_cursor(amount: number) {
    this.cursor += amount;
    return this.cursor - amount;
  }

  /** Returns a new slice containing only the contents written */
  slice_to_written() {
    return new Bytes(this.buffer, this.offset, this.cursor);
  }

  /**Equivalent to slice[..amount] */
  slice_to(amount: number) {
    return new Bytes(this.buffer, this.offset, amount);
  }

  /** Slices from `start` until `end`. Note that it does have nothing to do with the cursor */
  slice(start:number, end:number) {
    return new Bytes(this.buffer, this.offset + start, end - start);
  }

  /** Returns a new Slice that starts from the current cursor position and ends at `len`. Moves the cursor by `len` bytes*/
  slice_from_current_with_length(len: number) {
    const out = new Bytes(this.buffer, this.offset + this.cursor, len);
    this.cursor += len;
    return out;
  }

  /**Resets the cursor position to the beggining*/
  reset_cursor() {
    this.cursor = 0;
    return this;
  }

  /** Retrieves the length of this byte buffer */
  length() {
    return (this.len ?? this.buffer.byteLength);
  }
  /** Retrieves the buffer that this bytes is managing*/
  raw() {
        return new Uint8Array(this.buffer, this.offset, this.length());
  }
  /**Retrieves an iterator of the bytes of this buffer*/
  *iter() {
    yield* this.raw();
  }

  read_u8() {
    const out = this.view.getUint8(this.offset + this.cursor);
    this.cursor++;
    return out;
  }

  read_u16() {
    const out = this.view.getUint16(this.offset + this.cursor, false);
    this.cursor += 2;
    return out;
  }

  read_u32() {
    const out = this.view.getUint32(this.offset + this.cursor, false);
    this.cursor += 4;
    return out;
  }

  /**Writes the given `num` at the cursor position and advances 1 byte*/
  write_u8(num: number) {
    this.view.setUint8(this.offset + this.cursor, num);
    this.cursor++;
    return this;
  }

  /**Writes the given `num` on the specified index on this buffer. Note that this is unsafe and does not move the cursor*/
  write_u16_at(num:number, index:number) {
    this.view.setUint16(this.offset + index, num, false);
    return this;
  }
  
  /**Writes the given `num` as u16 at the cursor position and advances 2 bytes*/
  write_u16(num: number) {
    this.view.setUint16(this.offset + this.cursor, num, false);
    this.cursor += 2;
    return this;
  }

  /**Writes the given `num` at the cursor position and advances 4 bytes */
  write_u32(num: number) {
    this.view.setUint32(this.offset + this.cursor, num, false);
    this.cursor += 4;
    return this;
  }

  /**Writes the given `num` at the cursor position and advances 1 byte*/
  write_i8(num: number) {
    this.view.setInt8(this.offset + this.cursor, num);
    this.cursor++;
    return this;
  }

  /**Writes the given `num` as i16 at the cursor position and advances 2 bytes*/
  write_i16(num: number) {
    this.view.setInt16(this.offset + this.cursor, num, false); this.cursor += 2;
    return this;
  }

  /**Writes the given `num` as i32 at the cursor position and advances 4 bytes */
  write_i32(num: number) {
    this.view.setInt32(this.offset + this.cursor, num, false);
    this.cursor += 4; return this;
  }

  /**Writes the given `num` at the cursor position and advances 2 bytes*/
  write_f16(num: number) {
    this.view.setFloat16(this.offset + this.cursor, num);
    this.cursor += 2;
    return this;
  }

  /**Writes the given `num` as u16 at the cursor position and advances 4 bytes*/
  write_f32(num: number) {
    this.view.setFloat32(this.offset + this.cursor, num, false);
    this.cursor += 4;
    return this;
  }

  /**Writes the given `num` at the cursor position and advances 8 bytes */
  write_f64(num: number) {
    this.view.setFloat64(this.offset + this.cursor, num, false);
    this.cursor += 8;
    return this;
  }

  /** Retrieves the amount of bytes remaining to fill this buffer */
  remaining() {
    return this.length() - (this.cursor + this.offset);
  }

  /** Writes the given `buf` on this and returns the amount of bytes that overflowed. */
  write_slice(buf: Uint8Array) {
    const remaining = this.remaining();
    if (buf.length > remaining) {
      const amount = buf.length - remaining;
      const slice = buf.subarray(0, amount);
      this.raw().set(slice, this.cursor);
      this.cursor += slice.length;
      return buf.length - amount;
    } else {
      this.raw().set(buf, this.cursor);
      this.cursor += buf.length;
      return 0;
    }
  }
  /**Writes the given `str` on this byte slice. */
  write_string(str: string) {
    let code = 0;
    for (const c of str) {
      code = c.charCodeAt(0);
      if (code > 0xff) this.write_u16(code);
      else this.write_u8(code);
    }

  }
}
