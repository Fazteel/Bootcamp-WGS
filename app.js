const fs = require("fs");
const path = require('path');
const express = require('express');
const validator = require('validator');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const pool = require('./db');
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
async function getContacts() {
    try {
        const result = await pool.query('SELECT * FROM contacts');
        return result.rows;
    } catch (error) {
        console.error("Gagal mengambil data dari database:", error.message);
        throw error;
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
app.get('/contact', async (req, res) => {
    try {
        const contacts = await getContacts();
        res.render('contact', {contact: contacts, title:"Contact"});
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data kontak:", error.message);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
});

// Route untuk menambah kontak
app.post('/contact/add', async (req, res) => {
    const { name, email, mobile } = req.body;
    try {
        if (!validator.isEmail(email)) {
            req.flash('error_msg', 'Email tidak valid');
            return res.redirect('/contact');
        }
        if (!validator.isMobilePhone(mobile, 'id-ID')) {
            req.flash('error_msg', 'No Telepon tidak valid');
            return res.redirect('/contact');
        }

        let contacts = await getContacts();
        if (contacts.some(contact => contact.name === name)) {
            req.flash('error_msg', `Nama ${name} sudah ada`);
            return res.redirect('/contact');
        }

        await pool.query(
            `INSERT INTO contacts VALUES ('${name}', '${email}', '${mobile}')`
        );

        req.flash('success_msg', 'Data berhasil disimpan');
        res.redirect('/contact');
    } catch (error) {
        console.error("Gagal menambah kontak:", error.message);
        req.flash('error_msg', 'Gagal menyimpan data');
        res.redirect('/contact');
    }

});

// Route untuk memperbarui kontak
app.post('/contact/update', async (req, res) => {
    const { oldName, newName, email, mobile } = req.body;

    try {
        if (!validator.isEmail(email)) {
            req.flash('error_msg', 'Email tidak valid');
            return res.redirect('/contact');
        }

        if (!validator.isMobilePhone(mobile, 'id-ID')) {
            req.flash('error_msg', 'No Telepon tidak valid');
            return res.redirect('/contact');
        }

        const contacts = await getContacts();
        const contactToUpdate = contacts.find(contact => contact.name.toLowerCase() === oldName.toLowerCase());

        if (!contactToUpdate) {
            req.flash('error_msg', `Kontak dengan nama ${oldName} tidak ditemukan`);
            return res.redirect('/contact');
        }

        await pool.query(
            'UPDATE contacts SET name = $1, email = $2, mobile = $3 WHERE name = $4',
            [newName.trim(), email.trim(), mobile.trim(), oldName.trim()]
        );

        req.flash('success_msg', `Kontak ${oldName} berhasil diperbarui`);
        res.redirect('/contact');
    } catch (error) {
        console.error("Gagal memperbarui kontak:", error.message);
        req.flash('error_msg', `Gagal memperbarui kontak ${oldName}`);
        res.status(500).redirect('/contact');
    }
});

// Route untuk menghapus kontak
app.post('/contact/delete', async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) {
            req.flash('error_msg', 'Nama kontak tidak boleh kosong');
            return res.status(400).redirect('/contact');
        }

        const contacts = await getContacts();
        const contactToDelete = contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase());

        if (!contactToDelete) {
            req.flash('error_msg', `Kontak dengan nama ${name} tidak ditemukan`);
            return res.status(404).json({ message: `Kontak dengan nama ${name} tidak ditemukan` });
        }

        await pool.query('DELETE FROM contacts WHERE name = $1', [name.trim()]);

        req.flash('success_msg', `Kontak ${name} berhasil dihapus`);
        return res.redirect('/contact');
    } catch (error) {
        console.error("Gagal menghapus kontak:", error.message);
        req.flash('error_msg', `Gagal menghapus kontak ${name}`);
        return res.status(500).redirect('/contact');
    }
});

// Route untuk mencari kontak
app.get('/contact/search', async (req, res) => {
    const { query } = req.query;

    try {
        // Jika tidak ada query, kembalikan semua kontak
        if (!query) {
            const result = await pool.query('SELECT * FROM contacts');
            return res.json(result.rows);
        }

        // Jika ada query, lakukan pencarian berdasarkan nama, email, atau mobile
        const searchQuery = `%${query.toLowerCase()}%`;
        const result = await pool.query(
            `SELECT * FROM contacts 
             WHERE LOWER(name) LIKE $1 
             OR LOWER(email) LIKE $2 
             OR mobile LIKE $3`, 
            [searchQuery, searchQuery, searchQuery]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Gagal mencari kontak:", error.message);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
});


// Handle 404
app.use('/', (req, res) => {
    res.status(404).send('Page not found: 404');
});

app.listen(port, () => {
    console.log(`Aplikasi berjalan di port http://localhost:${port}`);
});
