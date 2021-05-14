const e = require("cors");
const express = require("express");
const { get } = require("./authRoutes");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (req.mu.flags.check(req.player.flags, "wizard+")) {
      const entity = await req.mu.entity(
        req.body.name,
        req.body.flags || "",
        req.body.data || {}
      );
      if (entity) {
        res.status(200).json({ data: entity });
      } else {
        res.status(500).json({ error: "Unable to create entity." });
      }
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entity = await req.mu.db.get(req.params.id);
    if (entity) {
      if (
        entity.owner === req.player._id ||
        req.mu.flags.check(req.player.flags, "wizard+")
      ) {
        res.status(200).json({ data: entity });
      } else {
        res.sendStatus(403);
      }
    } else {
      res.status(404).json({ message: "Db entity not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
