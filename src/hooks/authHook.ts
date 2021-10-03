import { Context, Next } from "../api/app";
import { login } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  const { token } = ctx.data;

  if (token) {
    await login(ctx);
  }
  next();
};
