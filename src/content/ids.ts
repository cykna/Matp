import { FrameType } from "./frame";


/** A class to track the identifier of a Frame. Note that this has nothing to do with the index of some */
export class FrameId {
  static from(byte: number) {
    return new this((byte & 0b11110000) >> 4, byte & 0b1111);
  }
  constructor(public readonly ty: FrameType, public readonly flags: number) { }
  valueOf() {
    return (this.ty << 4) | this.flags;
  }
}
export const enum CryptoFlags {
  None = 0,
  Keys = 0b1,
  TransferParameters = 0b10,
  Content = 0b11,
  Encrypted = 0b1 << 2,
  Fin = 0b1 << 3
}
export class CryptoId extends FrameId {
  constructor(flags: CryptoFlags) {
    super(FrameType.Crypto, flags);
  }
  /** Checks weather this ID is a Fin */
  is_fin() {
    return (this.flags & CryptoFlags.Fin) != 0;
  }
  /** Returns what type of content the crypto owning this will contain */
  data_type() {
    return (this.flags & 0b11) != 0;
  }
  is_encrypted() {
    return (this.flags & CryptoFlags.Encrypted) != 0;
  }
}


export const enum DataFlags {
  None = 0,
  Lz4Compression = 0b1,
  GzipCompression = 0b10,
  ReservedCompression = 0b11,
  Encrypted = 0b1 << 2,
  Fin = 0b1 << 3
}
export class DataId extends FrameId {
  constructor(flags: DataFlags) {
    super(FrameType.Content, flags);
  }
  /** Checks weather this ID is a Fin */
  is_fin() {
    return (this.flags & DataFlags.Fin) != 0;
  }
  compression_type() {
    return (this.flags & 0b11) != 0;
  }
  is_encrypted() {
    return (this.flags & DataFlags.Encrypted) != 0;
  }
}
