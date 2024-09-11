const readline = require("node:readline");
const fs = require("fs");
const validator = require("validator");
const { log } = require("node:console");

const { stdin: input, stdout: output } = require("node:process");
const { default: isEmail } = require("validator/lib/isEmail");
const { readFile, readFileSync } = require("node:fs");

const rl = readline.createInterface({ input, output });

rl.question("Nama: ", (name) => {
    rl.question("No Hp: ", (mobile) => {
        rl.question("Email: ", (email) => {
            const validEmail = validator.isEmail(email);
            const validMobile = validator.isMobilePhone(mobile);

            if (validMobile && validEmail) {
                const result = {
                    name,
                    mobile, 
                    email
                };
                const file = fs.readFileSync("data/contacts.json", "utf-8");
                const contact = JSON.parse(file);
                contact.push(result);

                fs.writeFileSync("data/contacts.json", JSON.stringify(contact, null, 2));
                console.log("Data mu tersimpan di file");
            } else {
                if (!validEmail) {
                    console.log("Email anda salah");
                }
                if (!validMobile) {
                    console.log("No Telepon anda salah");
                }
            }
            rl.close();
        })
    });
});