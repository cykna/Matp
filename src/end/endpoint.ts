import "../dependencies/crypto";
import { gen_id, ListenerConnection, StreamConnection } from ".";
import { Bytes } from "../dependencies/bytes";
import { MatpDatagram, MatpDatagramId, } from "../content/headers";
import EventEmitter from "eventemitter3";
import { system } from "@minecraft/server";
import { encode } from "../dependencies/string_encoder";
import { MAX_DATAGRAM_SIZE } from "../dependencies/constants";
import "../content/helper";

export type EndPointRecv = { message: string; id: string };

export interface EndPointEvents {
  /** Event used when receiving some datafrom any addon. Simply a wrapper over system.afterEvents.receiveScriptEvent */
  on_recv: (content: EndPointRecv) => void;
  /** Event used when receiving some content from a server. `conn` is the client connection the content was sent to.*/
  on_server_content: (conn:StreamConnection)=>void;
  /** Event used when receiving some content from a clinet. `conn` is the client connection the content was sent to. */
  on_client_content: (conn:ListenerConnection)=>void;
  /** Event used when a client tries to stablish a handshake with an addon and fails */
  on_fail_handshake:(target:string) => void;
  
}

export abstract class EndPoint extends EventEmitter<EndPointEvents> {
  //Map with ends ID's
  
  id: number;
  id_bytes = Bytes.new(256);
  buffer: Bytes = Bytes.new(MAX_DATAGRAM_SIZE);
  datagram: MatpDatagram;

  constructor(id: string) {
    super();
    this.datagram = new MatpDatagram(this.id = gen_id(id));
  }

  /** Flushes a multiple packet content */
  private *flush_multiple() {
    let written: boolean;
    let id: MatpDatagramId;
    
    while ([written, id] = this.datagram.serialize_deleting(this.buffer)) {
      const buffer = this.buffer.slice_to_written().raw();
      id.serialize(this.id_bytes);
      yield [buffer, this.id_bytes.slice_to_written().raw()] as [Uint8Array, Uint8Array];
      this.buffer.reset_cursor();
      this.id_bytes.reset_cursor();
      if (written) break;
    }
  }

  /** Yields the enqueued data as already to send Datagrams in binary form as well as the correspondent ID for it. This is a generator because this can generate more than a single Datagram to be sent dependending on the sizes of the content being sent and the max amount the receiver expects
    Note that when sending to an end, the bytes must be converted to string. After sending, clears all content to be ready to send new data on a next write*/
  *flush() {
    if(this.datagram.length > 0)
    for(const [datagram, id] of this.flush_multiple()){
      yield system.sendScriptEvent('matp:'+encode(id), encode(datagram));
    }
    this.buffer.reset_cursor();
  }

  /** Flushes the contents and writes them to be sent to the targets async. This uses runJob so it wont block the thread */ 
  write(){
    system.runJob(this.flush());
  }
  /** Flushes the content and writes them to be sent to the targets sync. This DOES NOT use runJob so it WILL block the thread */
  write_blocking(){
    for(const _ of this.flush());
  }
}

