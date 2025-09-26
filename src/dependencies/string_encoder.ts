let read_buf = new Uint16Array(8192);
let out_buf = new Uint8Array(read_buf.buffer);

/** Bytes encoder/decoder to utf16. This is focused on simply compacting 2 bytes into 1 char since js is utf16*/
export namespace StringEncoder {
  /**Encodes the provided `bytes` as a String. Note that this ISN'T utf8 valid, instead, UTF16 in range of 0..2^16-1*/
  export function encode(buf: Uint8Array) {
    const len = buf.length >> 1;
		const out = new Uint16Array(buf.buffer, 0, len>>1);
		if(len & 1) return String.fromCharCode(...out, buf[len-1]!);
		else return String.fromCharCode(...out);
	}
  /**Retrieves the bytes of the provided `str`*/
  export function decode(str: string) {

    const len = str.length;
    if (len > read_buf.length) read_buf = new Uint16Array(str.length); out_buf = new Uint8Array(read_buf.buffer);
    
    for (let i = 0; i < len; i++) read_buf[i] = str.charCodeAt(i);
    
    const out_len = (len << 1) - ((read_buf[len - 1]! <= 0xff) as any);
    return out_buf.subarray(0, out_len);
  }
}
