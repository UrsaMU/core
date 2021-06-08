import { DB, DBObj } from "./database";

export class Refs {
  dbrefs: number[];

  constructor() {
    this.dbrefs = [];
  }

  /**
   * Initiate the dbref system.
   */
  async init() {
    this.dbrefs = (await DB.dbs.db.find<DBObj>({})).map(
      (record) => record.dbref
    );
  }

  /**
   * Get the next available ID.
   * @returns
   */
  async id() {
    await DB.dbs.db.find({});
    const mia = this.dbrefs.reduce<number[]>(function (acc, cur, ind, arr) {
      var diff = cur - arr[ind - 1];
      if (diff > 1) {
        var i = 1;
        while (i < diff) {
          acc.push(arr[ind - 1] + i);
          i++;
        }
      }
      return acc;
    }, []);

    if (mia.length) {
      return mia[0];
    } else {
      const id = this.dbrefs.length;
      this.dbrefs.push(id);
      return id;
    }
  }
}

export const dbrefs = new Refs();
