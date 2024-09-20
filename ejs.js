const express = require("express");
const fs = require("fs");
const path = require("path");
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
    const contacts = path.join(__dirname, 'data/contacts.json');

    fs.readFile(contacts, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading contacts.json:', err);
            return res.status(500).send('Internal Server Error');
        }

        const contacts = JSON.parse(data);

        res.render('contact', {contact: contacts, title:"Contact"});
    });
    //     {
    //         name: "Fahmi",
    //         email: "fahmi@gmail.com",
    //     },
    //     {
    //         name: "Iqbal",
    //         email: "iqbal@gmail.com",
    //     },
    //     {
    //         name: "Seno",
    //         email: "seno@gmail.com",
    //     },
    //     {
    //         name: "Bintang",
    //         email: "bintang@gmail.com",
    //     },
    // ];
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