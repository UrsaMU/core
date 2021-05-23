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
      s.send({ msg: "", data: { width: data.width, height: data.height } });
    });

    let token;
    c.id = nanoid();
    console.log(token);
    c.write(connect + "\r\n");

    s.on("message", (ctx) => {
      const { token: tok, connected, exit } = ctx.data;
      token = tok ? tok : token;

      if (connected && token) {
        c.write("...Reconnecting, and we're back!\r\n");
      } else if (exit) {
        c.end();
      } else if (ctx.msg !== "") {
        c.write(ctx.msg + "\r\n");
      }
    });

    c.on("data", (data) =>
      s.send({
        data: { token, height: c.height, width: c.width },
        msg: data.toString(),
      })
    );
  }
);

server.listen(4203, () => console.log("Telnet server listening on port: 4203"));
