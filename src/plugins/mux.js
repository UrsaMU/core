const { add, sub } = require("../functions/math");
const { header } = require("../functions/strings");
const { MU } = require("../mu");

module.exports = (mu) => {
  mu.flags.add(
    {
      code: "i",
      lvl: 11,
      name: "immortal",
      lock: "immortal",
    },
    {
      code: "W",
      lvl: 10,
      name: "Wizard",
      lock: "immortal",
    },
    {
      code: "r",
      name: "room",
      lvl: 0,
      lock: "immortal",
      data: {
        exits: [],
      },
    },
    {
      code: "E",
      lvl: 0,
      lock: "immortal",
      name: "exit",
      data: {
        to: "",
        from: "",
      },
    },
    {
      code: "p",
      lvl: 0,
      name: "player",
      lock: "immortal",
    },
    {
      code: "C",
      lvl: 0,
      name: "connected",
      lock: "wizard+",
    }
  );

  mu.subs(
    "telnet",
    { before: /%ch/g, after: "\u001b[1m" },
    { before: /%cx/g, after: "\u001b[30m" },
    { before: /%cr/g, after: "\u001b[31m" },
    { before: /%cg/g, after: "\u001b[32m" },
    { before: /%cy/g, after: "\u001b[33m" },
    { before: /%cb/g, after: "\u001b[34m" },
    { before: /%cm/g, after: "\u001b[35m" },
    { before: /%cc/g, after: "\u001b[36m" },
    { before: /%cw/g, after: "\u001b[37m" },
    { before: /%cn/g, after: "\u001b[0m" },
    { before: /%c#(\d{,3});/, after: "\u001b38;5;$1;m" },

    { before: /%r/g, after: "\n", strip: " " },
    { before: /%t/g, after: "\t", strip: "    " },
    { before: /%b/g, after: " ", strip: " " },
    { before: "&lbrack;", after: "[", strip: " " },
    { before: "&rbrack;", after: "]", strip: " " }
  );

  mu.subs(
    "pre",
    { before: /%\[/g, after: "&lbrack;", strip: " " },
    { before: /%\]/g, after: "&rbrack;", strip: " " }
  );

  mu.subs("post");

  mu.configure(require("../functions/math"));
  mu.configure(require("../functions/strings"));
};
