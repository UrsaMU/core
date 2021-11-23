import config from "config";
import dotenv from "dotenv";
import { logger } from "./api/logger";
import { start } from "./api/app";
export { DBObj } from "./models/DBObj";
export * from "./api/broadcast";
export * from "./api/app";
export * from "./api/broadcast";
export * from "./api/flags";
export * from "./api/hooks";
export * from "./api/parser";
export * from "./api/cmds";
export * from "./api/plugins";
export * from "./api/sdk";
export * from "./api/security";
export * from "./declorations";
dotenv.config();
export { config, logger };

start();

process.on("uncaughtException", (err) => logger.error(err.message));
