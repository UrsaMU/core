import { force, dbObj, flags, addCmd, channel, send } from "..";
import { toggleChan } from "../utils/utils";

export default () => {
  addCmd({
    name: "@ccreate",
    flags: "staff+ connected",
    pattern: /@ccreate\s+(.*)?/i,
    render: async (ctx, args) => {
      const pcs = args[1].split("=");

      const regex = new RegExp(pcs[0], "i");
      const exists = await channel.find({ name: regex });
      if (exists.length <= 0) {
        const chan = await channel.create({
          name: pcs[0],
          read: "connected",
          write: "connected",
          modify: "staff+",
          header: `%ch[${pcs[0]}]%cn`,
          join: pcs[1] ? pcs[1] : undefined,
        });

        if (chan) {
          return send(ctx.id, `Done. Channel %ch${chan.name}%cn created.`);
        }

        send(ctx.id, "Unable to create channel.");
      } else {
        send(ctx.id, "That channel already exists");
      }
    },
  });

  addCmd({
    name: "addchan",
    pattern: "addchan *=*",
    flags: "connected",
    render: async (ctx, args) => {
      const regex = new RegExp(`${args[2]}`, "i");
      const chan = await channel.findOne({ name: regex });
      console.log(regex, chan);
      if (chan && flags.check(ctx.player?.flags || "", chan.read)) {
        const added = ctx.player?.channels.find((ch) => ch.name === chan.name);
        if (!added) {
          ctx.player?.channels.push({
            name: chan.name,
            alias: args[1],
            joined: false,
          });
          send(
            ctx.id,
            `Done. Channel %ch${chan.name}%cn added with alias %ch${args[1]}%cn.`
          );
          return toggleChan(ctx, chan.name);
        }
        send(
          ctx.id,
          `Channel %ch${added.name}%cn already added with alias: %ch${added.alias}%cn`
        );
      } else {
        send(ctx.id, "I can't find that channel.");
      }
    },
  });
};
