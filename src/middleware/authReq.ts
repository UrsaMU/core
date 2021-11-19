import { Context, Next, verify } from "..";

export default async (ctx: Context, next: Next) => {
  if (ctx.data.token) {
    const user = await verify(ctx.data.token);
  }
};
