import { Context, Next } from "../api/app";

export default async (ctx: Context, next: Next) => {
  const { token } = ctx.data;
  if (token) {
  }
};
