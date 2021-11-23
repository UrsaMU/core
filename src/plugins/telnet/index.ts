import { hooks } from "../..";
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
              script: join(__dirname, "telnet.ts"),
              name: "telnet",
              cwd: __dirname,
              interpreter: join(
                __dirname,
                "../../../node_modules/.bin/ts-node"
              ),
            },
            function (err, apps) {
              if (err) {
                console.error(err);
                return next();
              }
              pm2.disconnect();
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
