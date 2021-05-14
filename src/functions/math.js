module.exports = (mu) => {
  mu.fun("add", (args) => args.reduce((a, b) => (a += parseInt(b)), 0));

  mu.fun(
    "sub",
    (module.exports.sub = (args) => parseInt(args[0]) - parseInt(args[1]))
  );
};
