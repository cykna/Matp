import { Frame, FrameId, FrameType } from "../frame";

export class Ping extends Frame {
  constructor() {
    super(new FrameId(FrameType.Ping, 0))
  }
}
