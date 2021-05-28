import { DBObj } from "./api/database";

export * from "./api/app";
export * from "./api/broadcast";
export * from "./api/config";
export * from "./api/connections";
export * from "./api/database";
export * from "./api/dbrefs";
export * from "./api/entitiies";
export * from "./api/flags";
export * from "./api/hooks";
export * from "./api/parser";
export * from "./api/cmds";
export * from "./utils/utils";


declare global {
    namespace Express {
      interface Request {
        player: DBObj
      }
    }
  }