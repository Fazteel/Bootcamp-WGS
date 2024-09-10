const fs = require("fs");  // Import modul fs

function generate(name, mobile) {
    console.log("Nama saya", name + ', ' + "Nomer Telp saya", mobile);
}

// Gunakan fs.writeFileSync untuk menulis ke file index.txt
fs.writeFileSync('index.txt', 'Saya Fahmi test');
