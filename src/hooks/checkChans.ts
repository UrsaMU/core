import { channel, send, Context, Next } from "..";
import { msgFmt, toggleChan } from "../utils/utils";

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
          // Check to see if the channel is being toggled.
          const msgPieces = ctx.msg?.split(" ");
          if (msgPieces) {
            msgPieces.shift();
            const msg = msgPieces?.join(" ").trim();

            if (msg === "off") {
              if (!ch.joined)
                return send(ctx.id, "You've already left that channel!");
              send(ctx.id, `You quietly leave the %ch${chan.name}%cn channel.`);
              return toggleChan(ctx, chan.name);
            }

            if (msg === "on")
              if (ch.joined)
                return send(ctx.id, "You've already joined that channel.");
            return toggleChan(ctx, chan.name, true);
          }

          if (!ch.joined) return send(ctx.id, "You aren't on that channel.");

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
