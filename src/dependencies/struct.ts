import { useReflectMetadata } from "@arcmantle/reflect-metadata";
import { Bytes } from "./bytes";

///When serializing data, this will serialize them normally as bytes, the only difference is with Optinals, that use an extra byte.
///This extra byte is indeed used to track metadata in general.
///[2bit: UnusedByNow][1Bit:Struct][1Bit:Optional][4Bit:UnusedByNow]. If the field used to deserialize has an optional, it will check
///if the 4th bit is 1, if so, the value is Some, else it's None, so stop reading and goes to the next
///So this byte, called, METADATA_BYTE is used simply to get track of flags for some metadata

export const Reflect = useReflectMetadata();
export const FieldTypeKey = Symbol("field_type");
export const FieldsKey = Symbol("fields");
const ToParseStruct = Symbol("struct");
export const enum FieldType {
  u8,
  u16,
  u32,
  i8,
  i16,
  i32,
  f16,
  f32,
  f64,
  Optional = 1 << 4,
  Struct = 1 << 5,
}

export function Field(type: FieldType | typeof Struct) {
  return function <Clazz>(target: Clazz, prop: string) {
    const construct = (target as any).constructor
    Reflect.defineMetadata(FieldTypeKey, type, construct, prop);
    const fields = Reflect.getMetadata(FieldsKey, construct) as Array<string>;
    if (!fields) Reflect.defineMetadata(FieldsKey, [prop], construct);
    else fields.push(prop);
  }
}

/** Retrieves a value from the given `bytes` of type `ty` */
export function retrieve_value_from(ty: FieldType, bytes: Bytes): any {
  const ty_opt = ty & FieldType.Optional; //if type has Optional
  const ty_str = ty & FieldType.Struct; //if type has Struct
  if (ty_opt) { //has optional
    const byte = bytes.read_u8();
    const byte_opt = byte & FieldType.Optional;
    if (ty_str && byte_opt) return ToParseStruct;
    return byte_opt ? retrieve_value_from(ty & ~FieldType.Optional, bytes) : undefined;
  }

  switch (ty & 0b1111) {
    case FieldType.i8: return bytes.read_i8();
    case FieldType.i16: return bytes.read_i16();
    case FieldType.i32: return bytes.read_i32();
    case FieldType.f16: return bytes.read_f16();
    case FieldType.f32: return bytes.read_f32();
    case FieldType.f64: return bytes.read_f64();
    case FieldType.u8: return bytes.read_u8();
    case FieldType.u16: return bytes.read_u16();
    case FieldType.u32: return bytes.read_u32();
    default: throw new Error(`Type not treated ${ty}`);
  }
}

/** Returns the size in bytes of the provided `ty` */
export function size_of(ty: FieldType | Struct): number {
  if (ty instanceof Struct) return ty.byte_size();
  else switch (ty) {
    case FieldType.i8:
    case FieldType.u8:
      return 1;
    case FieldType.f16:
    case FieldType.i16: case FieldType.u16:
      return 2;
    case FieldType.f32:
    case FieldType.i32:
    case FieldType.u32:
      return 4;
    case FieldType.f64: return 8;
    default: {
      if ((ty & FieldType.Optional) !== 0) return size_of(ty & ~FieldType.Optional) + 1;
      else throw new Error(`Type not recognized ${ty}`);
    }
  }
}

export function write_field(field_type: FieldType, value: number, bytes: Bytes) {
  {
    let metadata = 0;
    if ((field_type & FieldType.Optional) !== 0) metadata |= FieldType.Optional;
    if (metadata > 0) bytes.write_u8(metadata);

    field_type &= 0b1111; //only the types
  }
  switch (field_type) {
    case FieldType.i8: return bytes.write_i8(value);
    case FieldType.i16: return bytes.write_i16(value);
    case FieldType.i32: return bytes.write_i32(value);
    case FieldType.f16: return bytes.write_f16(value);
    case FieldType.f32: return bytes.write_f32(value);
    case FieldType.f64: return bytes.write_f64(value);
    case FieldType.u8: return bytes.write_u8(value);
    case FieldType.u16: return bytes.write_u16(value);
    case FieldType.u32: return bytes.write_u32(value);
    default: throw new Error("Not treated");
  }
}

/** A base class used to serialize/deserialize the fields of this into a binary form */
export abstract class Struct {

  static deserialize<T extends Struct, C extends abstract new(...args:any[])=>T>(this:C, bytes: Bytes): InstanceType<C> {
    const out = new (this as any);
    for (const field of Reflect.getMetadata(FieldsKey, this) as Array<string> ?? []) {
      const field_type = Reflect.getOwnMetadata(FieldTypeKey, this, field) as FieldType | typeof Struct;
      (out as any)[field] = typeof field_type === 'number' ? retrieve_value_from(field_type, bytes) : field_type.deserialize(bytes);
    }
    return out;
  }

  byte_size() {
    let byte_size = 0;
    for (const field of Reflect.getMetadata(FieldsKey, this) as Array<string> ?? []) {
      const field_type = Reflect.getMetadata(FieldTypeKey, this, field) as FieldType | Struct;
      byte_size += typeof field_type === 'number' ? size_of(field_type) : (this[field] as Struct).byte_size();

    }
    return byte_size;
  }

  serialize(bytes: Bytes) {
    for (const field of Reflect.getMetadata(FieldsKey, this.constructor) as Array<string> ?? []) {
      const field_type = Reflect.getOwnMetadata(FieldTypeKey, this.constructor, field) as FieldType | Struct;
      typeof field_type === 'number' ? write_field(field_type, (this as any)[field], bytes) : (this as any)[field].serialize(bytes);
    }
  }
}

export type ConstructorOf<S extends Struct> = {
  new(...args: any[]):S;
  deserialize(bytes: Bytes): S | undefined;
}

export function Option<S extends Struct, Cs extends ConstructorOf<S>>(ty: Cs) {
  return class Optional extends Opt<S> {
    private static readonly target = ty;
    static override deserialize(bytes: Bytes): S | undefined {
      const metadata = retrieve_value_from(FieldType.Optional | FieldType.Struct, bytes);
      if (metadata == ToParseStruct) return this.target.deserialize(bytes);
      else return undefined;
    }
  }
}

export class Opt<T extends Struct> extends Struct {
  constructor(public inner?: T) {
    super();
  }
  override serialize(bytes: Bytes): void {
    if (this.inner !== undefined) {
      bytes.write_u8(FieldType.Optional | FieldType.Struct);
      this.inner.serialize(bytes);
    } else bytes.write_u8(0);
  }
}


