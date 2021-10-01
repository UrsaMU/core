import { flags } from "../api/flags";

export default () => {
  flags.add(
    {
      name: "immortal",
      code: "i",
      lvl: 10,
      lock: "immortal+",
    },
    {
      name: "wizard",
      code: "w",
      lvl: 9,
      lock: "immortal+",
    },
    {
      name: "staff",
      code: "s",
      lvl: 5,
      lock: "wizard+",
    },
    {
      name: "connected",
      code: "c",
      lvl: 0,
      lock: "wizard+",
    },
    {
      name: "player",
      code: "p",
      lvl: 0,
      lock: "immortal+",
    },
    {
      name: "room",
      code: "r",
      lvl: 0,
      lock: "wizard+",
    },
    {
      name: "newbie",
      code: "n",
      lvl: 0,
      lock: "staff+",
    }
  );
};
