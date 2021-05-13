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
const express = require("express");
const { Server } = require("http");

class MU extends EventEmitter {
  /**
   * Instantiate a new MU game object.
   * @param {express.Application} app The express application
   * @param {Server} server  The http Server.
   */
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
    this.motd = readFileSync(join(__dirname, "../text/motd.txt"), {
      encoding: "utf8",
    });

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
        socket.width = ctx.data.width;
        ctx.data.socket = socket;
        await this.hooks.execute(ctx);
      });
    });

    this.server.listen(port, () =>
      console.log(`UrsaMU Listening on Port ${port}`)
    );
  }

  /**
   * Add a hook to the messaging middleware system.
   * @param  {...any} middleware
   */
  use(...middleware) {
    this.hooks.use(...middleware);
  }

  /**
   * @typedef {object} cmd
   * @property {string} name - The name of the command to add.
   * @property {RegExp} pattern - The pattern to match the command against.
   * @property {string} [help] - The help entry for the command.
   * @property { function(string[], object)} render - The function that controls
   * what your copmmand does with te given inputs from the command call.  The
   * body of the command.
   */

  /**
   * Add a new in-game command to be matched against player input.
   * @param  {...cmd} cmds The list of commands to add to the system.
   * @returns
   */
  cmd(...cmds) {
    this.cmds = [...this.cmds, ...cmds];
    return this;
  }

  /**
   * @typedef {function(atring[], object)} MuFunction
   */

  /**
   * Ad a mushcode function to the in-game system
   * @param {string} name The name of the function to add
   * @param {MuFunction} fun The function body
   * @example mu.fun("add", args => args.reduce((a,b) =>  a += parseInt(b), 0))
   *
   * @returns {void}
   */
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

  async send(id, msg, data = {}) {
    this.io.to(id).emit("message", {
      msg: this.parser.substitute(
        data.type || "telnet",
        await this.parser.string(data.type || "telnet", {
          msg,
          data,
          scope: { "%#": this.connections.get(data?.socket?.id)?.player || "" },
        })
      ),
      data: {},
    });
    return this;
  }

  async broadcast(msg, data = {}) {
    this.io.emit("message", {
      msg: this.parser.substitute(
        data.type || "telnet",
        await this.parser.string(data.type || "telnet", {
          msg,
          data,
          scope: { "%#": this.connections.get(data?.socket?.id)?.player || "" },
        })
      ),
      data: {},
    });
    return this;
  }

  force(ctx, command) {
    this.hooks.execute({ ...ctx, ...{ msg: command } });
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

  configure(...plugins) {
    plugins.forEach((plugin) => plugin(this));
  }

  getSocket(id) {
    let results;
    this.connections.forEach((v, k) => {
      if (v.player === id) results = v.socket;
    });

    return results;
  }

  async name(enactor, target) {
    if (this.flags.check(enactor.flags, "staff+")) {
      return `${target.name} (%ch%cx${target._id}-${this.flags.codes(
        target.flags.trim()
      )}%cn)`;
    } else {
      return target.name;
    }
  }
}

module.exports.MU = MU;
