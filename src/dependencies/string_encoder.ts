import { Bytes } from "./bytes";

export function decode(str:string) {
  const bytes = Bytes.new(str.length);
  for(let i = 0, j = str.length; i < j; i++) {
    bytes.write_u8(str.charCodeAt(i)-14);
  }
  return bytes;
}
export function encode(bytes:Uint8Array) {
  return String.fromCharCode.apply(null, Array.from({length: bytes.length}, (_, idx) => bytes[idx]!+14));
}
