import { dbObj, io,addCmd, channel, send } from "..";

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

        if (chan && ctx.player) {
          ctx.player.channels.push({
            name: pcs[0],
            alias: pcs[1] ? pcs[1] : "",
            joined: true,
          });
          
          ctx.socket?.join(pcs[0]);
          send(pcs[0], `${chan.header} ${ctx.player.name} has joined the channel.`);

          await dbObj.update({ dbref: ctx.player.dbref }, ctx.player);
          return send(ctx.id, `Done. Channel %ch${pcs[0]}%cn created.`);
        }
        send(ctx.id, "Unable to create channel.");
      } else {
        send(ctx.id, "That channel already exists");
      }
    },
  });
};
