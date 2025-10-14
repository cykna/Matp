/** Rotates `x` bits by `k` */
export function rotl(x: number, k: number) {
  return (x << k) | (x >>> (32 - k));
}
