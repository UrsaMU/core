import { pipeline } from "@digibear/middleware";
import { Context } from "./broadcast";

export const hooks = pipeline<Context>();
