![Ursamu](ursamu_github_banner.png)

> Ursamu is a modern implementation of a MUSH server, a text based, intertnet roleplaying game. This work is definitely done on the shoulders of giants. This Repo is also in a very alpha state and the api is surely destinied to change as I move towards a stable 1.0.

## Classes

### `Class MU`

the **MU** class is the heart of UrsaMU. It handles the basic IO and communication layer. It also orhestrates all of the other builtin APIs and makes them available to the different parts of the game engine in genereal. **warning** there's a lot of functionality packed into here. 😎

- **`cnd(...cmd: Cmd[]) => void`** Add a new command to Ursamu.

```js
mu.cmd({
  name: "emit",
  help:`
  SYNTAX: [@]emit <message>

  Semd a message to the entire room, without having a name or label attached
  to it.
`.trim(),
  pattern: /@?emit\s+(.*)/i,
  flags: "connected !mute",
  render: async (args, ctx) => await ctx.mu.broad(ctx.player.location], args[1]),
});

// @emit This is a test! =>  This is a test!
```

- **`fun(name: string, fun: MuFunction) => void`** Add a new softcode function to your UrsaMU installation. Extending and over-writing functions is super easy!

```js
// Implement an adding softcode function
mu.fun("add", (args) => args.reduce((a, b) => (a += parseInt(b, 10)), 0));

// think [add(1,2,3)] => 6
```
