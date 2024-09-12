const fs = require("fs");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const { readFile, readFileSync } = require("node:fs");

function generate(name, mobile) {
    console.log("Nama saya", name + ', ' + "Nomer Telp saya", mobile);
}

fs.writeFileSync('index.txt', 'Saya Fahmi test');

const addData = (name, mobile, email) => {
    const validEmail = validator.isEmail(email);
    const validMobile = validator.isMobilePhone(mobile);

    if (validMobile && validEmail) {
        return {
            name,
            mobile,
            email
        };
    } else {
        if (!validEmail) {
            console.log("Email anda salah");
        }
        if (!validMobile) {
            console.log("No Telepon anda salah");
        }
        return null;
    }
};

const saveData = (result) => {
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        const contact = JSON.parse(file);
        contact.push(result);

        fs.writeFileSync("data/contacts.json", JSON.stringify(contact, null, 2));
        console.log("Data mu tersimpan di file");
    } catch (error) {
        console.log("Terjadi kesalahan", error.message);
        
    }
}

module.export = {
    addData,
    saveData
}