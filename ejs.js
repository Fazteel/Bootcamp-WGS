const fs = require("fs");
const path = require('path');
const express = require('express');
const validator = require('validator');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const expressLayouts = require("express-ejs-layouts");
const port = 3000;

// Set view engine menjadi EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Gunakan express-ejs-layouts
app.use(expressLayouts);

app.use(express.json());

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware untuk session
app.use(session({
    secret: 'anTaRES', 
    resave: false,
    saveUninitialized: true,
}));

// Middleware untuk flash messages
app.use(flash());

// Middleware untuk mengakses flash messages di semua route
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

// Set layout utama default
app.set('layout', 'layouts/main');

// Static Files
app.use('/src', express.static(path.join(__dirname, 'src')));

// Function untuk membaca file kontak
function readContacts() {
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        return JSON.parse(file);
    } catch (error) {
        console.log("Gagal membaca file kontak:", error.message);
        return [];
    }
}

// Function untuk menyimpan kontak ke file
function writeContacts(contacts) {
    try {
        fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
        console.log("Data berhasil disimpan");
        return true;
    } catch (error) {
        console.log("Gagal menyimpan data:", error.message);
        return false;
    }
}

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.render('index', {nama: "Fahmi Andika Setiono", title: "Home"});
});

// Route untuk halaman about
app.get('/about', (req, res) => {
    res.render('about', {title: "About"});
});

// Route untuk halaman kontak
app.get('/contact', (req, res) => {
    const contacts = readContacts();
    res.render('contact', {contact: contacts, title:"Contact"});
});

// Route untuk menambah kontak
app.post('/contact/add', (req, res) => {
    let contacts = readContacts();
    const { name, email, mobile } = req.body;

    if (!validator.isEmail(email)) {
        req.flash('error_msg', 'Email tidak valid');
        return res.redirect('/contact');
    }
    if (!validator.isMobilePhone(mobile, 'id-ID')) {
        req.flash('error_msg', 'No Telepon tidak valid');
        return res.redirect('/contact');
    }
    if (contacts.some(contact => contact.name === name)) {
        req.flash('error_msg', `Nama ${name} sudah ada`);
        return res.redirect('/contact');
    }

    const newContact = { name, email, mobile };
    contacts.push(newContact);

    if (writeContacts(contacts)) {
        req.flash('success_msg', 'Data berhasil disimpan');
    } else {
        req.flash('error_msg', 'Gagal menyimpan data');
    }

    res.redirect('/contact');
});

// Route untuk memperbarui kontak
app.post('/contact/update', (req, res) => {
    const { oldName, newName, email, mobile } = req.body;
    let contacts = readContacts();

    const index = contacts.findIndex(c => c.name.toLowerCase() === oldName.toLowerCase());
    if (index === -1) {
        req.flash('error_msg', `Kontak dengan nama ${oldName} tidak ditemukan`);
        return res.redirect('/contact');
    }

    contacts[index] = { 
        name: newName.trim(),
        email: email.trim(),
        mobile: mobile.trim()
    };

    if (writeContacts(contacts)) {
        req.flash('success_msg', `Kontak ${oldName} berhasil diperbarui`);
        res.redirect('/contact');
    } else {
        req.flash('error_msg', `Gagal memperbarui kontak ${oldName}`);
        res.status(500).redirect('/contact');
    }
});

// Route untuk menghapus kontak
app.post('/contact/delete', (req, res) => {
    const { name } = req.body;

    if (!name) {
        req.flash('error_msg', 'Nama kontak tidak boleh kosong');
        return res.status(400).redirect('/contact');
    }

    let contacts = readContacts();

    const filteredContacts = contacts.filter(contact => {
        return contact.name && contact.name.toLowerCase() !== name.toLowerCase();
    });

    if (filteredContacts.length === contacts.length) {
        req.flash('error_msg', `Kontak dengan nama ${name} tidak ditemukan`);
        return res.status(404).json({ message: `Kontak dengan nama ${name} tidak ditemukan` });
    }

    if (writeContacts(filteredContacts)) {
        req.flash('success_msg', `Kontak ${name} berhasil dihapus`);
        return res.redirect('/contact'); 
    } else {
        req.flash('error_msg', `Gagal menghapus kontak ${name}`);
        return res.status(500).redirect('/contact');
    }
});

// Route untuk mencari kontak
app.get('/contact/search', (req, res) => {
    const { query } = req.query;
    let contacts = readContacts();

    if (!query) {
        return res.json(contacts);
    }

    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase()) ||
        contact.mobile.includes(query)
    );

    res.json(filteredContacts);
});


// Handle 404
app.use('/', (req, res) => {
    res.status(404).send('Page not found: 404');
});

app.listen(port, () => {
    console.log(`Aplikasi berjalan di port http://localhost:${port}`);
});
