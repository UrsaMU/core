const telnetlib = require("telnetlib");
const { nanoid } = require("nanoid");
const { io } = require("socket.io-client");
const { NAWS } = telnetlib.options;

args = process.argv.slice(1).map((arg) => parseInt(arg, 10));

const server = telnetlib.createServer(
  {
    localOptions: [NAWS],
    remoteOptions: [NAWS],
  },
  async (c) => {
    let token;
    c.id = nanoid();
    const naws = c.getOption(NAWS);

    // handle screen resize.
    naws.on("resize", (data) => {
      c.width = data.width;
      c.height = data.height;
    });

    const s = new io(`http://localhost:${args[1]}`);

    s.send({ msg: "", data: { login: true } });

    s.on("message", (ctx) => {
      const { token: tkn, quit } = ctx.data;

      if (tkn) token = tkn;
      if (ctx.msg) c.write(ctx.msg + "\r\n");
      if (quit) return c.end();
    });

    s.on("error", (err) => {
      console.error(err);
    });

    c.on("data", (data) => {
      s.send({
        data: { token, height: c.height, width: c.width },
        msg: data.toString(),
      });
    });
  }
);

server.listen(args[2]);
