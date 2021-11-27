const telnetlib = require("telnetlib");
const { nanoid } = require("nanoid");
const { io } = require("socket.io-client");
const dotenv = require("dotenv");
const { NAWS } = telnetlib.options;

dotenv.config();

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

    const s = new io(`http://localhost:${process.env.PORT || 4201}`);

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

server.listen(process.env.TELNETPORT || 4202);
