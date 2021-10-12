![Ursamu](./media/ursamu_github_banner.png)

> Ursamu is a modern implementation of a MUSH server, a text based, intertnet roleplaying game. This work is definitely done on the shoulders of giants. This Repo is also in a very alpha state and the api is surely destinied to change as I move towards a stable 1.0.

This repo represents the core or the ursamu engine. It has the bare essentials to start an URSAMU server. For more information about the core API, check out the [documentation](https://ursamu.github.io/core). _warning!_ Still a work in progress!

- [Basic Usage](#basic-usage)
- [Adding Functions to the MUSCode Parser](#adding-functions-to-the-muscode-parser)
- [Commands](#commands)
- [Hooks](#hooks)
- [Flags](#flags)
- [The Plugin System](#the-plugin-system)
  - [`index.ts (using express)`](#indexts-using-express)
  - [`plugins/plugin1.ts`](#pluginsplugin1ts)
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

## Adding Functions to the MUSCode Parser

Functions allow you to implement custom mushcode in your game. While you cna't currently create pure mushcode commands yet, a user CAN interpret code in their input string.

```ts
import { parser } from "@ursamu/core";

parser.add("add", (args) => parseInt(args[0]) + parseInt(args[1]));
parser.add("sub", (args) => parseInt(args[0]) - parseInt(args[1]));

// Using a function an anonymous function def, also including the
// optional parameter `data`.
parser.add("repeat", function (args, data) {
  const width = args[1] ? parseIng(args[1]) : data.width;
  return args[0].repeat(width);
});

// -> user input: think [sub(add(1,2),1)] >> 2
// -> user input: think [repeat(-,4)] >> ----
```

## Commands

While softcoded commands are not yet available, it's very easy to add new 'hardcode' commands to **UrsamMU**. A command holds the following structure:

**Cmd**

- `name: string` The name of the function. Used in `+help`.
- `pattern: string | RegExp` The pattern for the command to match against. **UrsamMI** suppprts two kinds of patterns when you write your commands, string and regex (though honestly strings are processed and converted to regex under the hood). Regex allows for more powerful pattern matching. In regex, `(group)` matches will become the `args` array of the `render` property. Whene using strings, use wildcard `*` matching. To maych any input use an asterisk, if that input is optional use a question mark `?` instead.
- `flags: string` This is the flag expression the command enactor must pass before the command will match.
- `render: (ctx, args) => void` This is where the business logic of the command goes. `ctx` represents the current context object being passed through the `hooks.input.execute(ctx)` run. Args repreresents any grouped matches from the the commands `pattern`.

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

Hooks are middleware pipelines that can be used to modify data. There are serveral pre-defined hooks that you can utalize for the game, as well as a way to create your own custom hooks as needed by your addition or plugin. Data can be passed between hooks in a pipeline through the `context: ctx` object. Then, once done modifying the passed data, invoke the `next()` function to move onto the noext middleware in the pipeline.

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

## The Plugin System

The **plugin** system is simple to use! Simplpy put your code inside of a folder, export using `default export`, and call it in your main file whateveer that may be! It's the easiest way to expand upon a base **UrsaMU** installation. You can use whatever structure you want for your project, but in our example, our project structure is very simple:

```
- project
  - src
    - plugins
      plugin1.ts
    index.ts
  tsconfig.json
```

### `index.ts (using express)`

```ts
import { plugins, io } from "@ursamu/core";
import { join } from "fs";
import { express } from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);
io.attach(server);

// I'm only inteterested in adding files with the js or ts  extension,
// or folders with an 'index.js' file available, and avoid files that
// end in '.d.ts'
plugins(join(__dirname, "./plugins/"), ["js", "ts"], [".d.ts"]);

server.listen(4201);
```

### `plugins/plugin1.ts`

```ts
import { flags, parser, addCmd, send } from "@ursamu/core";

export default () => {
  // add commands
  addCmd({
    name: "test",
    pattern: ".test *",
    flags: "connected",
    render: async (ctx) => send(ctx.id, `Testing!: ${args[0]}`),
  });

  // add functions
  parser.add("add", (args) => parseInt(args[0]) + parseInt(args[1]));
  parser.add("sub", (args) => parseInt(args[0]) - parseInt(args[1]));

  parser.add("repeat", function (args, data) {
    const width = args[1] ? parseIng(args[1]) : data.width;
    return args[0].repeat(width);
  });

  // Add another flag with data!  :)
  flags.add({
    name: "foobar",
    cpde: "f".
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
