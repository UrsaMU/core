import { Router } from "express";
import { Context, hooks, MuRequest } from "..";

const router = Router();

router.post("/", async (req: MuRequest, res, next) => {
  try {
    const ctx: Context = {
      data: req.body.data ? req.body.data : {},
      id: req.user?.dbref || "",
      msg: req.body.text,
    };
    
    await hooks.input.execute(ctx);
    console.log(ctx);
    if (ctx.res) {
      res.status(200).json({ text: ctx.res });
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
