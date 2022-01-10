import { NextFunction, Response } from "express";
import { flags, MuRequest, verify } from "..";
import { dbObj } from "../api/app";

export default async (req: MuRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const dbref = await verify(token);
      const user = await dbObj.findOne({ dbref });
      if (user) req.user = user;
      if (flags.check(user?.flags || "", "staff+")) req.isStaff = true;
      if (flags.check(user?.flags || "", "wizard+")) req.isWizard = true;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next(new Error("Permission denied."));
  }
};
