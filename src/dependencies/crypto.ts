import { getSharedSecret } from "@noble/secp256k1";
import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";
import { Bytes } from "./bytes";

const salt = Bytes.from_string('encrypt-data').raw();
const info = Bytes.from_string('matp').raw();
globalThis.crypto = new class {

  getRandomValues = function <T extends ArrayLike<number>>(arr: T) {
    let seed = (Date.now() / 7) | 0;
    let j = arr.length;
    let now = (seed - j) ^ seed * 7;

    for (let i = 0; i < j; i++) {
      arr[i] = (seed ^ i) | (j << i) & seed;
      seed ^= i;
      seed <<= i;
      seed ^= j - i;
      seed += now;
      now = (now << 1) ^ seed;
    }
    return arr;
  }
  generate_encrypting_key(secret: Uint8Array, publik: Uint8Array, len = 32) {
    const shared = getSharedSecret(secret, publik);
    return hkdf(sha256, shared, salt, info, len);
  }
} as any;
