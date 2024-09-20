const express = require("express");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.sendFile("./src/page/index.html", {root: __dirname});
    res.render('index')
});

app.get('/about', (req, res) => {
    // res.sendFile("./src/page/about.html", {root: __dirname});
    res.render('about');
});

app.get('/contact', (req, res) => {
    // res.sendFile("./src/page/contact.html", {root: __dirname});
    res.render('contact');
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