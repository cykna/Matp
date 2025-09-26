
import { Frame } from "./content/frame";

import { Bytes } from "./dependencies/bytes";
import { RingBuffer } from "./dependencies/ringbuffer";
import { EndPoint, gen_id } from "./end";


function main() {
  
    const endpoint = new EndPoint("Hello world");
    const hel = new EndPoint("Hel");
    const id = gen_id("Hel");

    const frames = [new Frame.ContentFrame(Frame.FrameFlags.Encrypted, Bytes.from_string("Hello World"))];

    endpoint.send(id, frames);
    endpoint.send(id, [new Frame.ContentFrame(Frame.FrameFlags.Encrypted, Bytes.from_string("mamamae"))]);

    for (const data of endpoint.flush()) {
      hel.recv(data);
    }
    hel.process();
}
main();
