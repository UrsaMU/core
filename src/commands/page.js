module.exports = {
  name: "page",
  pattern: /^p[age]*\s+?(?:(.*)=)?(.*)/i,
  flags: "connected",
  render: async (args, ctx) => {
    const list = args[1] || ctx.player.temp?.pagelist || "";

    if (!list) return ctx.mu.send(ctx.id, "No one to page!");
    // This one's a little complciated so I'm going to leave some notes for later.
    // first, we need to work through the list and get actual character information.
    const targets = [];
    for (const tar of list.split(" ")) {
      const target = await ctx.mu.target(ctx.player, tar);
      if (target) targets.push(target);
    }

    // Now we need to make sure targets have been found. If so, then start sending
    // messsges to targets!
    if (targets.length) {
      ctx.player.temp.pagelist = list;
      await ctx.mu.db.update({ _id: ctx.player._id }, ctx.player);

      targets.forEach(async (target) => {
        const start = `To (${targets
          .map((t) => " " + t.name)
          .join(",")
          .trim()}), ${await ctx.mu.name(target, ctx.player)}`;

        if (/^;|:.*/.test(args[2])) {
          ctx.mu.send(
            target._id,
            `${start}${args[2].split("")[0] === ";" ? "" : " "}${args[2].slice(
              1
            )}`
          );
        } else {
          ctx.mu.send(target._id, `${start} says, "${args[2]}"`);
        }
      });
    }
    if (!targets) ctx.mu.send(ctx.id, "No one to page!");
  },
};
