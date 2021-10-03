import { broadcastToLoc } from "../api/broadcast";
import { IDbObj } from "../models/dbobj";

export default (player: IDbObj) => {
  if (player) {
    if (!player.flags.includes("dark")) {
      broadcastToLoc(player.loc, `${player.name} has reconnected.`);
    }
  }
};
