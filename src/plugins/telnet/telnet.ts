import { createServer } from "net";
import io from "socket.io-client";

const server = createServer((c) => {
  const s = io("http://localhost:4201");

  c.on("data", (data) =>
    s.send({
      msg: data.toString(),
      data: {},
    })
  );

  s.on("message", (data) => {
    if (data.msg) c.write(data.msg + "\r\n");
  });
});

server.listen(4202);
console.log("Telnet Started!");
