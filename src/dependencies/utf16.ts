/**
  Base32768 is a binary-to-text encoding optimised for UTF-16-encoded text.
  (e.g. Windows, Java, JavaScript)
*/

// Z is a number, usually a uint15 but sometimes a uint7

const BITS_PER_CHAR = 15 // Base32768 is a 15-bit encoding
const BITS_PER_BYTE = 8

const pairStrings = [
  'ҠҿԀԟڀڿݠޟ߀ߟကဟႠႿᄀᅟᆀᆟᇠሿበቿዠዿጠጿᎠᏟᐠᙟᚠᛟកសᠠᡟᣀᣟᦀᦟ᧠᧿ᨠᨿᯀᯟᰀᰟᴀᴟ⇠⇿⋀⋟⍀⏟␀␟─❟➀➿⠀⥿⦠⦿⨠⩟⪀⪿⫠⭟ⰀⰟⲀⳟⴀⴟⵀⵟ⺠⻟㇀㇟㐀䶟䷀龿ꀀꑿ꒠꒿ꔀꗿꙀꙟꚠꛟ꜀ꝟꞀꞟꡀꡟ',
  'ƀƟɀʟ'
]

const lookupE:Record<string, string[]> = {}
const lookupD:Record<string, [number,number]> = {}
pairStrings.forEach((pairString, r) => {
  // Decompression
  const encodeRepertoire = [] as string[]
  pairString.match(/../gu)?.forEach(pair => {
    const first = pair.codePointAt(0)!
    const last = pair.codePointAt(1)!;
    for (let codePoint = first; codePoint <= last; codePoint++) {
      encodeRepertoire.push(String.fromCodePoint(codePoint))
    }
  })

  const numZBits = BITS_PER_CHAR - BITS_PER_BYTE * r // 0 -> 15, 1 -> 7
  lookupE[numZBits] = encodeRepertoire
  encodeRepertoire.forEach((chr, z) => {
    lookupD[chr] = [numZBits, z]
  })
});

Object.freeze(lookupE);
Object.freeze(lookupD);

const encode = (uint8Array:Uint8Array) => {
  const length = uint8Array.length

  let str = ''
  let z = 0
  let numZBits = 0

  for (let i = 0; i < length; i++) {
    const uint8 = uint8Array[i]!;

    // Take most significant bit first
    for (let j = 7; j >= 0; j--) {
      z = (z << 1) | ((uint8 >> j)&1);
      if (++numZBits === 15) {
        str += lookupE[numZBits]![z]
        z = numZBits = 0
      }
    }
  }

  if (numZBits !== 0) {
    while (!(numZBits in lookupE)) {
      z = (z << 1)+1;
      numZBits++
    }
    str += lookupE[numZBits]![z]!
  }

  return str
}

const decode = (str:string) => {
  const length = str.length;
  const lenminus = length-1;

  // This length is a guess. There's a chance we allocate one more byte here
  // than we actually need. But we can count and slice it off later
  const uint8Array = new Uint8Array(Math.floor(length * BITS_PER_CHAR / BITS_PER_BYTE))
  let numUint8s = 0
  let uint8 = 0
  let numUint8Bits = 0

  for (let i = 0; i < length; i++) {
    const chr = str.charAt(i)

    if (!(chr in lookupD)) {
      throw new Error(`Unrecognised Base32768 character: ${chr}`)
    }

    const [numZBits, z] = lookupD[chr]!

    if (numZBits !== 15 && i !== lenminus) {
      throw new Error('Secondary character found before end of input at position ' + String(i))
    }

    // Take most significant bit first
    for (let j = numZBits - 1; j >= 0; j--) {
      uint8 = (uint8 << 1) | ((z >> j) & 1)
      if (++numUint8Bits === 8) {
        uint8Array[numUint8s++] = uint8
        uint8 = numUint8Bits = 0
      }
    }
  }

  return new Uint8Array(uint8Array.buffer, 0, numUint8s)
}

export { encode, decode }
