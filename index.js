const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
  console.log(`A new user connected with ${socket.id}`);

  socket.on("new user", (user) => {
    console.log(`${user} has connected with ${socket.id}`);
    socket.broadcast.emit("new user", user);
    socket.nickname = user;
  });

  socket.broadcast.emit("new user", socket.nickname);

  socket.on("group message", (nickname, msg) => {
    console.log(msg);
    io.emit("group message", nickname, msg);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user left", socket.nickname);
    //   console.log(`User with ${socket.id} has disconnected`);
    //     socket.broadcast.emit("user disconnected", socket.id);
  });
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/client/index.html");
// });

const port = 3000;
server.listen(port, () => console.log(`Listening at port ${port}`));
