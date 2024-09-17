const { execSync } = require("child_process");
const readlineSync = require("readline-sync");

// Menambahkan semua perubahan ke staging area
execSync("git add .", { stdio: "inherit" });

// Meminta input message untuk commit
const commitMessage = readlineSync.question("Masukkan pesan commit: ");

// Melakukan commit dengan message yang diinputkan
execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

// Melakukan push ke branch master
execSync("git push -u origin main", { stdio: "inherit" });

console.log("Perubahan berhasil di-push ke branch master.");
