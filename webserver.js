const http = require("http");
const fs = require("fs");

const renderHTML = (filePath, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.write("Error: Page not found");
          res.end();
        } else {
            res.write(data);
            res.end();
        }
    });
}

http.createServer((req, res) => {
    const url = req.url;
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    if (url === "/about") {
        renderHTML("./page/about.html", res);
    } else if (url === "/contact") {
        renderHTML("./page/contact.html", res);
    } else {
        renderHTML("./page/index.html", res);
    }

  }).listen(3000, () => {
    console.log("Server berjalan di port 3000");
});
