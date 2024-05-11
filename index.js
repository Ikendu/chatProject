const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
    console.log(`A new user connected with ${socket.id}`);
    socket.on('new user', (user) => {
        socket.broadcast.emit('new user', user)
    })
  socket.broadcast.emit("new user", socket.id);

  socket.on("group message", (msg) => {
    console.log(msg);
    io.emit("group message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`User with ${socket.id} has disconnected`);
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/client/index.html");
// });

const port = 3000;
server.listen(port, () => console.log(`Listening at port ${port}`));
