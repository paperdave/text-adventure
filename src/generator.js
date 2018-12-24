#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

console.log("Copying template to ./adventure");

fs.copySync(path.join(__dirname, "../template"), path.join(process.cwd(), "adventure"));

console.log("Done!\n");
console.log("Run the following to get started.");
console.log("1. cd adventure");
console.log("2. npm install");
console.log("3. npm start");