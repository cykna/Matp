import type { Bytes } from "../../dependencies/bytes";
import { Frame } from "../frame";
import { DataFlags, DataId } from "../ids";
import { VarId } from "../varid";

export class Data extends Frame {
  static index = 0;

  constructor(flags: DataFlags, private data: Bytes, private identifier = new VarId(Data.index++)) {
    super(new DataId(flags))
    this.id = new DataId(flags);
  }
  override len() {
    return 1 + new VarId(this.data.length()).byte_size() + this.identifier.byte_size() + this.data.length();
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
    return new Data(this.id.flags, this.data.slice_to(amount), this.identifier);
  }

  ///Marks this data as a fin data.
  mark_fin(){
    this.id.flags |= DataFlags.Fin;
  }

  content() {
    return this.data.slice_to(this.data.length()).raw();
  }
}
