const yargs = require("yargs");
const fs = require("fs");
const validator = require("validator");
const { type } = require("os");

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
        console.log("Data gagal disimpan", error.message);   
    }
}

const listData = () => {
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        const contact = JSON.parse(file);

        console.log("List data contact");
        contact.forEach((contact, index) => {
            console.log(`${index + 1}. ${contact.name} - ${contact.mobile} - ${contact.email}`);
        })
    } catch (error) {
        console.log("Data tidak ditemukan", error.message);
    }
}

const detailData = (name) => {
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        const contact = JSON.parse(file);

        const result = contact.filter(contact => contact.name.toLowerCase() === name.toLowerCase());
        if (result.length > 0) {
            console.log("Detail contact ditemukan");
            console.log(`Nama : ${result[0].name}`);
            console.log(`Mobile : ${result[0].mobile}`);
            console.log(`Email : ${result[0].email}`);
        } else {
            console.log(`Contact dengan nama ${name} tidak ditemukan`);
        }
    } catch (error) {
        console.log("Data tidak ditemukan", error.message);
    }
}

const editData = (oldName, newName, newMobile, newEmail) => {
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        const contacts = file ? JSON.parse(file) : [];

        const index = contacts.findIndex(contact => contact.name.toLowerCase() === oldName.toLowerCase());
        if (index === -1) {
            console.log(`Contact dengan nama ${oldName} tidak ditemukan`);
            return;
        }

        const contactToUpdate = contacts[ index ];
        
        if (!newName && !newMobile && !newEmail) {
            console.log("Mohon isi data untuk memperbarui contact");
            return;
        }

        if (newEmail && !validator.isEmail(newEmail)) {
            console.log("Email anda salah");
            return;
        }
        if (newMobile && !validator.isMobilePhone(newMobile)) {
            console.log("No Telepon anda salah");
            return;
        }

        if (newName) {
            contactToUpdate.name = newName;
        }
        if (newMobile) {
            contactToUpdate.mobile = newMobile;
        }
        if (newEmail) {
            contactToUpdate.email = newEmail;
        }

        fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
        console.log(`Data contact ${oldName} berhasil diperbarui`);
    } catch (error) {
        console.log("Data gagal disimpan", error.message);
    }
}

const deleteData = (name) => {
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        let contact = JSON.parse(file);

        const update = contact.find(contact => contact.name.toLowerCase() === name.toLowerCase());
        if (!update) {
            console.log(`Data ${name} tidak ditemukan`);
            return;
        }

        const updateData = contact.filter(contact => contact.name.toLowerCase() !== name.toLowerCase());
        fs.writeFileSync("data/contacts.json", JSON.stringify(updateData, null, 2));
        console.log(`Data contact ${name} berhasil dihapus`);
    } catch (error) {
        console.log("Data gagal dihapus", error.message);
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

yargs.command({
    command: 'list',
    describe: 'Menampilkan data pada list contact',
    handler() {
        listData();
    }
});

yargs.command({
    command: 'detail',
    describe: 'Menampilkan detail data pada contact',
    builder: {
        name: {
            describe: 'Contact name',
            demandOption: 'true',
            type: 'string',
        },
    },
    handler(argv) {
        detailData(argv.name);
    }
});

yargs.command({
    command: 'edit',
    describe: 'Mengubah data pada contact',
    builder: {
        oldName: {
            describe: 'Contact name',
            demandOption: 'true',
            type: 'string',
        },
        newName: {
            describe: 'New Name',
            type: 'string',
        },
        newMobile: {
            describe: 'New Mobile',
            type: 'string',
        },
        newEmail: {
            describe: 'New Email',
            type: 'string',
        },
    },
    handler(argv) {
        editData(argv.oldName, argv.newName, argv.newMobile, argv.newEmail);
    }
});

yargs.command({
    command: 'delete',
    describe: 'Menghapus data contact',
    builder: {
        name: {
            describe: 'Nama contact yang ingin dihapus',
            demandOption: 'true',
            type: 'string'
        },
    },
    handler(argv) {
        deleteData(argv.name)
    }
});

yargs.parse()