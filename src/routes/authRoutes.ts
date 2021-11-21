import { Router } from "express";
import { compare, sign } from "..";
import { dbObj } from "../models/DBObj";

const router = Router();

router.post("/", async (req, res, next) => {
  const regexp = new RegExp(req.body.name, "i");
  const user = await dbObj.findOne({
    $or: [{ name: regexp }, { alias: regexp }],
  });

  if (user && (await compare(req.body.password!, user.password!))) {
    user.password = undefined;
    const token = await sign(user.dbref);
    res.status(200).json({ token, user });
  } else {
    next(new Error("Permission Denied."));
  }
});

export default router;
