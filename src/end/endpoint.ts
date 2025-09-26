import { ok, Result, safeTry } from "neverthrow";
import { gen_id } from ".";
import { Frame } from "../content/frame";
import { Bytes } from "../dependencies/bytes";
import { Connection } from "./connection";
import { RingBuffer } from "../dependencies/ringbuffer";

export class EndPoint {
  //Map with ends ID's
  connections = new Map<number, Connection>;
  id: number;
  buffer: Bytes = Bytes.new(8192);

  queue: Map<number, RingBuffer<Frame.Frame>> = new Map;
  queue_amount = 0;

  constructor(id: string) {
    this.id = gen_id(id);
  }

  process() {
    for (const [endid, conn] of this.connections) {
      console.log(conn);
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
  recv(data: Uint8Array): Result<number, Frame.FrameError> {
    const bytes = new Bytes(data.buffer as any);
    const multiple_data = bytes.read_u8() == 0xff;
    const sender = bytes.read_u32();
    let receiver = bytes.read_u32();
    const conn = this.retrieve_connection_with(sender);
    {
      if (multiple_data) while (receiver != this.id) {
        const len = bytes.read_u16();
        bytes.advance_cursor(len);
        if (bytes.remaining() <= 0) return ok(0);
        receiver = bytes.read_u32();
      } else if (receiver != this.id) return ok(0);
    }

    const len = bytes.read_u16();
    const owned_data = bytes.slice_from_current_with_length(len);
    let read_amount = 0;

    let frame: Frame.Frame;
    return safeTry<number, Frame.FrameError>(function*() {
      const frames = [] as Frame.Frame[];
      while (
        owned_data.remaining() > 0 &&
        (frame = yield* Frame.read_frame(owned_data))
      ) {
        read_amount += frame.len();
        frames.push(frame);
      };
      conn.recv(frames);
      return ok(read_amount);
    });

  }

  /** Enqueues the provided `data` to be sent to the `target`. This uses a RingBuffer internally of size 1024, so old frames must be forgotten.
  This is used to ensure that data don't keep in waiting for so long. It's actually preferred that it's sent and flushed immediatly
  */
  send(target: number, data: Frame.Frame[]) {
    const queue = this.queue.get(target);
    if (queue) {
      this.queue_amount += (queue.length() == 0) as any;
      for(const frame of data) queue.push_circular(frame);
    } else {
      this.queue_amount++;
      const buffer = new RingBuffer<Frame.Frame>(1024);
      {
        let idx = 0;
        let frame;
        while((frame = data[idx++]) && buffer.push(frame));
      }
      this.queue.set(target, buffer);
    }
  }

  /** Resets the buffer to be ready to write more content */
  private reset_buffer() {
    this.buffer.reset_cursor().advance_cursor(5);
  }

  private write_basic_data() {
    if (this.buffer.cursor != 0) throw new Error("Maluco o cursor precisa ser 0");
    this.buffer
      .write_u8(0xff * (this.queue_amount > 1 as any))
      .write_u32(this.id);
  }

  /** Writes the provided `frame` into `buf` asserting it does not overflow it*/
  static write_frame_sliced(buf: Bytes, frame: Frame.ContentFrame) {
    const slice = frame.sliced(Math.min(frame.payload_len(), buf.remaining()));
    slice.write_to(buf);
  }

  /** Flushes the given data assuming the target is `target` and the content is a multi-data packet. And returns the amount of frame written */
  protected flush_frames_to(target: number, frames: Frame.Frame[], start = 0) {
    if (start >= frames.length) return 0;
    const cursor = this.buffer.write_u32(target).advance_cursor(2);

    let len = 0;
    let amount = 0;
    let frame;
    while ((frame = frames[start++]) && this.buffer.remaining() > 0) {
      switch (frame.id.ty) {
        case Frame.FrameType.Content: {
          EndPoint.write_frame_sliced(this.buffer, frame as Frame.ContentFrame);
          break;
        }
        default: {
          
        }
      }
      len += frame.len(); amount++;
    }

    this.buffer.write_u16_at(len, cursor);
    return amount
  }
  /** Flushes a multiple packet content */
  private *flush_multiple() {
    for (const [target, frames] of this.queue) {
      this.flush_frames_to(target, frames);
      if (this.buffer.remaining() <= 0) {
        yield this.buffer.slice_to_written().raw();
        this.reset_buffer();
      }
    }
    if (this.buffer.cursor !== 5) yield this.buffer.slice_to_written().raw();
    this.reset_buffer();
  }

  private *flush_single() {
    const [target, frames] = this.queue.entries().next().value!;
    let written_amount = 0;
    let offset = 0;
    while (written_amount = this.flush_frames_to(target, frames, offset)) {
      offset += written_amount;
      yield this.buffer.slice_to_written().raw();
      this.reset_buffer();
    }
  }

  /** Sends all the data enqueued and resets the queue and the buffer to send data.
    Each iteration is a packet sending if the content is >8192.
    Returns the amount of bytes sent
  */
  *flush() {
    if (this.queue_amount == 0) return 0;
    this.write_basic_data();
    if (this.queue_amount > 1) yield* this.flush_multiple();
    else yield* this.flush_single();
  }
}
