export { EndPoint } from "./endpoint";
export { Connection } from "./connection";

/**Generates an u32 hash value for the provided `name` using the current minute as key */ 
export function gen_id(name:string) {
    let hash = 2166136261; // FNV-1a 32-bit offset basis
    for (const c of name) {
        hash ^= c.charCodeAt(0);
        hash = (hash * 16777619) >>> 0; // keep 32-bit
    }
    return hash >>> 0; // ensure unsigned 32-bit
}


