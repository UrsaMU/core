import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import e from "express";
import { existsSync } from "fs";
import { readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { hooks } from "../../api/hooks";

let pid: number;
let child: ChildProcessWithoutNullStreams;

export default async () => {
  try {
    const fd = await readFile(join(__dirname, "pid"), "utf8");
    pid = parseInt(fd, 10);
  } catch {
    console.log("Starting new Telnet Instance!");

    child = spawn("node", [`${join(__dirname, "telnet.js")}`], {
      detached: true,
    });
    pid = child.pid!;

    writeFile(join(__dirname, "pid"), child.pid?.toString() || "", {
      encoding: "utf-8",
    });

    child.stdout.on("error", (err) => console.log(err));
  }

  hooks.shutdown.use(async (_, next) => {
    try {
      process.kill(pid);
      await unlink(join(__dirname, "pid"));
      next();
    } catch {
      await unlink(join(__dirname, "pid"));
      next();
    }
  });
};
