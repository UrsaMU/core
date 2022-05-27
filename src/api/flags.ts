import { Tags } from "@digibear/tags";

const flags = new Tags();

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

flags.add(
  {
    name: "superuser",
    code: "*",
    lock: "superuser",
    lvl: 10,
  },
  {
    name: "admin",
    code: "a",
    lock: "superuser",
    lvl: 9,
  },
  {
    name: "staff",
    code: "s",
    lock: "superuser",
    lvl: 8,
  },
  {
    name: "player",
    code: "p",
    lock: "superuser",
  },
  {
    name: "room",
    code: "r",
    lock: "superuser",
  },
  {
    name: "connected",
    code: "c",
    lock: "superuser",
  }
);

export { flags };
