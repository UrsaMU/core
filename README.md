![Ursamu](./media/ursamu_github_banner.png)

> Ursamu is the author's take on a modern implementation of a MUSH-like. A text based, intertnet roleplaying game of the 1990s and early 2000s (Though it's still happening today! - clearly!). This work is definitely done on the shoulders of giants. This Repo is also in a very alpha state and the api is surely destinied to change as I move towards a stable 1.0.

- [Basic Usage](#basic-usage)
- [Commands](#commands)
- [Hooks](#hooks)
- [Flags](#flags)
- [The Plugin System](#the-plugin-system)
- [Development](#development)
- [License](#license)

## Basic Usage

For the most basic usage of UrsaMU, the only thing your code needs to incorporate is the `start()` function. It takes a callback function that's executed at the end of the startup process. This makes an ideal place to add custom elements to your game.

```ts
import { start, plugins } from "@ursamu/core";
import { join } from "path";
start( async ()=>{
    await plugins(join(__dirname,"../../commands"));
    await plugins(joinn(__dirname,"../../plugins"));
    console.log("Game Loaded!");
);
```

## Commands

While softcoded commands are not yet available, it's very easy to add new 'hardcode' commands to **UrsamMU**. A command holds the following structure:

**Cmd**

- `name: string` The name of the command. Used in `+help`.
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

Hooks offer a way to modify some of the basic functionality of the server. Hooks in a nutshell are individual middleware processes, much like those used by the underlying `express` server.

```ts
interface HookObject {
  input: Pipe<Context>;
  startup: Pipe<any>;
  shutdown: Pipe<any>;
  connect: Pipe<DBObj>;
  disconnect: Pipe<DBObj>;
}
```

To add support for one of the middleware pipelines in your code, it can be added to a plugin in the following format:

```ts
import { hooks } from "@ursamu/core";

// plugin.ts

export default () => {
    hooks.connect.use(ctx:Context, next: Next) => {
        context.data.foo = "bar";
        next();
    }
}
```

Then, when we need to run the middleware pipeline in our code, we can invoke the `execute` function to run our middleware pipeline.

```ts
import { hooks, io } from "@uesamu/coro";

io.on("connection", (socket: Socket) => {
  socket.join(socket.id);

  socket.on("message", (ctx) => {
    ctx.id = socket.id;
    ctx.socket = socket;
    hooks.input.execute(ctx);
  });
});
```

## Flags

The flag system for **UrsaMU** offers a way to group similar dbobjects, and label them for different perpouses in game. Think of **UrsaMU's** flag system as a way to tag, and even lock systems to different objecs. First, we need to create a few flags:

```ts
import { flags } from "@ursamu/core";

flags.add(
  {
    name: "admin",
    lvl: 7,
    code: "a",
    lock: "admin+",
  },
  {
    name: "thing",
    lvl: 0,
    code: "t",
    lock: "admin+",
  },
  {
    name: "room",
    lvl: 0,
    code: "r",
    lock: "admin+",
  },
  {
    name: "player",
    lvl: 0,
    code: "p",
    lock: "admin+",
  },
  {
    name: "account",
    lvl: 0,
    code: "a",
    lock: "admin+",
    data: {
      foo: "bar",
      another: 1,
    },
  }
);
```

This way, you can set whatever flags you wish for your game. UrsaMU comes with a couple of predefined flags however, `immortal`, `admin`, `player`, `room` and `thing`. Though honestly, even the built in flags can be overwritten with your own specs when included with a plugin. :)

The **lock** field on a flag accepts a **flag expression**. Think of flag expressions as a lock, and to pass the lock the object has to have the right flags. You can look for a flag in particular, or you can use conditional operators to match certain conditions.

```
staff
!guest
wizard+
werewolf|vampire
werewolf|vampire|staff+ !guest
```

This also acts as the default locking mechanisim used in **UrsaMU**.

The very first player object created will recieve the immortal flag, which gives them unrestricted access to all systems in the game. To set a flag on an object in-game, use `@set <name>=<flag>[[!]<flag>][[!]<flag>][[!]<flag>]`

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
start(() => plugins(join(__dirname, "./plugins/")));
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

```
git clone https://github.com/ursamu/core.git
cd core
npm install or yarn
```

## License

**MIT**
