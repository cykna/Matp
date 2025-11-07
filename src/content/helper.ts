import { Bytes } from "../dependencies/bytes";
import { Frame, FrameType } from "./frame";
import { Data, Ping, Crypto } from "./frames";
import { FrameId } from "./ids";
import { VarId } from "./varid";
/** Deserialized the given `bytes` and tries to return some valid frame. If none, then returns undefined*/
Frame.deserialize = function(bytes: Bytes): Frame | undefined {
    
    const id = FrameId.from(bytes.read_u8());
    switch (id.ty) {
      case FrameType.Ping: return new Ping;
      case FrameType.Crypto: {
        const identifier = VarId.deserialize(bytes);
        const len = VarId.deserialize(bytes);
        const slice = bytes.slice_from_current_with_length(+len);
        return new Crypto(id.flags, slice, identifier);
      };
      case FrameType.Content: {
        const identifier = VarId.deserialize(bytes);
        const len = VarId.deserialize(bytes);
        const slice = bytes.slice_from_current_with_length(+len);
        return new Data(id.flags, slice, identifier);
      }
      default: return undefined;
    }

  }
