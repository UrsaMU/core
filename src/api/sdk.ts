import axios from "axios";
import { EventEmitter } from "stream";
import { DBObj } from "..";

interface SDKOptions {
  URL: string;
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
  url: string;

  constructor({ URL, key }: SDKOptions) {
    super();
    this._key = key;
    this.url = URL;
  }

  async _fetch({ path, data, headers, method = "get" }: _FetchOptions) {
    const res = await axios[method](`${this.url}/${path}`, data, {
      headers: {
        Authorization: `Bearer ${this._key}`,
        ...headers,
      },
    });
    return res.data;
  }

  async create(data: Partial<DBObj>) {
    return await this._fetch({ path: "dbobj", data, method: "post" });
  }

  async getById(dbref: string) {
    const res = await axios.get(`${this.url}/dbobjs/${dbref.slice(1)}`, {
      headers: {
        Authorization: `Bearer ${this._key}`,
      },
    });
    return res.data;
  }

  async get() {
    const res = await axios.get(`${this.url}/dbobjs`, {
      headers: {
        Authorization: `Bearer ${this._key}`,
      },
    });
    return res.data;
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
