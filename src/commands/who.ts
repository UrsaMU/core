import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { parser } from "../api/parser";
import { DbObj, IDbObj } from "../models/dbobj";
import { center, header, idleColor, name, repeat } from "../utils/formatting";
import { canSee } from "../utils/utils";

export default () => {
  addCmd({
    name: "who",
    pattern: /^who/i,
    flags: "connected",
    render: async (args, ctx) => {
      const players: IDbObj[] = await DbObj.find({ flags: /connected/i });

      const en = await DbObj.findOne({ dbref: ctx.socket.cid });
      const list = players.map((player) => ({
        name: player.name,
        idle: idleColor(ctx.player?.temp.lastCommand),
        doing: player.data.doing,
      }));

      let output = header("Online Characters", ctx.data.width);
      output +=
        "%r" +
        "  NAME".padEnd(26) +
        "ALIAS".padEnd(11) +
        "IDLE".padEnd(11) +
        "DOING %ch%cx(use: @doing to set.)%cn%r" +
        repeat("%cb--%cn", ctx.data.width) +
        "%r";
      output +=
        players
          .filter((player) => canSee(en, player))
          .map((target) => {
            const doing = target.data.doing || "";
            const alias = target.alias || "";
            let tag = "  ";
            if (target.flags.includes("immortal")) tag = "%ch%cy*%cn%b";
            return (
              tag +
              name(en, target).substr(0, 23) +
              repeat(
                " ",
                23 - parser.stripSubs("telnet", name(en, target)).length
              ) +
              "%b" +
              alias.substr(0, 10).padEnd(10) +
              "%b" +
              idleColor(target.temp.lastCommand) +
              repeat(
                " ",
                10 -
                  parser.stripSubs("telnet", idleColor(target.temp.lastCommand))
                    .length
              ) +
              "%b" +
              doing.substr(
                0,
                ctx.data.width - 50 - parser.stripSubs("telnet", doing).length
              )
            );
          })
          .join("%r") +
        "%r" +
        repeat("%cb--%cn", ctx.data.width) +
        "%r" +
        center(
          `%ch${
            players.filter((player) => canSee(en, player)).length
          }%cn visible players online.`,
          ctx.data.width,
          "  "
        ) +
        "%r" +
        repeat("%cb=%ch-%cn", ctx.data.width);

      send(ctx.socket, output, {
        type: "who",
        list,
      });
    },
  });
};
