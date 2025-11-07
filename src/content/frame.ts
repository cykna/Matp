import { Bytes } from "../dependencies/bytes";
import { Struct } from "../dependencies/struct";
import { StructArray } from "../dependencies/struct_arr";
import type { FrameId } from "./ids";

export const enum FrameType {
  Ping = 1,
  Crypto = 2,
  Content = 3,
  CloseConnection = 4,
}

export class Frame extends Struct {
  static Array = StructArray(this);
  /** Deserialized the given `bytes` and tries to return some valid frame. If none, then returns undefined*/
  static override deserialize<T extends Struct, C extends abstract new (...args: any[]) => T>(this: C, _: Bytes): InstanceType<C> {
    return null as any;
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
