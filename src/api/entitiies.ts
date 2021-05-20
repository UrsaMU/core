import { db, DBObj } from "./database";
import { flags } from "./flags";
import { Refs } from "./dbrefs";

const ids = new Refs();
/**
 *
 * @param id The id of the enactor creating the object
 * @param name The name of the object to be created
 * @param flgs Any flags to set on the object.
 * @param data Any extra data that needs to be set on the object.
 * @returns
 */
export const createEntity = async (
  id: string,
  name: string,
  flgs: string,
  data: { [key: string]: any } = {}
): Promise<DBObj> => {
  const { tags } = flags.set("", {}, flgs);

  const entity: DBObj = {
    name,
    flags: tags,
    dbref: await ids.id(),
    description: "You see nothing special.",
    location: "",
    data: {},
    owner: id,
    ...data,
  };

  return await db.create(entity);
};

/**
 * Get a name for a tagrget depending on ownership and flag status
 * @param enactor The enactor looking
 * @param target The target being looked at
 * @returns
 */
export const name = async (enactor: DBObj, target: DBObj): Promise<string> => {
  if (flags.check(enactor.flags, "staff+")) {
    return `${target.name.split(";")[0]} (#${target.dbref}${flags.codes(
      target.flags.trim()
    )})`;
  } else {
    return target.name;
  }
};

/**
 * Get a dbobj for a target by name.
 * @param en The enactor
 * @param tar the target
 * @returns
 */
export const target = async (en: DBObj, tar: string) => {
  if (tar.toLowerCase() === "me") {
    return en;
  } else if (tar.toLowerCase() === "here") {
    return await db.get(en.location);
  } else {
    const regex = new RegExp(tar, "i");
    return (
      await db.find({
        $or: [{ name: regex }, { _id: tar }, { dbref: parseInt(tar.slice(1)) }],
      })
    )[0];
  }
};
