const fs = require("fs");
const validator = require("validator");

// fs.readFile("test.txt", "utf-8", (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });

const email = 'bangtantogether@gmail.com';

if (validator.isEmail(email)) {
    console.log("Format email anda benar");
} else {
    console.log("Format email anda salah");
}