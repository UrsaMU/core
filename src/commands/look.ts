import { send } from "../api/broadcast";
import { addCmd } from "../api/cmds";
import { flags } from "../api/flags";
import { parser } from "../api/parser";
import { DbObj, IDbObj } from "../models/dbobj";
import { center, columns, idleColor, name, repeat } from "../utils/formatting";
import { idle, target } from "../utils/utils";

interface TextDescParts {
  tarName: string;
  desc: string;
  items: Item[];
  flgs: string;
  width?: number;
  en: IDbObj;
}

interface Item {
  name: string;
  dbref: string;
  desc: string;
  shortdesc: string;
  avatar: string;
  flags: string;
  idle: string;
}

export default () => {
  const charStatus = (char: Item, width: number) => {
    let tag = "%b%b";
    const colorIdle = char.idle;
    if (char.flags.includes("immortal")) tag = "%ch%cy*%cn%b";

    return `${tag}${
      char.name + " ".repeat(25 - parser.stripSubs("telnet", char.name).length)
    }%b${
      " ".repeat(5 - parser.stripSubs("telnet", colorIdle).length) +
      colorIdle +
      "%b%b%b"
    }${
      char.shortdesc
        ? char.shortdesc.substring(0, width - 35)
        : "%ch%cxType '+shortdesc <desc>' to set.%cn"
    }`;
  };

  const textDesc = ({
    tarName,
    desc,
    items,
    flgs,
    width = 78,
    en,
  }: TextDescParts) => {
    let rtrn =
      center(
        `%cy<%ch<%cn%ch ${tarName} %ch%cy>%cn%cy>%cn`,
        width,
        "%cb=%ch-%cn"
      ) +
      "%r%r" +
      desc +
      "%r%r";

    const chars = items.filter((item) => item.flags.includes("connected"));
    const exits = items.filter((item) => item.flags.includes("exit"));
    if (
      chars.length > 0 &&
      (!flgs.includes("dark") || flags.check(en.flags, "staff+"))
    ) {
      rtrn +=
        center(
          `%cy<%ch<%cn%ch Characters %cy>%cn%cy>%cn`,
          width,
          "%cb-%cb-%cn"
        ) +
        "%r" +
        items
          .filter((item) => item.flags.includes("connected"))
          .map((char) => charStatus(char, width))
          .join("%r") +
        "%r";
    }

    if (
      exits.length > 0 &&
      (!flgs.includes("dark") || flags.check(en.flags, "staff+"))
    ) {
      const exitNames = exits.map((exit) => exit.name);
      rtrn +=
        center(`%cy<%ch<%cn%ch Exits %cy>%cn%cy>%cn`, width, "%cb-%cb-%cn") +
        "%r" +
        columns(exitNames, width, 2) +
        "%r";
    }

    rtrn += repeat("%cb=%ch-%cn", width);
    return rtrn;
  };

  addCmd({
    name: "look",
    pattern: /^l[ook]*?(?:\s+?(.*))?/i,
    flags: "connected",
    render: async (args, ctx) => {
      let tarName = "";
      const en: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });
      const tar: IDbObj = await target(en, args[1] || "here");
      let contents: IDbObj[] = [];
      if (tar) {
        tarName = name(en, tar);
        contents = await DbObj.find({ location: en.loc });
        contents = contents.filter((item) =>
          (item.flags.includes("player") && item.flags.includes("connected")) ||
          !item.flags.includes("player")
            ? true
            : false
        );
        let items: Item[] = [];
        for (let item of contents) {
          items.push({
            name: name(en, item),
            dbref: item.dbref,
            desc: item.description,
            shortdesc: item.data.shortDesc,
            avatar: item.data.avatar,
            flags: item.flags,
            idle: idleColor(item.temp.lastCommand),
          });
        }

        await send(
          ctx.socket,
          textDesc({
            tarName,
            desc: tar.description,
            items,
            flgs: tar.flags,
            width: ctx.data.width,
            en,
          }),
          {
            type: "look",
            desc: tar.description,
            name: name(en, tar),
            avatar: tar.data.avatar,
            items,
            flags: tar.flags,
          }
        );
      } else {
        await send(ctx.socket, "I don't see that here.");
      }
    },
  });
};
