import { EventEmitter } from "stream";
import { MUSocket } from "./app";

class Connnections extends EventEmitter {
  private _conns: MUSocket[];

  constructor() {
    super();
    this._conns = [];
  }

  add(conn: MUSocket) {
    if (!this.has(conn.cid || conn.id || "")) this._conns.push(conn);
    return this;
  }

  has(id: string) {
    return this._conns.find((con) => con.cid === id || con.id === id);
  }

  remove(id: string) {
    this._conns = this._conns.filter((con) => {
      return con.id !== id || con.cid !== id ? true : false;
    });
    return this;
  }

  socket(id: string) {
    return this._conns.find((conn) => conn.id === id || conn.cid === id);
  }

  get conns() {
    return this._conns;
  }
}

const conns = new Connnections();
export { conns };
