import { flags } from "../api/flags";
import { parser } from "../api/parser";
import { IDbObj } from "../models/dbobj";
import { idle } from "./utils";

export const remainder = (str: string, width: number, type = "telnet") => {
  const subsStr = parser.stripSubs(type, str).length;

  const rem = Math.round(width % width);

  let strArray: string[] = [];

  str
    .trim()
    .split("")
    .reduce((pre, cur) => {
      if (cur === "%") {
        if (pre) strArray.push(pre);

        return cur;
      } else {
        if (/%c./.test(pre)) {
          strArray.push(pre + cur);
          return "";
        } else if (/%[^cx]/.test(pre)) {
          strArray.push(pre);
          return cur;
        } else {
          return (pre += cur);
        }
      }
    }, "");

  let ret: string[] = [];
  for (const el of strArray) {
    if (/%.*/.test(el)) {
      ret.push(el);
    } else {
      ret.push(...el);
    }
  }

  ret = ret.length > 0 ? ret : str.split("");
  console.log(strArray);

  return ret.splice(0, width).join("") + "%cn";
};

/**
 * Repeat a string.
 * @param str The string to be releated
 * @param width Width with of the string to repeat
 * @param type The type of subs to perform defaults to 'telnet'.
 * @returns
 */
export const repeat = (str: string, width: number, type = "telnet") => {
  const reWidth: number = parser.stripSubs(type ? type : "telnet", str).length;

  const rem = Math.round(width % reWidth);
  return str.repeat(width / reWidth) + remainder(str, rem);
};

/**
 * Break an array into spaced columns
 * @param list The array to be broken up
 * @param width The width of the overall table.
 * @param columns The number of columns.
 * @returns
 */
export const columns = (
  list: string[],
  width: number = 78,
  columns: number = 4,
  sep: string = " "
) => {
  let line = "";
  let table = "";
  let ct = -1;
  if (columns <= 1) {
    table = list
      .map((item) => {
        return (
          item + repeat(" ", width - parser.stripSubs("telnet", item).length)
        );
      })
      .join("%r");
  } else {
    for (const idx in list) {
      let cellWidth =
        Math.round(
          width / columns - parser.stripSubs("telnet", list[idx]).length
        ) -
        sep.length -
        1;

      const cell =
        list[idx] +
        repeat(" ", cellWidth) +
        `${ct++ % columns !== 0 ? sep + " " : ""}`;

      if (parser.stripSubs("telnet", line + cell).length <= width) {
        line += cell;
      } else {
        table += line + "%r";
        line = cell;
      }
    }

    table += line;
  }
  return table;
};

export const center = (str = "", width = 78, filler = " ", type = "telnet") => {
  const subWords = parser.stripSubs(type, str).length;
  const subFiller = parser.stripSubs(type, filler).length;
  const repWidth = width - subWords;

  return repeat(filler, repWidth / 2) + str + repeat(filler, repWidth / 2);
};

/**
 * Make a header.
 * @param str The string to be displayed the header
 * @param width the width of the header
 * @param color the color code for the header.
 * @returns
 */
export const header = (str: string, width: number, color: string = "%cb") =>
  center(`%cy<%ch<%cn%ch ${str} %cy>%cn%cy>%cn`, width, `${color}=%ch-%cn`);

/**
 *
 * @param str
 * @param width
 * @param color
 * @returns
 */
export const headerNarrow = (str: string, width: number, color: string) =>
  center(
    `%cy<%ch<%cn%ch ${str} %cy>%cn%cy>%cn`,
    width,
    `%${color}-%${color}-%cn`
  );

export const idleColor = (idleTime: number) => {
  const str = idle(idleTime);
  const match = str.match(/(\d{1,3})(\w)/);
  if (match) {
    let [_, time, mark] = match;
    let currTime = parseInt(time, 10);
    if (mark === "s") return `%ch%cg${str}%cn`;
    if (mark === "m" && currTime < 15) return `%cg${str}%cn`;
    if (mark === "m" && currTime > 14 && currTime < 30)
      return `%ch%cy${str}%cn`;
    if (mark === "m" && currTime > 30) return `%ch%cr${str}%cn`;
    if (mark === "h") return `%ch%cx${str}%cn`;
  }
  return str;
};

export const andList = (list: string[]) => {
  const last = list.pop() || "";
  const commas = list.join(",");
  return `${commas}${commas ? "and" : ""}${last}`;
};

export const name = (en: IDbObj, tar: IDbObj) => {
  let str = tar.name;
  if (tar.data.moniker) str = tar.data.moniker;
  if (flags.check(en.flags, "staff+"))
    str = str + `(${tar.dbref}${flags.codes(tar.flags)})`;
  return str;
};
