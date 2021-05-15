const express = require("express");
const shortid = require("shortid");
const webAuth = require("../middleware/webAuth");

const router = express.Router();

router.post("/", webAuth, async (req, res) => {
  try {
    if (req.mu.flags.check(req.player.flags, "wizard+")) {
      const article = await req.mu.wiki.create({
        title: req.body.title,
        subtitle: req.body.sub || "",
        author: req.player._id,
        body: req.body.body,
        category: req.body.category || "general",
        tags: req.body.tags || "",
        last_edit: req.player.id,
        slug:
          req.body.slug ||
          req.body.title.replace(/\s+/g, "-") + "-" + shortid(),
        created_at: Date.now(),
        last_edit_at: Date.now(),
        locked: req.body.locked ? true : false,
        hidden: req.body.hidden ? true : false,
      });

      res.status(200).json({ article });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:category/:slug?", async (req, res) => {
  try {
    const cat = new RegExp(req.params.category, "i");
    let articles = await req.mu.wiki.find({ category: cat });

    // Filter out any locked articles unless the reader is wizard+
    articles = articles.filter((article) => {
      if (req.player) {
      }
      if (article.locked && req.mu.flags.check(req.player.flags, "wizard+")) {
        return true;
      } else if (
        article.locked &&
        !req.mu.flags.check(req.player.flags, "wizard+")
      ) {
        return false;
      }
      return true;
    });

    if (req.params.slug) {
      articles = articles.filter(
        (article) => article.slug === req.params.slug.toLowerCase()
      );
    }

    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
