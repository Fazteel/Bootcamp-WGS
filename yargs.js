const yargs = require("yargs");
const fs = require("fs");

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
        const contact = {
            name: argv.name,
            email: argv.email,
            mobile: argv.mobile,
        };
        saveData(contact);
    }
})

yargs.parse()