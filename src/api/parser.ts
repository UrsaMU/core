import { Parser } from "@ursamu/parser";

export const parser = new Parser();

parser.addSubs(
  "telnet",
  { before: /%[cx]x/, after: "\u001b[30m" },
  { before: /%[cx]r/, after: "\u001b[31m" },
  { before: /%[cx]g/, after: "\u001b[32m" },
  { before: /%[cx]y/, after: "\u001b[33m" },
  { before: /%[cx]b/, after: "\u001b[34m" },
  { before: /%[cx]m/, after: "\u001b[35m" },
  { before: /%[cx]c/, after: "\u001b[36m" },
  { before: /%[cx]w/, after: "\u001b[37m" },
  { before: /%[cx]n/, after: "\u001b[0m" },
  { before: /%[cx]h/, after: "\u001b[1m" },
  { before: /%[cx]u/, after: "\u001b[4m" }
);
