import pm2 from "pm2";
import { logger } from "..";
import { dbObj } from "../api/app";
import { setFlgs } from "../utils/utils";

export default () => {
  pm2.connect(async (err) => {
    if (err) logger.error(err.message);

    const players = await dbObj.find({ flags: /connected/ });

    for (const player of players) {
      await setFlgs(player, "!connected");
    }

    pm2.delete("telnet", (err) => {
      process.exit(0);
    });
  });
};
