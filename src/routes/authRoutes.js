const express = require("express");
const { compare, sign, hash } = require("../utils/utils");

const route = express.Router();

route.post("/", async (req, res) => {
  try {
    const regex = new RegExp(req.body.username, "i");
    const player = (await req.mu.db.find({ name: regex }))[0];

    if (player) {
      if (await compare(req.body.password, player.password)) {
        const token = await sign(player._id);
        res.status(200).json({ token });
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

route.post("/register", async (req, res) => {
  try {
    const regName = new RegExp(req.body.username, "i");
    const taken = await req.mu.db.find({ name: regName });
    const players = await req.mu.db.find({ type: "player" });

    if (!taken.length) {
      const player = await req.mu.entity(
        req.body.username,
        players.length ? "player" : "player immortal",
        {
          password: await hash(req.body.password),
          location: req.mu.config.players.startingRoom || "Limbo",
        }
      );

      if (player) {
        const token = await sign(player._id);
        res.status(200).json({ token });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = route;
