![Ursamu](./media/ursamu_github_banner.png)

> Ursamu is a modern implementation of a MUSH server, a text based, intertnet roleplaying game. This work is definitely done on the shoulders of giants. This Repo is also in a very alpha state and the api is surely destinied to change as I move towards a stable 1.0.

This repo represents the core or the ursamu engine. It has the bare essentials to start an URSAMU server. For more information about the core API, check out the [documentation](https://ursamu.github.io/core). _warning!_ Still a work in progress!

- [Basic Usage](#basic-usage)
- [Commands](#commands)
- [Hooks](#hooks)
- [Flags](#flags)
- [Logger](#logger)
- [SDK](#sdk)
- [Security](#security)
- [The Plugin System](#the-plugin-system)
- [Development](#development)
- [License](#license)

## Basic Usage

```ts
import { io } from "@ursamu/core";
import { createServer } from "http";

const server = createServer((req, res) => {});
io.attach(server);

server.listen(4201);
```
## Commands

While softcoded commands are not yet available, it's very easy to add new 'hardcode' commands to **UrsamMU**. A command holds the following structure:

**Cmd**

- `name: string` The name of the function. Used in `+help`.
- `pattern: string | RegExp` The pattern for the command to match against. **UrsamMI** suppprts two kinds of patterns when you write your commands, string and regex (though honestly strings are processed and converted to regex under the hood). Regex allows for more powerful pattern matching. In regex, `(group)` matches will become the `args` array of the `render` property. Whene using strings, use wildcard `*` matching. To maych any input use an asterisk, if that input is optional use a question mark `?` instead.
- `flags: string` This is the flag expression the command enactor must pass before the command will match.
- `render: (ctx, args) => Promise<any>` This is where the business logic of the command goes. `ctx` represents the current context object being passed through the `hooks.input.execute(ctx)` run. Args repreresents any grouped matches from the the commands `pattern`.

```ts
import { addCmd } from "@ursamu/core";

addCmd({
  name: "test",
  pattern: "@test ?", //could allso be written as  /^@test\s+(.*)?/
  flags: "connected", // Must have connected flag to use.
  render: async (ctx) => send(ctx.id, `Testing!: ${args[0]}`),
});
```

## Hooks

Hooks are middleware pipelines that can be used to modify data. There are serveral pre-defined hooks that you can utalize for the game, as well as a way to create your own custom hooks as needed by your addition or plugin. Data can be passed between hooks in a pipeline through the `Context` object. Then, once done modifying the passed data, invoke the `next()` function to move onto the noext middleware in the pipeline.

```ts
import { hooks } from "@ursamu/core";

hooks.input.use((ctx, next) => {
  ctx.data.foo = "bar";
  ctx.data.original.msg = ctx.msg;
  next();
});
```

Then, when we need to run the middleware pipeline in our code, we can invoke the `execute` function to run our middleware chain.

```ts
import { hooks, io } from "@uesamu/coro";

io.on("connection", (socket: Socket) => {
  socket.join(socket.id);

  socket.on("message", (ctx) => {
    try {
      ctx = JSON.parse(ctx);
      ctx.id = socket.id;
      ctx.socket = socket;
      hooks.input.execute(ctx);
    } catch {
      ctx.id = socket.id;
      ctx.socket = socket;
      hooks.input.execute(ctx);
    }
  });
});
```

## Flags
Coming soon

## Logger
Comming soon

## SDK
Comming soon

## Security
Coming soon

## The Plugin System

The **plugin** system is simple to use! Simplpy put your code inside of a folder, export using `default export` (or `module.exports` depending on if you're writing your plugin using Typescript or JS!), and call it in your main file whateveer that may be! It's the easiest way to expand upon a base **UrsaMU** installation. You can use whatever structure you want for your project, but in our example, our project structure is very simple:

```
- project
  - src
    - plugins
      plugin1.ts
    index.ts
  tsconfig.json
```

**`index.ts`**
```ts
import { plugins, start } from "@ursamu/core";
import { join } from "fs";

// I'm only inteterested in adding files with the js or ts  extension,
// or folders with an 'index.js' file available, and avoid files that
// end in '.d.ts'
start(()=> plugins(join(__dirname, "./plugins/")))
```

**`plugins/plugin1.ts`**

```ts
import { flags, addCmd, send } from "@ursamu/core";

export default () => {
  // add commands
  addCmd({
    name: "test",
    pattern: ".test *",
    flags: "connected",
    render: async (ctx) => send(ctx.id, `Testing!: ${args[0]}`),
  });

  // Add another flag with data!  :)
  flags.add({
    name: "foobar",
    code: "f".
    lock: "builder|staff+",
    lvl: 0,
    data: {
      some: "data",
    }
  })
};
```

## Development

coming soon

## License

**MIT**
