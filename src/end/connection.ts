import type { Frame } from "../content/frame";
import type { MatpContent } from "../content/headers";
import { RingBuffer } from "../dependencies/ringbuffer";

/** A Connection interface to talk to another End */
export class Connection {
  frames: RingBuffer<Frame.Frame> = new RingBuffer(1024);
  constructor(public readonly end:number){
    
  }

  /** Manages the `frames` received from the end this connection stablished connection to */
  recv(content: MatpContent) {
    console.log(content)
  } 
}
