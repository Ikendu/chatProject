const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("<h1>Hello Server</h1><h3>We are ready to work here</h3>");
});

const port = 3000;
server.listen(port, () => console.log(`Listening at port ${port}`));
