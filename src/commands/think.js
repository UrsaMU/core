module.exports = {
  name: "think",
  pattern: /think\s+(.*)/i,
  flags: "connected",
  render: (args, ctx) => ctx.mu.send(ctx.id, args[1]),
};
