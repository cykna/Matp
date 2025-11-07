import { Bytes } from "./dependencies/bytes";
import { MatpStream } from "./end/stream";
import { MatpListener } from "./end/listener";
import { gen_id } from "./end";
import { ButtonState, InputButton, system, world } from "@minecraft/server";
import { Data } from "./content/frames/data";
import { DataFlags } from "./content/ids";

const server = new MatpListener('jorge');
server.addListener('on_client_content', conn => {
  
  for(const _ of server.flush()) {
    console.warn("Eu escrevi");
  }
});
server.listen();
  
let clien:MatpStream;

world.afterEvents.worldLoad.subscribe(async _ => {
  await system.waitTicks(5);
  const [client, handshake] = MatpStream.new_listening('pedro', {
    max_wait_limit: 5,
    targets: ['jorge', 'henrique'],
  });
  client.on('on_fail_handshake', console.warn);
  await handshake;
  try {
    console.warn(client.connections.get(gen_id("jorge")), "oiaki");
    console.warn(server.connections.get(gen_id("pedro")), "oiakio pedro");
  }catch{}
  clien = client;
});
const data = [new Data(DataFlags.None, Bytes.new(2048))];
const amount = 3;
world.afterEvents.playerButtonInput.subscribe(async ev => {
  
  if(ev.button === InputButton.Jump && ev.newButtonState === ButtonState.Pressed) {
    const now = Date.now();
    for(let i = 0; i < amount; i++) {
      await clien.send(gen_id('jorge'), data);
      for(const _ of clien.flush());
    }
    console.warn("Made", amount, "sends in", (Date.now() - now), "ms");
  }
})
