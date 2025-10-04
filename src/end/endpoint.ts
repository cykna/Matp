import { gen_id } from ".";
import { Frame } from "../content/frame";
import { Bytes } from "../dependencies/bytes";
import { Connection } from "./connection";
import { decode } from "../dependencies/utf16";
import { MatpContent, MatpContentFlags, MatpDatagram, MatpDatagramFlags, MatpDatagramTarget } from "../content/headers";

export class EndPoint {
  //Map with ends ID's
  connections = new Map<number, Connection>;
  id: number;
  buffer: Bytes = Bytes.new(8192);
  datagram: MatpDatagram;

  constructor(id: string) {
    this.datagram = new MatpDatagram(MatpDatagramFlags.None, this.id = gen_id(id));
  }

  process() {
    for (const [endid, conn] of this.connections) {

    }
  }

  /** Retrieves a connection with a sender with given `sender` id. If no connection, then one is created */
  retrieve_connection_with(sender: number) {
    const data = this.connections.get(sender);
    if (!data) {
      const conn = new Connection(sender);
      this.connections.set(sender, conn);
      return conn;
    } else return data;

  }

  /** Reads the provided `data` assumming it is a valid MATP datagram containing at max 8192bytes,
    * and pushes the frames to the respective connections.
    * Returns the amount of bytes read
  */
  recv(data: string) {
    const decoded = decode(data);
    const bytes = new Bytes(decoded.buffer as any);
    const datagram = MatpDatagram.deserialize(bytes);
  }

  /** Enqueues the provided `data` to be sent to the `target`. This uses a RingBuffer internally of size 1024, so old frames must be forgotten.
  This is used to ensure that data don't keep in waiting for so long. It's actually preferred that it's sent and flushed immediatly
  */
  send(target: number, data: Frame.Frame[]) {

    const content = this.datagram.content_of(target) as MatpContent;
    if (content) {
      content.frames.push(...data);
    } else {
      const content = new MatpContent(target, MatpContentFlags.None);
      content.frames.push(...data);
      this.datagram.contents.push(content);
    }
  }
  /** Flushes a multiple packet content */
  private *flush_multiple() {
    let written: boolean;
    let indexes:MatpDatagramTarget[];
    while ([written,indexes] = this.datagram.serialize_deleting(this.buffer)) {
      yield [this.buffer.slice_to_written().raw(), indexes] as [Uint8Array, MatpDatagramTarget[]];
      this.buffer.reset_cursor();
      if (written) break;
    }
  }

  /** Sends all the data enqueued and resets the queue and the buffer to send data.
    Each iteration is a packet sending if the content is >8192.
    Returns the amount of bytes sent
  */
  *flush() {
    yield* this.flush_multiple();
    this.buffer.reset_cursor();
  }
}
