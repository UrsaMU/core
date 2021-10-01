import { getSocket } from "../api/connections";
import { emitter } from "../api/Emitter";
import { DbObj, IDbObj } from "../models/dbobj";

export default async () => {
  setInterval(async () => {
    const players: IDbObj[] = await DbObj.find({
      $and: [{ flags: /player/i }, { flags: /connected/i }],
    });

    if (players) {
      for (const player of players) {
        const diff = Math.round(
          (Date.now() - player.temp.lastCommand || Date.now()) / (1000 * 30)
        );

        const conn = getSocket(player.dbref);

        if (diff && player.temp.lastCommand && !conn) {
          emitter.emit("disconnected", player);
        }
      }
    }
  }, 60000);
};
