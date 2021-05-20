import { server } from "./api/app";

class MU {
  start(port: number) {
    server.listen(port || 4201);
  }
}
