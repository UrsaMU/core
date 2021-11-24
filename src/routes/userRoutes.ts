import { Router } from "express";
import { config, hash, MuRequest, sign } from "..";
import authReq from "../middleware/authReq";
import { dbObj } from "../models/DBObj";
import { id } from "../utils/utils";

const router = Router();

// Create a user
router.post("/", async (req: MuRequest, res, next) => {
  const regex = new RegExp(req.body.name, "i");
  const players = await dbObj.find({ flags: /player/ });
  const taken = players.filter(
    (player) =>
      player.name.toLowerCase() === req.body.name.toLowerCase() ||
      player.alias?.toLowerCase() === req.body.name.toLowerCase()
  );

  if (taken.length) return next(new Error("That name is unavailable"));

  const dbref = await id();
  const player = await dbObj.create({
    name: req.body.name,
    password: await hash(req.body.password),
    flags: players.length ? "player" : "player immortal",
    dbref,
    owner: dbref,
    location: config.get("playerStart") || "#0",
  });

  player.password = undefined;

  const token = await sign(player.dbref);
  if (player) req.user = player;
  return res.status(200).json({ token, player });
});

// Update a user.
router.patch("/", authReq, async (req: MuRequest, res, next) => {
  req.body.updates.password = req.body.updates.password
    ? await hash(req.body.updates.password)
    : undefined;

  try {
    if (req.isWizard) {
      const result = await dbObj.updateMany(
        { dbref: req.body.dbref },
        req.body.updates
      );
      res.status(200).json(result);
    } else {
      const result = await dbObj.updateMany(
        {
          $and: [{ dbref: req.body.dbref }, { owner: req.user?.dbref }],
        },
        req.body.updates
      );
      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
});

// Get a specific user
router.get("/:id", authReq, (req, res, next) => {});

// Get all users
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

// Delete a user
router.delete("/:id", authReq, async (req: MuRequest, res, next) => {
  try {
    const tar = await dbObj.findOne({ dbobj: "#" + req.params.id });
    if (req.isWizard || tar?.owner === req.user?.dbref) {
      const res = await dbObj.remove({ dbref: "#" + req.params.id });
    }
    res.status(200).json(res);
  } catch (error) {
    next(error);
  }
});
export default router;
