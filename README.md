![Ursamu](ursamu_github_banner.png)

> Ursamu is a modern implementation of a MUSH server, a text based, intertnet roleplaying game. This work is definitely done on the shoulders of giants. This Repo is also in a very alpha state and the api is surely destinied to change as I move towards a stable 1.0.

This repo represents the core or the ursamu engine. It has the bare essentials to start an URSAMU server.

## Basic Usage

At it's root, an instance of ursamu can be spun up with two lines of code:

```ts
import { server } from "@ursamu/core";

server.listen(4201);
```

And you have a listening server! Of course, you're going to need a bit more before your game is functional!

## Hooks

Hooks are a middleware system that messages sent to the sever is sent too, to handle various in-game actions like movement, commands, etc. It works just like an ExpressJS middleware. Instead of manipulating the reqest and response objects, we're modifying the context object.

```ts
export default (ctx: Context, next: Next) => {
  ctx.temp.test = true;
  next();
};
```
