const EventEmitter = require("events");
const { Parser } = require("@ursamu/parser");
const { Tags } = require("@digibear/tags");
const { pipeline } = require("@digibear/middleware");
const { readdirSync } = require("fs");
const { DB } = require("./database");
const { readFileSync } = require("fs");
const { join } = require("path");
const { processDir, sign } = require("./utils/utils");
const { compare } = require("bcrypt");

class MU extends EventEmitter {
  constructor(app, server) {
    super(app, server);
    this.cmds = [];
    this.parser = new Parser();
    this.app = app;
    this.io = require("socket.io")(server);
    this.flags = new Tags();
    this.server = server;
    this.hooks = pipeline();
    this.db = new DB();
    this.config = require("../config/default.json");

    this.connections = new Map();
  }

  /**
   * Start Ursamu on the specified port.
   * @param {number} port
   */
  start(port) {
    const dirent = readdirSync(__dirname + "/commands/", {
      withFileTypes: true,
    });
    dirent.forEach(
      (file) =>
        file.name.endsWith(".js") &&
        this.cmds.push(require(__dirname + "/commands/" + file.name))
    );

    const connect = readFileSync(join(__dirname, "../text/connect.txt"), {
      encoding: "utf8",
    });

    this.io.on("connect", (socket) => {
      // send a connect message!
      socket.join(socket.id);

      socket.send({ data: { connected: true }, msg: "" });

      socket.on("message", async (ctx) => {
        ctx.mu = this;
        ctx.id = socket.id;
        ctx.data.socket = socket;
        await this.hooks.execute(ctx);

        if (!ctx.found && ctx.player) {
          this.send(socket.id, "Huh? Type 'help' for help.");
        }
      });
    });

    this.server.listen(port, () =>
      console.log(`UrsaMU Listening on Port ${port}`)
    );
  }

  use(...middleware) {
    this.hooks.use(...middleware);
  }

  cmd(...cmds) {
    this.cmds = [...this.cmds, ...cmds];
    return this;
  }

  fun(name, fun) {
    this.parser.add(name, fun);
    return this;
  }

  flag(...flags) {
    this.flags.add(...flags);
    return this;
  }

  subs(list, ...subs) {
    this.parser.subs.set(list, subs);
    return this;
  }

  to(str) {
    return this.io.to(str);
  }

  send(id, msg, data = {}) {
    this.io.to(id).emit("message", {
      msg: this.parser.substitute(data.type || "telnet", msg),
      data,
    });
    return this;
  }

  broadcast(msg, data = {}) {
    this.io.emit("message", {
      msg: this.parser.substitute(data.type || "telnet", msg),
      data,
    });
    return this;
  }

  force(ctx, command) {
    ctx.data.socket.send(command);
  }

  async entity(name, flgs, data = {}) {
    const { tags: flags } = this.flags.set("", {}, flgs + " entity");

    const entity = {
      name,
      flags,
      description: "You see nothing special.",
      location: "",
      contents: [],
      ...data,
    };

    return await this.db.create(entity);
  }

  token(name, password) {}

  async login(socket, name, password) {
    const regex = new RegExp(name, "i");
    const player = (await this.db.find({ name: regex }))[0];

    if (player && (await compare(password, player.password))) {
      const { tags } = this.flags.set(player.flags, {}, "connected");
      player.flags = tags;
      await this.db.update({ _id: player._id }, player);
      this.connections.set(socket.id, {
        socket,
        player: player._id,
      });
      socket.join(player.location);
      return await sign(player._id);
    }
  }
}

module.exports.MU = MU;
