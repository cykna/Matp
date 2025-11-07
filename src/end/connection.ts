import { xchacha20poly1305 } from "@noble/ciphers/chacha.js"
import { keygen, getSharedSecret } from "@noble/secp256k1";
import { sha256 } from "@noble/hashes/sha256";
import { Frame, FrameType} from "../content/frame";
import {Crypto, TransferParameter} from "../content/frames/crypto";
import { MatpContent } from "../content/headers";
import { hkdf } from "@noble/hashes/hkdf";
import { Bytes } from "../dependencies/bytes";
import type { CipherWithOutput } from "@noble/ciphers/utils.js";
import { MAX_DATAGRAM_SIZE } from "../dependencies/constants";



/** A representation of the connection between 2 ends. This is used to receive and send data to an specific target, this one being a stream(aka 'client')*/
export class ConnectionConfig {
  private static MATP_BYTES = Bytes.from_string('matp').raw();
  private static MATP_PROTO = Bytes.from_string('matp-protocol').raw();
  public static new_with_random_key() {
    return new this(crypto.getRandomValues(new Uint8Array(64)))
  }

  public readonly public_key: Uint8Array;
  public readonly private_key: Uint8Array;
  public max_datagram_size = MAX_DATAGRAM_SIZE;
  public wait_base = 2;
  constructor(key: Uint8Array) {
    if (key.length < 64) throw new Error("Key must have at least 64 bytes");
    ({ publicKey: this.public_key, secretKey: this.private_key } = keygen(key));
  }

  /** Retrieves a private shared key ready to use between this private key and the provided public. */
  retrieve_shared(public_key: Uint8Array) {
    const shared = getSharedSecret(this.private_key, public_key);
    return hkdf(sha256, shared, ConnectionConfig.MATP_PROTO,ConnectionConfig.MATP_BYTES, 32);
  }

  with_max_datagram_size(size: number) {
    this.max_datagram_size = size;
    return this;
  }
  with_base(base: number) {
    this.wait_base = base;
    return this;
  }
  generate_transfer_parameters() {
    return new TransferParameter(this.public_key, 0xffff, this.max_datagram_size, this.wait_base);
  }
}


const HANDSHAKE_BYTES = Bytes.from_string("HANDSHAKE_WITH_SOME_SHIT").raw();

/** A Connection interface to talk to another End. This is called ListenerConnection because it a connection that a listener holds to interact with a client */
export class ListenerConnection {


  protected shared_key = new Uint8Array(32);
  private contents = [] as Frame[];
  private handshake = [] as Frame[];
  private encrypt?: CipherWithOutput
  constructor(public readonly end: number, private config: ConnectionConfig) { }

  /** Checks weather there are contents to be written to the end */
  has_pending() {
    return this.contents.length > 0;
  }
  /** Checks weather there are contents to be written to the end */
  has_pending_handshake() {
    return this.handshake.length > 0;
  }

  retrieve_handshake_frames() {
    return [Crypto.transport(this.config.generate_transfer_parameters())]
  }


  /** Manages the provided `content` asserting it's not a handshake one */
  recv_normal(content: MatpContent) { }

  /** Manages the provided `content` asserting it's a handshake one.
    If this is a server connection, it writes on the contents a new crypto frame to be sent back to the client.
    If this is a client connection instead, this will resolve the waiting handshake promise and finish the handshake*/
  recv_handshake(content: MatpContent) {
    for (const frame of content.frames) {
      if (frame.id.ty === FrameType.Crypto) {
        const transfer = (frame as Crypto).retrieve_transport();
        this.shared_key.set(this.config.retrieve_shared(transfer.key!));
        this.encrypt = xchacha20poly1305(this.shared_key, HANDSHAKE_BYTES)
      }
    }
    this.write_handshake();
  }

  write_handshake() {
    this.handshake.push(...this.retrieve_handshake_frames());
  }
  handshake_frames(){
    return this.handshake;
  }
  reset_handshake_frames(){
    return this.handshake.length = 0;
  }
  frames() {
    return this.contents;
  }
  reset_frames() {
    this.contents.length = 0;
  }
}

/** A representation of the connection between 2 ends. This is called StreamConnection because it a connection that a stream(aka client) holds to interact with a server(aka listener)*/
export class StreamConnection {
  /** Creates a new connection and returns it as well as a promise that will resolve only when the connection receives a handshake */
  static new(end: number, config: ConnectionConfig): [StreamConnection, Promise<void>] {
    const out = new StreamConnection(end, config);
    const promise = new Promise(ok => (out.promise = ok));
    return [out, promise as any]
  }
  protected shared_key = new Uint8Array(32);
  private contents = [] as Frame[];
  private encrypt?: CipherWithOutput;
  private promise?: (_: void) => void;

  constructor(protected end: number, protected config: ConnectionConfig) { }

  /** Checks weather there are contents to be written to the end */
  has_pending() {
    return this.contents.length > 0;
  }

  retrieve_handshake_frames() {
    return [Crypto.transport(this.config.generate_transfer_parameters())]
  }

  /** Manages the provided `content` asserting it's not a handshake one */
  recv_normal(content: MatpContent) { }

  /** Manages the provided `content` asserting it's a handshake one.
    If this is a server connection, it writes on the contents a new crypto frame to be sent back to the client.
    If this is a client connection instead, this will resolve the waiting handshake promise and finish the handshake*/
  recv_handshake(content: MatpContent) {
    for (const frame of content.frames) {
      if (frame.id.ty === FrameType.Crypto) {
        const transfer = (frame as Crypto).retrieve_transport();
        this.shared_key.set(this.config.retrieve_shared(transfer.key!));
        this.encrypt = xchacha20poly1305(this.shared_key, HANDSHAKE_BYTES)
      }
    }
    this.promise?.();
  }

  write_handshake() {
    this.contents.push(...this.retrieve_handshake_frames());
  }

  frames() {
    return this.contents;
  }
  reset_frames() {
    this.contents.length = 0;
  }
}
