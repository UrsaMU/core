import { pipeline } from "@digibear/middleware";
import { Context } from "./app";

export const hooks = pipeline<Context>();
