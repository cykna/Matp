
export function random_bytes(seed: number, len: number) {
  
  let now = (seed - len) ^ seed * 7;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = (seed ^ i) | (len << i) & seed;
    seed ^= i;
    seed <<= i;
    seed ^= len - i;
    seed += now;
    now = (now << 1) ^ seed;
  }
  return out;
}
