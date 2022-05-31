import { Parser } from "@ursamu/parser";

const parser = new Parser();
parser.addSubs(
  "telnet",
  { before: /%r/g, after: "\n" },
  { before: /%b/g, after: " " },
  { before: /%t/g, after: "\t" },

  // ansi color codes
  { before: /%cx/g, after: `\u001b[30m` },
  { before: /%cr/g, after: `\u001b[31m` },
  { before: /%cg/g, after: "\u001b[32m" },
  { before: /%cy/g, after: "\u001b[33m" },
  { before: /%cb/g, after: "\u001b[34m" },
  { before: /%cm/g, after: "\u001b[35m" },
  { before: /%cc/g, after: "\u001b[36m" },
  { before: /%cw/g, after: "\u001b[37m" },

  // Extra ansi definitions
  { before: /%ch/g, after: "\u001b[1m" },
  { before: /%cn/g, after: "\u001b[0m" }
);
export { parser };
