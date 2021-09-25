# @ursamu/core

![Ursamu](ursamu_github_banner.png)

> Ursamu is a modern implementation of a MUSH server, a text based, intertnet roleplaying game. This work is definitely done on the shoulders of giants. This Repo is also in a very alpha state and the api is surely destinied to change as I move towards a stable 1.0.

This repo represents the core or the ursamu engine. It has the bare essentials to start an URSAMU server. For more information about the core API, check out the [documentation](https://ursamu.github.io/core). _warning!_ Still a work in progress!

- [@ursamu/core](#ursamucore)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Context](#context)
    - [`Context Object`](#context-object)
  - [Hooks](#hooks)
  - [Commands](#commands)
  - [Plugins](#plugins)
  - [Development](#development)

## Installation

## Basic Usage

## Context

When a request is sent through the server is sent through a context object. It is the primary thing you'll be interacting with when modifying what happens to the given players input.

### `Context Object`

- `id: string` The ID of the request being sent to the server.
- `socket: WebSocket` Reference to the socket the request came from.
- `data: {[key: string]: any}` Any additional data that needs to be sent with the request, like tokens, client widths, etc.
- `msg?: string` The original input send to the server.

## Hooks

The Hook system is a middleware engine under the hoood, used to send the user input through a pipeline of different middlewares.

let's take a look at `demoHook.ts`:

```ts
import { Contect } from "../api/app";
import { Next } from "@digibear/middleware";

export default (ctx: Context, next: Next) => {
  ctx.data.foo = "Bar";
  console.log("Foo Set");
  next();
};
```

And then in `index.ts` we need to import our new hook.

```ts
import { hooks } from "./api/hooks";
import demoHook from "./hooks/demoHook/";

// Add to the hook pipeline
hooks.use(demoHook);
```

## Commands

## Plugins

## Development
