const player = require("../hooks/player");

module.exports = {
  name: "look",
  pattern: /^l[ook]*?(?:\s+(.*))?/i,
  flags: "connected",
  render: async (args, ctx) => {
    const buildDesc = async (id) => {
      const regex = new RegExp(id, "i");
      const target = (
        await ctx.mu.db.find({
          $or: [{ name: regex }, { _id: id }],
        })
      )[0];
      if (!target) return "I can't find that here.";
      const contents = await ctx.mu.db.find({ location: target._id });
      const exits = contents.filter((item) => item.flags.includes("exit"));
      let output = "";

      if (target.flags.split(" ").includes("room")) {
        output += `[repeat(%cb=%ch-%cn,4)][ljust(%cy<%ch<%cn ${await ctx.name(
          ctx.player,
          target
        )} %ch%cy>%cn%cy>%cn,%cb=%ch-%cn, sub(width(%#),4))]%r`;
        output += target.description + "%r%r";
      } else {
        output += `${await ctx.name(ctx.player, target)}%r`;
        output += target.description + "%r";
      }

      if (contents.length) {
        output += target.flags.split(" ").includes("player")
          ? "\n\nCarrying:"
          : "[repeat(%cb=%ch-%cn,4)][ljust(%cy<%ch<%cn Characters %ch%cy>%cn%cy>%cn,%cb=%ch-%cn, sub(width(%#),4))]%r%r[ljust(Name, ,30)][ljust(Short Description, ,sub(width(%#),35))][rjust(Idle, ,5)]%r[repeat(%ch%cx-%cn,width(%#))]";

        for (const item of contents.filter((item) => {
          if (!item.flags.split(" ").includes("exit")) {
            if (
              item.flags.split(" ").includes("player") &&
              !item.flags.split(" ").includes("connected")
            )
              return false;
            return true;
          }
        })) {
          output += `%r[ljust(${await ctx.mu.name(ctx.player, item)}, ,30)]`;
          output += `[ljust(${
            item.shortDesc
              ? item.shortDesc
              : "%ch%cxUse '%cn+shortdesc <shortdesc>%ch%cx' to set this."
          }, ,sub(width(%#),35))]%cn`;
        }
      }

      if (exits.length) {
        output +=
          "%r%r[repeat(%cb=%ch-%cn,4)][ljust(%cy<%ch<%cn Exits %ch%cy>%cn%cy>%cn,%cb=%ch-%cn, sub(width(%#),4))]%r";

        const exitList = [];
        for (const item of exits) {
          exitList.push(
            `${await ctx.mu.name(ctx.player, item)}${
              item.name.split(";")[1]
                ? "<%ch" + item.name.split(";")[1].toUpperCase() + "%cn>"
                : ""
            }`
          );
        }
        output += `[columns(${exitList.join("|")},width(%#),3,|)]`;
      }

      return output;
    };

    args[1] = args[1] ? args[1] : "";

    if (args[1].toLowerCase() === "here" || args[1].toLowerCase() === "") {
      await ctx.mu.send(ctx.id, await buildDesc(ctx.player.location), ctx.data);
    } else if (args[1].toLowerCase() === "me") {
      await ctx.mu.send(ctx.id, await buildDesc(ctx.player._id), ctx.data);
    } else {
      await ctx.mu.send(ctx.id, await buildDesc(args[1]), ctx.data);
    }
  },
};
