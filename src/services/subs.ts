import { parser } from "../api/parser";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const code = result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;

  if (code) return `\u001b[38;2;${code.r};${code.g};${code.b}m`;
  return "";
}

export default () => {
  // Markdown substitutions
  parser.addSubs(
    "telnet",
    {
      before: /\*\*([^\*]+)\*\*/g,
      after: "%ch$1%cn",
      strip: "$1",
    },
    {
      before: /[#]+\s+(.*)/g,
      after: "%u$1%cn",
      strip: "$1",
    },
    {
      before: /^>\s+([\s|\S]+)/g,
      after: "$1",
      strip: "$1",
    },
    {
      before: /\[(.*)\]\(([^\)]+)\)/g,
      after: "%ch%u$1%cn",
      strip: "$1",
    },
    {
      before: /`{1,3}([^`]+)`{1,3}/g,
      after: "%ch$1%cn",
      strip: "$1",
    }
  );

  // Ansi substitutions
  parser.addSubs(
    "telnet",
    {
      before: /%cx/g,
      after: "\u001b[30m",
    },
    {
      before: /%cr/g,
      after: "\u001b[31m",
    },
    {
      before: /%cg/g,
      after: "\u001b[32m",
    },
    {
      before: /%cy/g,
      after: "\u001b[33m",
    },
    {
      before: /%cb/g,
      after: "\u001b[34m",
    },
    {
      before: /%cm/g,
      after: "\u001b[35m",
    },
    {
      before: /%cc/g,
      after: "\u001b[36m",
    },
    {
      before: /%cw/g,
      after: "\u001b[37m",
    },
    {
      before: /%cn/g,
      after: "\u001b[0m",
    },
    {
      before: /%ch/g,
      after: "\u001b[1m",
    },
    {
      before: /%u/g,
      after: "\u001b[4m",
    },

    {
      before: "%cX",
      after: "\u001b[40m",
    },
    {
      before: "%cR",
      after: "\u001b[41m",
    },
    {
      before: "%cG",
      after: "\u001b[42m",
    },
    {
      before: "%cY",
      after: "\u001b[43m",
    },
    {
      before: "%cB",
      after: "\u001b[44m",
    },
    {
      before: "%cM",
      after: "\u001b[45m",
    },
    {
      before: "%cC",
      after: "\u001b[46m",
    },
    {
      before: "%cW",
      after: "\u001b[47m",
    },
    {
      before: "%t",
      after: "\t",
    },
    {
      before: "%r",
      after: "\n",
    },
    {
      before: "%b",
      after: " ",
      strip: " ",
    },
    {
      before: /%c#(\d{1,3})/g,
      after: "\u001b[38;5;$1m",
    }
  );
};
