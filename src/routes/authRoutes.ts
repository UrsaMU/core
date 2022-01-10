import { Router } from "express";
import { compare, dbObj, sign } from "..";

const router = Router();

router.post("/", async (req, res, next) => {
  const regexp = new RegExp(req.body.name, "i");
  try {
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
  } catch (error) {
    next(new Error("Internal Server Error"));
  }
});

export default router;
