import { system } from "@minecraft/server";
import type { Frame } from "../content/frame";
import { MatpContent, MatpDatagramId } from "../content/headers";
import { Bytes } from "../dependencies/bytes";
import { ConnectionConfig, ListenerConnection } from "./connection";
import { EndPoint, type EndPointRecv } from "./endpoint";
import { decode } from "../dependencies/string_encoder";


export class MatpListener extends EndPoint {
  connections = new Map<number, ListenerConnection>;
  constructor(id: string) {
    super(id);
  }

  /** Enqueues the provided `data` to be sent to the `target`. This uses a RingBuffer internally of size 1024, so old frames must be forgotten.
    This is used to ensure that data don't keep in waiting for so long. It's actually preferred that it's sent and flushed immediatly.
    If the provided `target` is not recognized by this endpoint, the first message will be a handshake one and will contain a crypto frame used
    to transfer information
    */
  send(target: number, data: Frame[], handshake = false) {
    const flag = this.connections.has(target);
    if (!flag) throw new Error(`Must stablish a connection with the provided target before sending data`);
    const content = this.datagram.create_content(target, data, handshake);
    
    return content;
  }
  /** Retrieves a connection with a sender with given `sender` id. If no connection, then one is created */
  retrieve_connection_with(sender: number) {
    const data = this.connections.get(sender);
    if (!data) {
      const conn = new ListenerConnection(sender, ConnectionConfig.new_with_random_key());
      this.connections.set(sender, conn);
      return conn;
    } else return data;

  }
  recv(event: EndPointRecv) {
    try {
      const id_content = decode(event.id.slice(5));
      const id = MatpDatagramId.deserialize(new Bytes(id_content.buffer as any)) as MatpDatagramId;

      for (const target of id) {
        

        if (target.target === this.id) {
          
          const connection = this.retrieve_connection_with(id.sender);
          let bytes = decode(event.message);
          bytes.advance_cursor(+target.position);
          bytes = bytes.slice_from_current_with_length(bytes.length() - bytes.cursor);
          {
            
            
            let content;
            try {const cont= MatpContent.deserialize(bytes); content = cont;}catch(e){console.error(e); throw e};
            
            if (content.is_handshake()) connection.recv_handshake(content)
            else connection.recv_normal(content);
            if (connection.has_pending_handshake()) {
              this.send(id.sender, connection.handshake_frames(), true);
              connection.reset_handshake_frames();
            }
            this.emit('on_client_content', connection);
            if (connection.has_pending()) {
              this.send(id.sender, connection.frames(), false);
              connection.reset_frames();
            }
            break;
          }
        }
      }
    } catch { };
  }

  /** Starts listening the incomming requests and emits `on_recv` when some arrives*/
  listen() {

    const self = this;
    system.afterEvents.scriptEventReceive.subscribe(function(ev) {
      self.emit('on_recv', ev);
      self.recv(ev);
    })
  }
}
