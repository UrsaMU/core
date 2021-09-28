import { HookData } from "../api/hooks";
import { Next } from "@digibear/middleware";
import mongoose from "mongoose";
import { DbObj } from "../models/dbobj";
import { id } from "../utils/utils";

export default async (data: HookData, next: Next) => {
  await mongoose.connect(process.env.DB_CONNECT_STRING || "");

  // Check for rooms.  If there are none, drop limbo.
  const rooms = await DbObj.find({ flags: /room/i });
  if (rooms.length <= 0) {
    await DbObj.create({
      name: "Limbo",
      flags: "room",
      dbref: await id(),
    });
  }

  next();
};
