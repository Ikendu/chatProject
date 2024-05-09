const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

app.use(express.static("client"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/client/index.html");
// });

const port = 3000;
server.listen(port, () => console.log(`Listening at port ${port}`));
