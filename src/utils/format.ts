import { parser } from "..";

export const remainder = (str: string, count: number) => {
  let ret = str.split("%").filter(Boolean).splice(0, count).join("%");
  let len = parser.stripSubs("telnet", str).length;
  return str.includes("%c") && len > 1 ? "%" + ret + " %cn" : ret;
};

export const repeat = (str: string, width = 78) => str.repeat(width);

export const center = (str: string, width = 78, filler = " ") => {
  let fillLength = (width - parser.stripSubs("telnet", str).length) / 2;
  fillLength = fillLength / parser.stripSubs("telnet", filler).length;
  return repeat(filler, fillLength) + str + repeat(filler, fillLength);
};
