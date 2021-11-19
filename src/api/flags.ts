import { Tags } from "@digibear/tags";

const flags = new Tags(
  {
    name: "immortal",
    lvl: 10,
    code: "i",
    lock: "immortal+",
  },
  {
    name: "wizard",
    lvl: 9,
    code: "w",
    lock: "immortal+",
  },
  {
    name: "staff",
    lvl: 8,
    code: "i",
    lock: "wizard+",
  },
  {
    name: "admin",
    lvl: 7,
    code: "a",
    lock: "wizard+",
  },
  {
    name: "thing",
    lvl: 0,
    code: "t",
    lock: "immortal+",
  },
  {
    name: "room",
    lvl: 0,
    code: "r",
    lock: "immortal+",
  },
  {
    name: "player",
    lvl: 0,
    code: "p",
    lock: "immortal+",
  },
  {
    name: "account",
    lvl: 0,
    code: "a",
    lock: "immortal+",
  },
  {
    name: "connected",
    lvl: 0,
    code: "c",
    lock: "immortal+",
  }
);

/**
 * set a list of flags, and flag data.
 * @param list The list of flags to add
 * @param data Any related date to be set with the new flags
 * @param flgs The flags expression to be evaluated.
 * @returns
 */
export const setFlag = (list: string, data = {}, flgs = "") => {
  const { tags } = flags.set(flgs, data, list);
  return { flags: tags, data };
};

export { flags };
