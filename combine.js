const fs = require("fs");
var jsonConcat = require("json-concat");

jsonConcat(
  {
    src: "./25",
    dest: null,
  },
  (_err, json) => {
    if (_err) return console.error(_err);
    let data = JSON.stringify(json).replace(/\s+/g, " ");
    fs.writeFileSync("all_raw.json", data);
  }
);
