import type { Bytes } from "../dependencies/bytes";

/** A numeric value that can be 2 or 4 bytes. Generally used to get track of ID's */
export class VarId {
  static from(bytes:Bytes) {
    const first = bytes.read_u16();
    if(first <= 0x7fff) return new VarId(first);
    else return new VarId(first << 16 | bytes.read_u16());
  }
  constructor(private raw:number) {}
  write_on(bytes:Bytes) {
    //doesnt have the hsb = 1
    if(this.raw < 0x7fff) bytes.write_u16(this.raw);
    else bytes.write_u32(this.raw | (1 << 31));
  }

  valueOf(){
    if((this.raw & 0xffff) <= 0x7fff) return this.raw;
    else return this.raw & ~(1 << 31);
  }

  byte_size(){
    return (this.raw > 0x7fff) ? 4 : 2
  }
}
