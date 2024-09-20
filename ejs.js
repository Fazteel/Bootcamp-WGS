const express = require("express");
const fs = require("fs");
const { title } = require("process");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.sendFile("./src/page/index.html", {root: __dirname});
    res.render('index', {nama: "Fahmi Andika", title: "Home"})
});

app.get('/about', (req, res) => {
    // res.sendFile("./src/page/about.html", {root: __dirname});
    res.render('about', {title: "About"});
});

app.get('/contact', (req, res) => {
    // res.sendFile("./src/page/contact.html", {root: __dirname});
    try {
        const file = fs.readFileSync("data/contacts.json", "utf-8");
        const contacts = JSON.parse(file);
        res.render('contact', {contact: contacts, title:"Contact"});
    } catch (error) {
        console.log("Gagal membaca file kontak:", error.message);
        return [];
    }
});

app.get('/product/:prodID/', (req, res) => {
    res.send(`Product ID :  ${req.params.prodID} <br> Category ID : ${req.query.catID}`); 
});

app.use('/', (req, res) => {
    res.status(404);
    res.send('Page not found: 404');
});

app.listen(port, () => {
    console.log(`Aplikasi berjalan di port ${port}`);
});