import { Tags } from "@digibear/tags";
import { IDbObj } from "../models/dbobj";

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

export const canEdit = (en: IDbObj, tar: IDbObj) => {
  return flags.lvl(en.flags) > flags.lvl(tar.flags) ||
    tar.owner === en.dbref ||
    flags.check(en.flags, "wizard+")
    ? true
    : false;
};

export { flags };
