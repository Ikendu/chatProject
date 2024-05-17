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

  //alert others when a user connected
  socket.on("new user", (nickname) => {
    socket.nickname = nickname;
    console.log(`A user ${nickname} with id ${socket.id} just connected`);
    socket.broadcast.emit("new user", nickname);
  });

  socket.on("group message", (nickname, msg) => {
    socket.broadcast.emit("group message", nickname, msg);
  });

  socket.on("isTyping", (user) => {
    socket.broadcast.emit("isTyping", user);
  });

  socket.on("userNotType", (user) => {
    socket.broadcast.emit("userNotType");
  });

  socket.on("disconnect", () => {
    console.log(`A user with ID ${socket.id} disconnected`);
    //alert others when a user disconnects
    socket.broadcast.emit("user disconnect", socket.id, socket.nickname);
  });
});

const port = 3001;
server.listen(port, () => console.log(`connected at post ${port}`));
