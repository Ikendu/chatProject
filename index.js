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
  socket.on("disconnect", () => {
    console.log(`A user with ID ${socket.id} disconnected`);
  });
});

const port = 3000;
server.listen(port, () => console.log(`connected at post ${port}`));
