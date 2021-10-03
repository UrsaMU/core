import { Tags } from "@digibear/tags";
import { IDbObj } from "../models/dbobj";

const flags = new Tags();

export const canEdit = (en: IDbObj, tar: IDbObj) => {
  return flags.lvl(en.flags) > flags.lvl(tar.flags) ||
    tar.owner === en.dbref ||
    flags.check(en.flags, "wizard+")
    ? true
    : false;
};

export { flags };
