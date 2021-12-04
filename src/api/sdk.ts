import axios from "axios";
import fetch from "node-fetch";
import { EventEmitter } from "stream";
import { DBObj, logger } from "..";

interface SDKOptions {
  URL?: string;
  key: string;
}
interface _FetchOptions {
  path: string;
  data?: { [key: string]: any };
  headers?: { [key: string]: any };
  method?: "get" | "post" | "put" | "patch" | "delete";
}

export class SDK extends EventEmitter {
  _key: string;
  url?: string;

  constructor({ URL = "http://localhost:4201", key }: SDKOptions) {
    super();
    this._key = key;
    this.url = URL;
  }

  async _fetch({
    path,
    data = {},
    headers = {},
    method = "get",
  }: _FetchOptions) {
    const res = await axios({
      url: this.url + path,
      method,
      headers: { Authorization: `Bearer ${this._key}`, ...headers },
    });
    return res.data;
  }

  async create(data: Partial<DBObj>) {
    return await this._fetch({ path: "/dbobjs", data, method: "post" });
  }

  async get(params: any) {
    const data = Object.keys(params)
      .reduce((pre: string[], curr: string) => {
        pre.push(`${curr}=${params[curr]}`);
        return pre;
      }, [])
      .join("&");

    try {
      return await this._fetch({ path: `/dbobjs${data ? "?" + data : ""}` });
    } catch (error: any) {
      logger.error("Error: " + error.message);
    }
  }

  async createPlayer(name: string, password: string) {
    return await this._fetch({
      method: "post",
      path: "users",
      data: {
        name,
        password,
      },
    });
  }
}
