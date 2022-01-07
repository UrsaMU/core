import { channel, send, Context, Next } from "..";
import { msgFmt } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  if (ctx.player?.channels) {
    for (const ch of ctx.player?.channels || []) {
      // Make a few regexes to search for name and alias
      const alias = new RegExp(`^${ch.alias}`, "i");
      const name = new RegExp(`^${ch.name}`, "i");

      // Check to see if the messasge starts wotj either one.
      if (ctx.msg?.match(alias) || ctx.msg?.match(name)) {
        const chan = await channel.findOne({ name: ch.name });

        // if the channel exists, send a message!
        if (chan) {
          console.log("+++++++++", msgFmt("st :tests"));
          const text = `${chan.header} ${ctx.player.name}${msgFmt(ctx.msg)}`;
          return await send(chan.name, text);
        }

        // else Do nothing
        next();
      }
    }
  } else {
    next();
  }
};
