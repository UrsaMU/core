const { trim } = require("lodash");

module.exports = {
  name: "help",
  pattern: /^[@\+]?help(?:\s+([@\+\w]+))?/i,
  flags: "connected",
  help: "This Command.",
  skip: true,
  render: async (args, ctx) => {
    let topics = ctx.mu.cmds
      .map((cmd) => (cmd.help ? cmd.name : `%ch%cr${cmd.name}%cn`))
      .sort()
      .join("|");

    let header = "[repeat(%cr=%ch-%cn,4)]";

    header += `[ljust(%cy<%ch<%cn HELP${
      args[1] ? " " + args[1].trim().toUpperCase() + " " : " "
    }%ch%cy>%cn%cy>%cn, %cr=%ch-%cn, sub(${ctx.data.width},4))]%r`;

    if (args[1]) {
      const cmd = ctx.mu.cmds.find(
        (cmd) => cmd.name.toLowerCase() === args[1].trim().toLowerCase()
      );
      if (cmd) {
        header += cmd?.help + "%r" || "%rNo help available for this command.%r";
      } else {
        return ctx.mu.send(
          ctx.id,
          "I can't find that topic. See '%chhelp%cn' for a list of topics."
        );
      }
    } else {
      header += "The following topics are available:%r";
      header += `[columns(${topics},${ctx.data.width},4,|)]`;
      header += "%rType '%chhelp <topic>%cn' for more help.%r";
    }

    header += `[repeat(%cr=%ch-%cn, ${ctx.data.width})]`;

    await ctx.mu.send(ctx.id, header);
  },
};
