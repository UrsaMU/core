import { parser } from "../../api/parser";

export default () => {
  parser.addSubs(
    "telnet",
    {
      before: /%b/g,
      after: " ",
      strip: " ",
    },
    {
      before: /%r/g,
      after: "\n",
      strip: "",
    },
    {
      before: /%t/g,
      after: "\t",
      strip: "    ",
    }
  );
  console.log("Substitutions loaded.");
};
