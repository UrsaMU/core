module.exports = {
  name: "@dig",
  pattern: /^[@\+]?dig(?:\/(\w+)?)?\s(.*)/i,
  flags: "connected wizard+",
  help: `
@DIG

  COMMAND: @dig[/<switches>] <name> [= <exitlist> [, <exitlist>] ]

  Creates a new room with the specified name and displays its number.  
  If the [= <exitlist>] option is used, an exit will be opened from the
   current room to the new room automatically.  If the second <exitlist> 
   option (after the comma) is specified, an exit from the
  new room back to the current room with the specified [Exits] name is
  opened.  Either exit creation may fail if you do not have sufficient
  rights to the current room to open or link the new exit.
  Example: The command

     @dig Kitchen = Kitchen;k;north;n,south;s

  will dig a room called Kitchen, and open an exit called 'Kitchen' in your
  current room.  The ; symbol means that you may enter the exit by typing
  'k', 'north' or 'n' also.  This command also opens the exit 'south;s' from
  'Kitchen' back to where you are.  Only the first Exit name is displayed in
  the Obvious exits list.

  If you specify the /teleport switch, then you are @teleported to the
  room after it is created and any exits are opened.

  Related Topics: @destroy, @link, @open.
  `.trim(),
  render: async (args, ctx) => {
    const slash = args[1];
    const [nRoom, exits] = args[2]?.split("=");
    const [tExit, fExit] = (exits || "").split(",");
    try {
      if (nRoom !== "") {
        const room = await ctx.mu.entity(nRoom, "room", {
          owner: ctx.player._id,
        });
        ctx.mu.send(
          ctx.id,
          `%chDone%cn. Room %ch${await ctx.mu.name(ctx.player, room)}%cn dug.`
        );

        if (tExit) {
          const toExit = await ctx.mu.entity(tExit, "exit", {
            owner: ctx.player._id,
            location: ctx.player.location,
          });
          ctx.mu.send(
            ctx.id,
            `%chDone%cn.%cn Exit %ch${await ctx.mu.name(
              ctx.player,
              toExit
            )}%cn opened`
          );
        }

        if (fExit) {
          const fromExit = await ctx.mu.entity(fExit, "exit", {
            owner: ctx.player._id,
            location: room._id,
          });
          ctx.mu.send(
            ctx.id,
            `%chDone%cn.%cn Exit %ch${await ctx.mu.name(
              ctx.player,
              fromExit
            )}%cn opened`
          );
        }

        if (slash && slash.match(/t[eleport]*?/i)) {
          ctx.data.socket.leave(ctx.player.location);
          ctx.player.location = room._id;
          await ctx.mu.db.update({ _id: ctx.player._id }, ctx.player);
          await ctx.mu.send(ctx.id, "Teleporting!");
          ctx.data.socket.join(ctx.player.location);
          ctx.mu.force(ctx, "look");
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};
