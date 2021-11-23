import axios from "axios";
import { EventEmitter } from "stream";
import { DBObj } from "..";

interface SDKOptions {
  URL: string;
  key: string;
}

export class SDK extends EventEmitter {
  _key: string;
  url: string;

  constructor({ URL, key }: SDKOptions) {
    super();
    this._key = key;
    this.url = URL;
  }

  async create(data: Partial<DBObj>) {
    const res = await axios.post(`${this.url}/dbobjs`, data, {
      headers: {
        Authorization: `Bearer ${this._key}`,
      },
    });
    return res.data;
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
}
