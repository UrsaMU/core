module.exports = (mu) => {
  // In order to keep things DRY, creating a function expression to render filler strings.
  const repeatString = (string = " ", length) => {
    // check how many spaces are left after the filler string is rendered. We will need
    // to render these last few spaces manually.
    const remainder = Math.floor(
      length % mu.parser.stripSubs("telnet", string).length
    );

    // Split the array and filter out empty cells.
    let cleanArray = string.split("%").filter(Boolean);
    // If the array length is longer than 1 (more then one cell), process for ansii
    if (cleanArray.length > 1) {
      // If it's just a clear formatting call 'cn' then we don't need to worry
      // about it.  We'll handle making sure ansii is cleared after each substitution manually.
      cleanArray = cleanArray
        .filter((cell) => {
          if (cell.toLowerCase() !== "cn") {
            return cell;
          }
        })

        // fire the substitutions on each cell.
        .map((cell) => {
          return "%" + cell + "%cn";
        });
    } else {
      cleanArray = cleanArray[0].split("");
    }
    return (
      string.repeat(length / mu.parser.stripSubs("telnet", string).length) +
      cleanArray.slice(0, remainder)
    );
  };

  mu.fun("center", (args) => {
    let str = args[0] || "";
    let fill = args[1] || " ";
    let len = parseInt(args[2]) || 0;
    let wordlen = mu.parser.stripSubs("telnet", str).length;
    let left = Math.floor(len / 2 - wordlen);
    let remainder = Math.floor((len - left - wordlen - left) / 2);
    return `${repeatString(fill, left + remainder)}${str}${repeatString(
      fill,
      left + remainder
    )}`;
  });

  mu.fun("ljust", (args) => {
    let str = args[0] || "";
    let fill = args[1] || " ";
    let len = parseInt(args[2]) || 0;
    let wordlen = mu.parser.stripSubs("telnet", str).length;
    let left = Math.floor(len / 2 - wordlen);

    return `${str}${repeatString(fill, left)}`;
  });

  mu.fun("rjust", (args) => {
    let str = args[0] || "";
    let fill = args[1] || " ";
    let len = parseInt(args[2]) || 0;
    let wordlen = mu.parser.stripSubs("telnet", str).length;
    let left = Math.floor(len / 2 - wordlen);

    return `${repeatString(fill, left)}${str}`;
  });

  mu.fun("repeat", (args) => {
    const str = args[0] || "";
    const len = parseInt(args[1], 10) || 0;
    return `${repeatString(str, len)}`;
  });
};