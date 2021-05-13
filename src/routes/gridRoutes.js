const e = require("cors");
const express = require("express");

const router = express.Router();

router.post("/dig", async (req, res) => {
  if (req.mu.flags.check(req.player.flags, "staff+")) {
    let exit1, exit2;
    const room1 = await req.mu.db.get(req.player.location);
    const room2 = await req.mu.entity(req.body.name, "room", {
      owner: req.player._id,
      ...(req.body.data || {}),
    });

    if (room2 && req.body.exit) {
      exit1 = await req.mu.entity(req.body.exit, "exit", {
        owner: req.player._id,
        to: room2._id,
        location: room1?._id || "",
      });
    }

    if (room1 && req.body.return) {
      exit2 = await req.mu.entity(req.body.return, "exit", {
        owner: req.player._id,
        to: room1?._id || "",
        location: room2._id || "",
      });
    }

    const results = [room2, exit1, exit2];
    if (room1) results.unshift(room1);

    res.status(200).json(results);
  } else {
    res.sendStatus(403);
  }

  res.status(200);
});

module.exports = router;
