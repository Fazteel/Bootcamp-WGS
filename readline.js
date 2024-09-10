const readline = require("node:readline");
const fs = require("fs");
const { log } = require("node:console");

const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

rl.question("Siapa nama kamu? ", (name) => {
    rl.question("Berapa nomer hp mu? ", (mobile) => {
        rl.question("Email mu adalah? ", (email) => {
            const result = [ {
                name,
                mobile,
                email
            }];
            fs.writeFileSync("text.txt", JSON.stringify(result));
            console.log("Data mu tersimpan di file");
            rl.close();
        })
    });
});