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

    const connect = () => {
      const s = new WebSocket("ws://localhost:3000");
      const naws = c.getOption(NAWS);

      // handle screen resize.
      naws.on("resize", (data) => {
        c.width = data.width;
        c.height = data.height;
      });

      s.on("message", (data) => {
        const ctx = JSON.parse(data);
        const { token: tkn } = ctx.data;

        if (tkn) token = tkn;
        if (ctx.msg) c.write(ctx.msg + "\r\n");
      });

      s.on("close", () =>
        setTimeout(() => {
          connect();
          s.send(
            JSON.stringify({
              msg: "",
              data: { token, height: c.height, width: c.width },
            })
          );
        }, 1000)
      );

      c.on("end", () => s.close());
      s.on("quit", () => c.end());

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
