module.exports = {
  name: "dig",
  pattern: /[@\+]?dig(?:\/(\w+)?)?\s(.*)/i,
  flags: "connected wizard+",
  render: async (args, ctx) => {
    let room1, room2, exit1, exit2;

    const slash = args[1];
    const [to, from] = args[2].split("=");
    const [toRoom, toExit] = to.split(",");

    const enactor = ctx.mu.connections.get(ctx.id);
    const player = await ctx.mu.db.get(enactor.player);

    // just incase there is no from...
    const [fromRoom, fromExit] = from.split(",") || "";

    room1 = await ctx.mu.entity(toRoom, "room", { exits: [] });

    if (fromRoom) {
      room2 = await ctx.mu.entity(fromRoom.trim(), "Room", { exits: [] });
    }

    // Save room1
    ctx.mu.send(
      ctx.id,
      `%chDone.%cn Room ${room1.name.split(";")[0]} (%ch%cx${
        room1._id
      }%cn) dug.`
    );
    if (toExit) {
      exit1 = await ctx.mu.entity(toExit.trim(), "exit", {
        to: room2._id || "",
      });
      room1.exits.push(exit1._id);
      await ctx.mu.db.update({ _id: room1._id }, room1);
      ctx.mu.send(
        ctx.id,
        `%chDone.%cn Exit ${exit1.name.split(";")[0]} (%ch%cx${
          exit1._id
        }%cn) opened.`
      );
    }

    // Check to see if room2
    if (room2) {
      ctx.mu.send(
        ctx.id,
        `%chDone.%cn Room ${room2.name.split(";")[0]} (%ch%cx${
          room2._id
        }%cn) dug.`
      );
      if (fromExit) {
        exit2 = await ctx.mu.entity(fromExit.trim(), "exit", {
          to: room1._id || "",
        });
        room2.exits.push(exit2._id);
        await ctx.mu.db.update({ _id: room2._id }, room2);
        ctx.mu.send(
          ctx.id,
          `%chDone.%cn Exit ${exit2.name.split(";")[0]} (%ch%cx${
            exit2._id
          }%cn) opened.`
        );
      }
    }

    if (slash && slash.match(/tel|teleport/i)) {
      ctx.data.socket.leave(player.location);
      player.location = room1._id;
      await ctx.mu.db.update({ _id: player._id }, player);
      ctx.mu.send(ctx.id, "Teleporting!");
      ctx, data.socket.join(player.location);
      ctx.mu.force(ctx, "look");
    }
  },
};
