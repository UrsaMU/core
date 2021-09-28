import { createServer } from "net";
import {
  Telnet,
  CompatibilityTable,
  TelnetFlag,
  TelnetOption,
} from "libtelnet-ts";
import WebSocket from "ws";

const server = createServer();
let table: CompatibilityTable;
let flags: TelnetFlag;

server.on("connection", (c) => {
  let tkn = "";
  const connect = () => {
    const telnet = new Telnet(table, flags);
    const ws = new WebSocket("ws://localhost:3000");
    const t = new TextEncoder();
    const d = new TextDecoder();
    ws.on("close", () =>
      setTimeout(() => {
        connect();
        ws.send(
          JSON.stringify({
            msg: "",
            data: { token: tkn },
          })
        );
      }, 1000)
    );

    ws.on("message", (data) => {
      const ctx = JSON.parse(data.toString());
      const { token, command } = ctx.data;
      tkn = token ? token : tkn;

      if (ctx.msg) telnet.send(t.encode(ctx.msg + "\r\n"));
      if (command === "quit") c.end();
    });

    c.on("data", (bytes) => telnet.receive(bytes));
    telnet.on("send", ({ buffer }) => c.write(buffer));
    telnet.on("data", ({ buffer }) =>
      ws.send(JSON.stringify({ msg: d.decode(buffer), data: { token: tkn } }))
    );

    c.on("close", () => telnet.dispose());
  };

  connect();
});

Telnet.ready.then((e) => {
  table = CompatibilityTable.create()
    .support(TelnetOption.NAWS, false, true)
    .finish();

  server.listen(4202);
});
