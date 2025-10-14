import { gen_id } from ".";
import { MatpContent, MatpDatagramId } from "../content/headers";
import { Bytes } from "../dependencies/bytes";
import { ConnectionConfig, StreamConnection } from "./connection";
import { EndPoint, type EndPointRecv } from "./endpoint";
import type { Frame } from "../content/frame";
import { system } from "@minecraft/server";
import { decode } from "base32768";

export interface StreamCreationOptions {
  max_wait_limit: number;
  targets: string[];
  blocking_thread: boolean
}

export class MatpStream extends EndPoint {
  /** Creates a new Stream that will try to connect to the provided targets, emitting for those who it fails */
  static new(id: string, options:StreamCreationOptions): [MatpStream, Promise<MatpStream>] {
    const stream = new MatpStream(id);
    const promises = options.targets.map(t => new Promise(async (ok, err) => {
      const handshake = stream.start_handshake(gen_id(t));
      return Promise.race([system.waitTicks(options.max_wait_limit).then(err), handshake.then(ok)]);
    }));
    system.runJob(stream.flush());

    return [
      stream,
      Promise.allSettled(promises)
      .then(results => {
        let i = 0;
        for (const result of results) {
          if (result.status === "rejected") {
            stream.emit('on_fail_handshake', options.targets[i]!);
            stream.connections.delete(gen_id(options.targets[i]!));
          }
          i++
        }
      })
      .then(_ => stream)
    ];
  }
  /** Creates a new Stream that will try to connect to the provided targets, emitting for those who it fails. The difference to MatpStream.new is that this starts listennig automatically */
  static new_listening(id: string, options:StreamCreationOptions): [MatpStream, Promise<MatpStream>] {
    
    const stream = new MatpStream(id);
    stream.listen();
    const promises = options.targets.map(t => new Promise((ok, err) => {
      const handshake = stream.start_handshake(gen_id(t));
      return Promise.race([system.waitTicks(options.max_wait_limit).then(err), handshake.then(ok)]);      
    }));
    if(options.blocking_thread) for(const _ of stream.flush());
    else system.runJob(stream.flush());

    return [
      stream,
      Promise.allSettled(promises)
      .then(results => {
        let i = 0;
        for (const result of results) {
          if (result.status === "rejected") {
            stream.emit('on_fail_handshake', options.targets[i]!);
            stream.connections.delete(gen_id(options.targets[i]!))
          }

          i++
        }
      })
      .then(_ => stream)
    ];
  }
  connections: Map<number, StreamConnection> = new Map;
  constructor(id: string) {
    super(id);
    this.addListener('on_recv', this.recv.bind(this));
  }

  /** Enqueues the provided `data` to be sent to the `target`. The internal data structure is a LIFO, so the last element inserted is the first sent
    If the provided `target` is not recognized by this endpoint, the first message will be a handshake one and will contain a crypto frame used
    to transfer information and this function will wait for the handshake to be stablished
    */
  async send(target: number, data: Frame[], handshake = false) {
    await this.retrieve_connection_with(target);
    const content = this.datagram.create_content(target, data, handshake);
    return content;
  }

  /** Retrieves a connection with a sender with given `sender` id. If no connection, then one is created */
  async retrieve_connection_with(sender: number) {
    const data = this.connections.get(sender);
    if (!data) {
      await this.start_handshake(sender);
      return this.connections.get(sender)!;
    } else return data;
  }


  /**
    Tries to start a handshake with the provided `target`. Fails if the target is known.
    This will generate a promise that has no way to know when to reject or resolve.
    It will only resolve when receiving a handshake content from the provided `target`.
  */
  async start_handshake(target: number) {
    if (this.connections.has(target)) throw new Error(`A connection with the provided target of id ${target} already exists`);
    const [conn, out] = StreamConnection.new(target, ConnectionConfig.new_with_random_key());
    this.connections.set(target, conn);
    this.send(target, conn.retrieve_handshake_frames(), true);
    return await out;
  }

  async recv(event: EndPointRecv) {
    try {
      const id_content = decode(event.id.slice(5));
      const id = MatpDatagramId.deserialize(new Bytes(id_content.buffer as any)) as MatpDatagramId;

      for (const target of id) {

        if (target.target === this.id) {
          const connection = this.connections.get(id.sender);
          if (!connection) return;
          const bytes = new Bytes(decode(event.message).buffer as any, +target.position);
          {
            const content = MatpContent.deserialize(bytes);
            if (content.is_handshake()) connection.recv_handshake(content);
            else connection.recv_normal(content);
            this.emit('on_server_content', connection);
            if (connection.has_pending()) {
              this.send(id.sender, connection.frames(), false);
              connection.reset_frames();
            }

          }
        }
      }
    } catch { };
  }
  /** Starts listening to incomming messages from servers */
  listen() {
    system.afterEvents.scriptEventReceive.subscribe(ev => {
      this.emit('on_recv', ev);
      this.recv(ev)
    })
  }
}
