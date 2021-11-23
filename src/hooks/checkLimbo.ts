import { config, hooks } from "..";
import { dbObj } from "../models/DBObj";
import { id } from "../utils/utils";

export default () => {
  hooks.startup.use(async (ctx, next) => {
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
  });
};
