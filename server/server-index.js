const express = require("express");
const path = require("path");

//app initialization
const app = express();

//directory for static files to serve up
app.use(express.static(path.join(__dirname, "../client/dist")));


//web3
// const Web3 = require("web3");
// var web3 = new Web3();


//routes here


//server creation
app.listen(4037, () => {
  console.log("Proof of existence app is listening on port 4037");
});