const telnetlib = require("telnetlib");
const env = require("dotenv");
const { nanoid } = require("nanoid");
const WebSocket = require("ws");

env.config();

const { NAWS } = telnetlib.options;
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

    const connect = (reboot = false) => {
      const s = new WebSocket("ws://localhost:3000");
      let retry = true;

      s.onopen(() => {
        if (reboot) {
          s.send(
            JSON.stringify({
              msg: "think ... Game Reconnected!",
              data: { token, width: c.width },
            })
          );
        }
      });

      s.on("message", (data) => {
        const ctx = JSON.parse(data);
        const { token: tkn, command } = ctx.data;

        if (tkn) token = tkn;
        if (ctx.msg) c.write(ctx.msg + "\r\n");
        if (command === "quit") {
          retry = false;
          c.end();
        }
      });

      s.on("error", (err) => {
        console.error(err);
      });

      s.on("close", () => {
        if (retry) connect(true);
      });

      c.on("end", () => {
        retry = false;
        s.close();
        c.remove;
      });

      c.on("error", (err) => {
        if (retry) connect(true);
      });

      c.on("data", (data) => {
        s.send(
          JSON.stringify({
            data: { token, height: c.height, width: c.width },
            msg: data.toString(),
          })
        );
      });
    };
    connect();
  }
);

server.listen(4202, () => console.log("Telnet server listening on port: 4202"));
