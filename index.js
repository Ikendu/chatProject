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
  //alert others when a user disconnects
  socket.broadcast.emit("new user", socket.id);

  socket.on("group message", (msg) => {
    io.emit("group message", msg);
  });
  socket.on("disconnect", () => {
    console.log(`A user with ID ${socket.id} disconnected`);
    //alert others when a user disconnects
    socket.broadcast.emit("user disconnect", socket.id);
  });
});

const port = 3000;
server.listen(port, () => console.log(`connected at post ${port}`));
