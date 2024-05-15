const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("client"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/client/");
// });

io.on("connection", (socket) => {
  console.log(`A user connected with ${socket.id}`);
  socket.on("checker", (name) => {
    console.log(`my name is ${name}`);
  });
});

const port = 3000;
app.listen(port, () => console.log(`connected at post ${port}`));
