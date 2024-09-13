const yargs = require("yargs");
const fs = require("fs");
const validator = require("validator");

const addData = (name, email, mobile) => {
    const validEmail = validator.isEmail(email);
    const validMobile = validator.isMobilePhone(mobile);

    if (validMobile && validEmail) {
        return {
            name,
            email,
            mobile
        } ;
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

        const duplicate = contact.find(contact => contact.name === result.name);
        if (duplicate) {
            console.log(`Nama ${result.name} sudah ada`);
            return;
        }
        contact.push(result);

        fs.writeFileSync("data/contacts.json", JSON.stringify(contact, null, 2));
        console.log("Data mu tersimpan di file");
    } catch (error) {
        console.log("Terjadi kesalahan", error.message);
        
    }
}

yargs.command({
    command: 'add',
    builder: {
        name: {
            describe: 'Contact name',
            demandOption: 'true',
            type: 'string',
        },
        email: {
            describe: 'Contact email',
            demandOption: 'false',
            type: 'string',
        },
        mobile: {
            describe: 'Contact mobile phone number',
            demandOption: 'true',
            type: 'string',
        },
    },
    handler(argv) {
        const contact = addData(
            argv.name,
            argv.email,
            argv.mobile,
        );

        if (contact) {
            saveData(contact);
        }
    }
});

yargs.parse()