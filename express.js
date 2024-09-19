const express = require("express");
// const path = require("path");
const app = express();
const port = 3000;

// const renderHTML = (filePath, res) => {
//     res.sendFile(path.join(__dirname, filePath), (err) => {
//         if (err) {
//             console.error("Error", err);
//             res.status(500).send("Internal server error");
//         } else {
//             console.log("File sent", filePath);
//         }
//     })
// }

app.get('/', (req, res) => {
    res.sendFile("./src/page/index.html", {root: __dirname});
});

app.get('/about', (req, res) => {
    res.sendFile("./src/page/about.html", {root: __dirname});
});

app.get('/contact', (req, res) => {
    res.sendFile("./src/page/contact.html", {root: __dirname});
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