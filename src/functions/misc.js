module.exports = (mu) => {
  mu.fun("width", async (args, data) => {
    if (args[0].toLowerCase() === "me") {
      return data.socket.width || 78;
    } else {
      const regex = new RegExp(args[0], "i");
      target = (
        await mu.db.find({ $or: [{ name: regex }, { _id: args[0] }] })
      )[0];
      if (target) {
        return mu.getSocket(target._id).width || 78;
      }
    }
  });
};
