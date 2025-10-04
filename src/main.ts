import { Frame } from "./content/frame";
import { MatpDatagramId } from "./content/headers";
import { Bytes } from "./dependencies/bytes";
import { encode } from "./dependencies/utf16";

import { EndPoint, gen_id } from "./end";

async function main() {
  const server = new EndPoint("pedrolegal");
  const client = new EndPoint("slaoq");
  const idof =gen_id("pedrolegal");
  const framearr = new Frame.FrameArray();
  framearr.push(new Frame.Ping);
  client.send(idof, framearr);
  const idbuf = Bytes.new(256);
  for(const data of client.flush()) {
    const id = new MatpDatagramId(data[0].length, ...data[1]);
    const 
    console.log(id);
    server.recv(encode(data[0]));
  }

}
main();
