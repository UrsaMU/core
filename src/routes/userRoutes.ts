import { Router } from "express";
import { config, hash, MuRequest, sign } from "..";
import { dbObj } from "../models/DBObj";
import { id } from "../utils/utils";

const router = Router();

router.post("/", async (req: MuRequest, res, next) => {
  const regex = new RegExp(req.body.name, "i");
  const players = await dbObj
    .find({
      $or: [{ name: regex }, { alias: regex }],
    })
    .count();
  const count = await dbObj.count();

  if (players) return next(new Error("That name is unavailable"));

  const dbref = await id();
  const player = await dbObj.create({
    name: req.body.name,
    password: await hash(req.body.password),
    flags: count ? "player immortal" : "player",
    dbref,
    owner: dbref,
    location: config.get("playerStart") || "#0",
  });

  const token = await sign(player.dbref);
  if (player) req.user = player;
  return res.status(200).json({ token, player });
});

router.get("/", async (req: MuRequest, res, next) => {
  if (req.isWizard) {
    const users = await dbObj.find({ flags: /player/ });
    res.status(200).json(users);
  } else {
    const users = await dbObj.find({
      $and: [{ flags: /player/ }, { owner: req.user?.dbref }],
    });
    res.status(200).json();
  }
});

export default router;
