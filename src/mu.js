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
const { createServer } = require("http");
const { get, set } = require("lodash");
const e = require("cors");

class MU extends EventEmitter {
  /**
   * Instantiate a new MU game object.
   * @param {express.Application} app The express application
   */
  constructor(app) {
    super(app);
    this.cmds = [];
    this.attrs = this.parser = new Parser();
    this.app = app;
    this.flags = new Tags();
    this.server = createServer(app);
    this.io = require("socket.io")(this.server);
    this.hooks = pipeline();
    this.db = new DB();
    this.dbrefs = [];

    this.config = require("../config/default.json");
    this.motd = readFileSync(join(__dirname, "../text/motd.txt"), {
      encoding: "utf8",
    });

    this.connections = new Map();
  }

  _id() {
    const mia = this.dbrefs.reduce(function (acc, cur, ind, arr) {
      var diff = cur - arr[ind - 1];
      if (diff > 1) {
        var i = 1;
        while (i < diff) {
          acc.push(arr[ind - 1] + i);
          i++;
        }
      }
      return acc;
    }, []);

    if (mia.length) {
      return mia[0];
    } else {
      const id = this.dbrefs.length;
      this.dbrefs.push(id);
      return id;
    }
  }

  /**
   * Start Ursamu on the specified port.
   * @param {number} port
   */
  async start(port) {
    const dirent = readdirSync(__dirname + "/commands/", {
      withFileTypes: true,
    });
    dirent.forEach(
      (file) =>
        file.name.endsWith(".js") &&
        this.cmds.push(require(__dirname + "/commands/" + file.name))
    );

    const records = await this.db.find({});

    this.dbrefs = records.map((record) => record.dbref);
    const players = records.filter((record) =>
      record.flags.split(" ").includes("connected") ? true : false
    );

    const rooms = records.filter((record) =>
      record.flags.split(" ").includes("room")
    );

    if (!rooms.length) {
      const limbo = await this.entity("Limbo", "Room");
      this.set("startingRoom", limbo._id);
    } else {
      const limbo = (await this.db.find({ name: "Limbo" }))[0];
      if (!this.config.startingRoom) this.set("startingRoom", limbo._id);
    }

    for (const player of players) {
      const { tags } = this.flags.set(player.flags, {}, "!connected");
      player.flags = tags.trim();
      await this.db.update({ _id: player._id }, player);
    }

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

  /**
   * @typedef {object} Flag
   * @property {string} name - The name of the flag you want to add to the system.
   * @property {string} code - The short code for quick display.
   * @property {number} lvl - The number representing how elevated a flag is.  The higher the mubmer, the more permssions.
   * @property {string} lock - A Flag expression that controls who can  set a flag.
   */

  /**
   * Add new flags to the game
   * @param  {...Flag} flags Add a list of one or more flags to the game.
   * @returns
   */

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
          scope: {
            ...{ "%#": this.connections.get(data?.socket?.id)?.player || "" },
            ...data.scope,
          },
        })
      ),
      data: data.transmit || {},
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
          scope: {
            ...{ "%#": this.connections.get(data?.socket?.id)?.player || "" },
            ...data.scope,
          },
        })
      ),
      data: data.transmit || {},
    });
    return this;
  }

  async force(ctx, command) {
    await this.hooks.execute({ ...ctx, ...{ msg: command } });
  }

  async entity(name, flgs, data = {}) {
    const { tags: flags } = this.flags.set("", {}, flgs + " entity");

    const entity = {
      name,
      flags,
      dbref: this._id(),
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
      await this.send(player.location, `${player.name} has connected.`);
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
      return `${target.name.split(";")[0]} (#${target.dbref}${this.flags.codes(
        target.flags.trim()
      )})`;
    } else {
      return target.name;
    }
  }

  set(path, value) {
    set(this.config, path, value);
    return this;
  }

  get(path) {
    return get(this.config, path);
  }

  /**
   *
   * @param {import("./database").DBObj} en The enactor
   * @param {string | number} tar The dbref, id or name of the target we want.
   * @returns {Promise<import("./database").DBObj>}
   */
  async target(en, tar) {
    if (tar.toLowerCase() === "me") {
      return en;
    } else if (tar.toLowerCase() === "here") {
      return await this.db.get(en.location);
    } else {
      const regex = new RegExp(tar, "i");
      return (
        await this.db.find({
          $or: [
            { name: regex },
            { _id: tar },
            { dbref: parseInt(tar.slice(1)) },
          ],
        })
      )[0];
    }
  }
}

module.exports.MU = MU;
