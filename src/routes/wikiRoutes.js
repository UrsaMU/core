const express = require("express");
const shortid = require("shortid");
const webAuth = require("../middleware/webAuth");

const router = express.Router();

router.post("/", webAuth, async (req, res) => {
  try {
    if (req.mu.flags.check(req.player.flags, "wizard+")) {
      const taken = await req.mu.wiki.find({ slug: req.body.slug });
      if (!taken.length) {
        const article = await req.mu.wiki.create({
          title: req.body.title,
          subtitle: req.body.sub || "",
          author: req.player._id,
          body: req.body.body,
          category: req.body.category.toLowerCase() || "general",
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
      }
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", webAuth, async (req, res) => {
  try {
    if (req.mu.flags.check(req.player.flags, "wizard+")) {
      const post = await req.mu.wiki.get(req.body.id);
      if (post) {
        const updates = {
          ...post,
          ...req.body.updates,
        };

        updates.last_edit = req.player._id;
        updates.last_edit_at = Date.now();

        const results = await req.mu.wiki.update({ _id: post._id }, updates);
        res.status(200).json({ message: `${results} posts updated.` });
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/article/:id");

router.get("/articles/:category?", async (req, res) => {
  try {
    const cat = new RegExp(req.params.category, "i");
    let articles = await req.mu.wiki.find({});

    if (req.params.category) {
      articles = articles.filter(
        (article) => article.category === req.params.category.toLowerCase()
      );
    }

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
    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
