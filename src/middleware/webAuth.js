const { verify } = require("../utils/utils");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const auth = await verify(token);

    if (auth) {
      const player = await req.mu.db.get(auth.id);
      req.player = player;
    } else {
      res.sendStatus(401);
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
