import { parser } from "../api/parser";

export default () => {
  const remainder = (str: string, count: number) => {
    let ret = str.split("%").filter(Boolean).splice(0, count).join("%");
    return str.includes("%") ? "%" + ret + " %cn" : ret;
  };
  // repeat(<string>, <width>)
  parser.add("repeat", async (args) => {
    const strWidth = parser.stripSubs("telnet", args[0]).length;
    const width = parseInt(args[1], 10);
    const rep = Math.floor(width / strWidth);
    const rem = width - strWidth * rep;
    return args[0].repeat(rep) + remainder(args[0], rem);
  });

  // center(<string>,<width>,<filler>)
  parser.add("center", async (args, data) => {
    const words = args[0] || "";
    const width = parseInt(args[1]) || 78;
    const filler = args[2] || " ";
    const subWords = parser.stripSubs("telnet", words).length;

    const subFiller = parser.stripSubs("telnet", filler).length;

    const adjWidth = Math.floor((width - subWords) / 2);
    const repWidth = Math.floor(adjWidth / subFiller);
    const rem = Math.round(width % (adjWidth * 2 + subWords));

    return (
      filler.repeat(repWidth) +
      words +
      filler.repeat(repWidth) +
      remainder(filler, rem)
    );
  });
};
