import { MUSocket } from "./app";

let conns: MUSocket[] = [];

/**
 *  Return the socket of an in-game object if a socket is available.
 * @param id The _id or dbref of the target who's socket we want to retreive.
 * @example
 * const socket = getSocket('wErwwSFfgdfu');
 * @returns
 */
export const getSocket = (id: string) =>
  conns.find(
    (conn) =>
      conn.id === id ||
      conn.cid === id ||
      conn.dbref === parseInt(id.slice(1), 10)
  );

/**
 * Remove a connection from the connecitons list
 * @param id The Socket.id to be removed from the conn list.
 */
export const remConn = (id: string) => {
  conns = conns.filter((con) => con.id == id);
};

export { conns };
