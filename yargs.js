const yargs = require("yargs");
const fs = require("fs");
const validator = require("validator");

const readContacts = () => {
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        return JSON.parse(file);
    } catch (error) {
        console.log("Gagal membaca file kontak:", error.message);
        return [];
    }
};

const writeContacts = (contacts) => {
    try {
        fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
        console.log("Data berhasil disimpan");
    } catch (error) {
        console.log("Gagal menyimpan data:", error.message);
    }
};

const addData = (name, email, mobile) => {
    if (!validator.isEmail(email)) {
        console.log("Email anda salah");
        return null;
    }
    if (!validator.isMobilePhone(mobile, 'id-ID')) {
        console.log("No Telepon anda salah");
        return null;
    }

    const contacts = readContacts();
    if (contacts.some(contact => contact.name === name)) {
        console.log(`Nama ${name} sudah ada`);
        return null;
    }

    const newContact = { name, email, mobile };
    contacts.push(newContact);
    writeContacts(contacts);
};

const listData = () => {
    const contacts = readContacts();
    console.log("List data contact:");
    contacts.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.name} - ${contact.mobile} - ${contact.email}`);
    });
};

const detailData = (name) => {
    const contacts = readContacts();
    const contact = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    if (contact) {
        console.log("Detail contact ditemukan:");
        console.log(`Nama : ${contact.name}`);
        console.log(`Mobile : ${contact.mobile}`);
        console.log(`Email : ${contact.email}`);
    } else {
        console.log(`Contact dengan nama ${name} tidak ditemukan`);
    }
};

const editData = (oldName, newName, newMobile, newEmail) => {
    const contacts = readContacts();
    const index = contacts.findIndex(contact => contact.name.toLowerCase() === oldName.toLowerCase());

    if (index === -1) {
        console.log(`Contact dengan nama ${oldName} tidak ditemukan`);
        return;
    }

    if (newEmail && !validator.isEmail(newEmail)) {
        console.log("Email anda salah");
        return;
    }
    if (newMobile && !validator.isMobilePhone(newMobile, 'id-ID')) {
        console.log("No Telepon anda salah");
        return;
    }

    if (newName) {
        contacts[ index ].name = newName;
    }
    if (newMobile) {
        contacts[ index ].mobile = newMobile;
    }
    if (newEmail) {
        contacts[ index ].email = newEmail;
    }

    writeContacts(contacts);
    console.log(`Data contact ${oldName} berhasil diperbarui`);
};

const deleteData = (name) => {
    const contacts = readContacts();
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase() !== name.toLowerCase());

    if (filteredContacts.length === contacts.length) {
        console.log(`Data ${name} tidak ditemukan`);
        return;
    }

    writeContacts(filteredContacts);
    console.log(`Data contact ${name} berhasil dihapus`);
};

// Yargs commands
yargs.command({
    command: 'add',
    describe: 'Menambah kontak baru',
    builder: {
        name: { describe: 'Nama kontak', demandOption: true, type: 'string' },
        email: { describe: 'Email kontak', demandOption: true, type: 'string' },
        mobile: { describe: 'Nomor telepon kontak', demandOption: true, type: 'string' },
    },
    handler(argv) {
        addData(argv.name, argv.email, argv.mobile);
    }
});

yargs.command({
    command: 'list',
    describe: 'Menampilkan semua kontak',
    handler() {
        listData();
    }
});

yargs.command({
    command: 'detail',
    describe: 'Menampilkan detail kontak',
    builder: {
        name: { describe: 'Nama kontak', demandOption: true, type: 'string' },
    },
    handler(argv) {
        detailData(argv.name);
    }
});

yargs.command({
    command: 'edit',
    describe: 'Mengubah kontak',
    builder: {
        oldName: { describe: 'Nama kontak lama', demandOption: true, type: 'string' },
        newName: { describe: 'Nama kontak baru', type: 'string' },
        newMobile: { describe: 'Nomor telepon baru', type: 'string' },
        newEmail: { describe: 'Email baru', type: 'string' },
    },
    handler(argv) {
        editData(argv.oldName, argv.newName, argv.newMobile, argv.newEmail);
    }
});

yargs.command({
    command: 'delete',
    describe: 'Menghapus kontak',
    builder: {
        name: { describe: 'Nama kontak', demandOption: true, type: 'string' },
    },
    handler(argv) {
        deleteData(argv.name);
    }
});

yargs.parse();
