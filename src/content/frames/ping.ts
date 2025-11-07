import { Frame, FrameType } from "../frame";
import { FrameId } from "../ids"; 

export class Ping extends Frame {
  constructor() {
    super(new FrameId(FrameType.Ping, 0))
  }
}
