import { Context } from "../api/app";
import { send } from "../api/broadcast";

export default (ctx: Context) => {
  send(ctx.socket, "Huh? Type 'Help' for help. ");
};
