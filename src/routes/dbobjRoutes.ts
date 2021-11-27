import { Router } from "express";
import { flags, MuRequest } from "..";
import { dbObj } from "../models/DBObj";
import { id } from "../utils/utils";

const router = Router();

router.post("/", async (req: MuRequest, res, next) => {
  if (req.user && flags.check(req.user.flags || "", "wizard+")) {
    const dbref = await id();
    const data = req.body.data ? req.body.data : {};

    const obj = await dbObj.create({
      dbref,
      data,
      name: req.body.name,
      flags: req.body.flags ? req.body.flags : "thing",
    });

    res.status(200).json({ obj });
  } else {
    next(new Error("Permission denied."));
  }
});

router.get("/:id", async (req: MuRequest, res, next) => {
  const obj = await dbObj.findOne({ dbref: "#" + req.params.id });

  if (obj) {
    if (
      obj.owner === req.user?.dbref ||
      flags.check(req.user?.flags || "", "wizard+")
    ) {
      obj.password = undefined;

      return res.status(200).json(obj);
    }
  }
  res.status(200).json({});
});

router.get("/", async (req: MuRequest, res, next) => {
  if (req.isWizard) {
    const objs = (await dbObj.find({})).map((obj) => {
      obj.password = undefined;
      return obj;
    });
    return res.status(200).json(objs);
  } else {
    const objs = (await dbObj.find({ owner: req.user?.dbref })).map((obj) => {
      obj.password = undefined;
      return obj;
    });
    return res.status(200).json(objs);
  }
});
export default router;
