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

    const connect = (reboot = false) => {
      const s = new WebSocket("ws://localhost:3000");
      const naws = c.getOption(NAWS);
      let retry = true;

      // handle screen resize.
      naws.on("resize", (data) => {
        c.width = data.width;
        c.height = data.height;
      });

      if (reboot) {
        setTimeout(
          () =>
            s.send(
              JSON.stringify({
                msg: "think ... Game Reconnected!",
                data: { token, width: c.width },
              })
            ),
          1000
        );
      }

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

      s.on("close", () =>
        setTimeout(() => {
          if (retry) connect(true);
        }, 1000)
      );

      c.on("end", () => {
        retry = false;
        s.close();
      });

      c.on("error", (err) => console.error(err));

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
