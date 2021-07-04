![Ursamu](ursamu_github_banner.png)

> Ursamu is a modern implementation of a MUSH server, a text based, intertnet roleplaying game. This work is definitely done on the shoulders of giants. This Repo is also in a very alpha state and the api is surely destinied to change as I move towards a stable 1.0.

This repo represents the core or the ursamu engine. It has the bare essentials to start an URSAMU server. For more information about the core API, check out the [documentation](https://ursamu.github.io/core). _warning!_ Still a work in progress!

## Basic Usage

```ts
import { app } from "@ursamu/core";

app.listen(4201);
```

## Hooks

Hooks are a middleware chain specifically for user input. It's particularly useful for doing things like parsing real-time chat messages for commands, triggering events, exits - and anything else you might want to accomplish with user input.

```ts
import { hooks, Context } from "@ursamu/core";

hooks.use((ctx, next) => {
  ctx.data.foo = "bar";
  ctx.data.original.msg = ctx.msg;
  next();
});

const ctx: Context = {
  msg: "This is the player input.",
  data: {},
};
```
