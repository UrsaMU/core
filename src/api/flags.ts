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

export { flags };
