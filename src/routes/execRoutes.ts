import { Router } from "express";
import { Context, hooks, MuRequest } from "..";

const router = Router();

router.post("/", async (req: MuRequest, res, next) => {
  const ctx: Context = {
    data: req.body.data ? req.body.data : {},
    id: req.user?.dbref || "",
    msg: req.body.text,
  };
  try {
    await hooks.input.execute(ctx);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

export default router;
