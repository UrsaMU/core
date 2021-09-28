import { HookData } from "../api/hooks";
import { Next } from "@digibear/middleware";
import { loaddir } from "../utils/utils";
import { join } from "path";

export default async (data: HookData, next: Next) => {
  // load resources
  await loaddir(join(__dirname, "../commands/"));
  await loaddir(join(__dirname, "../scripts/"));
  await loaddir(join(__dirname, "../services/"));
  next();
};
