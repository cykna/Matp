
import { Bytes } from "./bytes";

///When serializing data, this will serialize them normally as bytes, the only difference is with Optinals, that use an extra byte.
///This extra byte is indeed used to track metadata in general.
///[2bit: UnusedByNow][1Bit:Struct][1Bit:Optional][4Bit:UnusedByNow]. If the field used to deserialize has an optional, it will check
///if the 4th bit is 1, if so, the value is Some, else it's None, so stop reading and goes to the next
///So this byte, called, METADATA_BYTE is used simply to get track of flags for some metadata


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

const FieldReadMap: Record<FieldType, (bytes: Bytes) => number> = {
  [FieldType.u8]: (bytes: Bytes) => bytes.read_u8(),
  [FieldType.u16]: (bytes: Bytes) => bytes.read_u16(),
  [FieldType.u32]: (bytes: Bytes) => bytes.read_u32(),
  [FieldType.i8]: (bytes: Bytes) => bytes.read_i8(),
  [FieldType.i16]: (bytes: Bytes) => bytes.read_i16(),
  [FieldType.i32]: (bytes: Bytes) => bytes.read_i32(),
  [FieldType.f32]: (bytes: Bytes) => bytes.read_f32(),
  [FieldType.f64]: (bytes: Bytes) => bytes.read_f64(),
} as any;

export const PrimitiveTypeSize = {
  [FieldType.i8]: 1,
  [FieldType.i16]: 2,
  [FieldType.i32]: 4,

  [FieldType.u8]: 1,
  [FieldType.u16]: 2,
  [FieldType.u32]: 4,

  [FieldType.f32]: 4,
  [FieldType.f64]: 8
}

export function Field(type: FieldType | typeof Struct) {
  return function <Clazz>(target: Clazz, prop: string) {
    const construct = (target as any).constructor;
    (construct.field_names ??= []).push(prop);
    (construct.fields ??= {})[prop] = type;
  }
}

/** Retrieves a value from the given `bytes` of type `ty` */
export function retrieve_value_from(ty: FieldType, bytes: Bytes): any {
  if (ty & FieldType.Optional) { //has optional
    const byte = bytes.read_u8();
    const byte_opt = byte & FieldType.Optional;
    //if type has struct and is optional
    if (ty & FieldType.Struct && byte_opt) return ToParseStruct;
    return byte_opt ? FieldReadMap[ty & ~FieldType.Optional](bytes) : undefined;
  }
  return FieldReadMap[ty](bytes);
}

/** Returns the size in bytes of the provided `ty` */
export function size_of(ty: FieldType | Struct): number {
  if (ty instanceof Struct) return ty.byte_size();
  else {
    if (ty & FieldType.Optional) return PrimitiveTypeSize[ty & ~FieldType.Optional] + 1;
    else return PrimitiveTypeSize[ty]
  }
}

//Writes are faster with switch, but reads are faster with a map. Maybe due to the inline and to be needed to pass only the
//reference of the byte array
export function write_field(field_type: FieldType, value: number, bytes: Bytes) {
  if ((field_type & FieldType.Optional) !== 0) bytes.write_u8(FieldType.Optional);

  switch (field_type & 0b1111) {
    case FieldType.i8: return bytes.write_i8(value);
    case FieldType.i16: return bytes.write_i16(value);
    case FieldType.i32: return bytes.write_i32(value);
    case FieldType.f16: return bytes.write_f16(value);
    case FieldType.f32: return bytes.write_f32(value);
    case FieldType.f64: return bytes.write_f64(value);
    case FieldType.u8: return bytes.write_u8(value);
    case FieldType.u16: return bytes.write_u16(value);
    case FieldType.u32: return bytes.write_u32(value);
    
  }
}

/** A base class used to serialize/deserialize the fields of this into a binary form */
export abstract class Struct {

  static deserialize<T extends Struct, C extends abstract new (...args: any[]) => T>(this: C, bytes: Bytes): InstanceType<C> {
    const out = new (this as any);
    const fields = this.fields;
    console.warn("desserializando ", bytes.raw())
    for (const field of this.field_names) {
      const field_type = fields[field] as FieldType | typeof Struct;
      try {
        out[field] = typeof field_type === 'number' ? retrieve_value_from(field_type, bytes) : field_type.deserialize(bytes);
      }catch(e){
        console.error(e, "falhou no field", field);
      }
      
    }
    return out;
  }

  byte_size() {
    let byte_size = 0;
    const fields = this.constructor.fields;
    for (const field of this.constructor.field_names) {
      const field_type = fields[field];
      byte_size += typeof field_type === 'number' ? size_of(field_type) : (this[field] as Struct).byte_size();
    }
    return byte_size;
  }

  serialize(bytes: Bytes) {
    const fields = this.constructor.fields;
    for (const field of this.constructor.field_names) {
      const field_type = fields[field] as FieldType | Struct;
      typeof field_type === 'number' ? write_field(field_type, this[field], bytes): this[field].serialize(bytes)
    }
  }
}

export type ConstructorOf<S extends Struct> = {
  new(...args: any[]): S;
  deserialize(bytes: Bytes): S | undefined;
}

export function Option<S extends Struct, Cs extends ConstructorOf<S>>(ty: Cs) {
  return class Optional extends Opt<S> {
    private static readonly target = ty;
    static override deserialize(bytes: Bytes): S | undefined {
      const metadata = retrieve_value_from(FieldType.Optional | FieldType.Struct, bytes);
      if (metadata === ToParseStruct) return this.target.deserialize(bytes);
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


