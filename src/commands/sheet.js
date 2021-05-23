module.exports = {
  name: "sheet",
  pattern: /^[@\+]?sheet(?:\s+(\w+))/i,
  flags: "connected",
  render: (args, ctx) => {
    let output = `[ljust(%cy<%ch<%cn ${ctx.name(
      ctx.player,
      target
    )} %ch%cy>%cn%cy>%cn, %cb=%ch-%cn, sub(width(%#),4))]%r`;
  },
};
