import { config, Context, hooks, Next } from "..";
import { dbObj } from "../api/app";
import { id } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  const count = await dbObj.find({ flags: /room/i });

  if (!count.length) {
    const dbref: string = await id();

    await dbObj.create({
      dbref,
      name: config.get("startingRoom") || "Limbo",
      location: dbref,
      owner: dbref,
      flags: "room",
    });
  }
  next();
};
