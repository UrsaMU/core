import { broadcastToLoc } from "../api/broadcast";
import { conns } from "../api/conns";
import { IDbObj } from "../models/dbobj";
import { set } from "../utils/utils";

export default async (player: IDbObj) => {
  if (player) {
    await set(player, "!connected");
    conns.remove(player.dbref);
    await broadcastToLoc(player.loc, `${player.name} has disconnected.`);
  }
};
