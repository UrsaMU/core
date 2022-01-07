import { config, hooks, logger } from "../..";
import pm2 from "pm2";
import { join } from "path";

export default () => {
  hooks.startup.use((ctx, next) => {
    pm2.connect(function (err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      pm2.list((err, list) => {
        if (err) console.log(err);
        const proc = list.find((proc) => proc.name === "telnet");

        if (!proc) {
          pm2.start(
            {
              script: join(__dirname, "telnet.js"),
              name: "telnet",
              cwd: __dirname,
              args: `${config.get("port") || "4201"} ${
                config.get("telnetPort") || "4202"
              }`,
            },
            function (err) {
              if (err) {
                console.error(err);
                return next();
              }
              pm2.disconnect();
              logger.info("Telnet Started on port: " + config.get("telnetPort"));
              return next();
            }
          );
        } else {
          pm2.disconnect();
          return next();
        }
      });
    });
  });
};
