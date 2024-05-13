const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("client"));

let allUsers = {};

io.on("connection", (socket) => {
  console.log(`A new user connected with ${socket.id}`);

  socket.on("new user", (user) => {
    console.log(`${user} has connected with ${socket.id}`);
    socket.broadcast.emit("new user", user);
    socket.nickname = user;
    if (socket.nickname) {
      allUsers[socket.id] = socket.nickname;
      console.log("All Users", allUsers);
      io.emit("allUsersList", allUsers);
    }
  });

  socket.broadcast.emit("new user", socket.nickname, socket.id);

  socket.on("group message", (nickname, msg) => {
    console.log(msg);
    socket.broadcast.emit("group message", nickname, msg);
  });

  socket.on("userTyping", (username) => {
    socket.broadcast.emit("userTyping", username);
  });
  socket.on("userNotTyping", () => {
    socket.broadcast.emit("userNotTyping");
  });

  socket.on("sendPrivateMsg", (senderID, recID, senderName, msg) => {
    socket.to(recID).emit("recPrivateMsg", senderID, senderName, msg);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user left", socket.nickname);
    delete allUsers[socket.id];
    console.log(allUsers);
    io.emit("allUsersList", allUsers);
  });
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/client/index.html");
// });

const port = 3000;
server.listen(port, () => console.log(`Listening at port ${port}`));
