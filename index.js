const fs = require("fs");  // Import modul fs

fs.readFile("test.txt", "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);
});
