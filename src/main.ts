import * as edch from "@noble/secp256k1";
import { hkdf } from "@noble/hashes/hkdf";
import { sha256 } from "@noble/hashes/sha256";
import { Bytes } from "./dependencies/bytes";
import { MatpStream } from "./end/stream";
import { MatpListener } from "./end/listener";
import { gen_id } from "./end";
import { system } from "@minecraft/server";
import { decode } from "base32768";
import { MatpDatagram, MatpDatagramId } from "./content/headers";


const salt = Bytes.from_string('encrypt-data').raw();
const info = Bytes.from_string('matp').raw();

globalThis.crypto = new class {

  getRandomValues = function <T extends ArrayLike<number>>(arr: T) {
    let i = arr.length;
    while (i--) (arr as any)[i] = (Math.random() * 0xff) | 0;
    return arr;
  }
  generate_encrypting_key(secret: Uint8Array, publik: Uint8Array, len = 32) {
    const shared = edch.getSharedSecret(secret, publik);
    return hkdf(sha256, shared, salt, info, len);
  }
} as any;

async function main() {

  const server = new MatpListener('jorge');
  server.addListener('on_client_content', conn => {
    console.warn(conn.end);
    server.write_blocking();
  });
  server.listen();

  const [client, handshake] = MatpStream.new_listening('pedro', {
    max_wait_limit: 1,
    targets: ['jorge', 'henrique'],
    blocking_thread: false
  });
  client.on('on_fail_handshake', console.warn);
  await handshake;
  console.warn(client.connections.get(gen_id("jorge"))!.shared_key);
  console.warn(server.connections.get(gen_id("pedro"))!.shared_key)

}
main();
