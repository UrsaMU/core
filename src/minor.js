const telnetlib = require("telnetlib");
const io = require("socket.io-client");
const { nanoid } = require("nanoid");
const { readFileSync } = require("fs");
const { join } = require("path");

const { NAWS } = telnetlib.options;

const connect = readFileSync(join(__dirname, "../text/connect.txt"), {
  encoding: "utf8",
});

const server = telnetlib.createServer(
  {
    localOptions: [NAWS],
    remoteOptions: [NAWS],
  },
  (c) => {
    const s = new io("http://localhost:4200");
    const naws = c.getOption(NAWS);

    naws.sendResize();

    naws.on("resize", (data) => {
      c.width = data.width;
      c.height = data.height;
    });

    let token;
    c.id = nanoid();
    console.log(token);
    c.write(connect + "\r\n");

    s.on("message", (ctx) => {
      const { token: tok, connected } = ctx.data;
      token = tok ? tok : token;

      if (connected && token) {
        c.write("...Reconnecting\r\n");
      } else if (ctx.msg) {
        c.write(ctx.msg + "\r\n");
      }
    });

    s.on("disconnect", () => c.exit());

    c.on("data", (data) =>
      s.send({
        data: { token, height: c.height, width: c.width },
        msg: data.toString(),
      })
    );
  }
);

server.listen(4203, () => console.log("Telnet server listening on port: 4203"));
