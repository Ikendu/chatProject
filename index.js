const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server, Namespace } = require("socket.io");
const { v4: generateRandomId } = require("uuid");

const io = new Server(server);

app.use(express.static("client"));

app.set("view engine", "ejs");

//generate an id for a new group
app.get("/privgroup/:name", (req, res) => {
  const name = req.params.name;
  const grpid = generateRandomId();
  res.redirect(`/privgroup/${name}/${grpid}`);
  // res.sendFile(__dirname + "/client/private.html");
});
//redirected to the new gruop
app.get("/privgroup/:name/:grpid", (req, res) => {
  const name = req.params.name;
  const grpid = req.params.grpid;

  res.render(`group`, { name, grpid });
});

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`A user connected with ${socket.id}`);

  //alert others when a user connected
  socket.on("new user", (nickname) => {
    socket.nickname = nickname;
    console.log(`A user ${nickname} with id ${socket.id} just connected`);
    socket.broadcast.emit("new user", nickname);
    if (socket.nickname) connectedUsers[socket.id] = socket.nickname;
    io.emit("users list", connectedUsers);
    console.log("Connected Users", connectedUsers);
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

  socket.on("privateMsg", (senderID, recID, senderName, msg) => {
    socket.to(recID).emit("recMessage", senderID, senderName, msg);
  });

  socket.on("disconnect", () => {
    console.log(`A user with ID ${socket.id} disconnected`);
    //alert others when a user disconnects
    socket.broadcast.emit("user disconnect", socket.id, socket.nickname);
    delete connectedUsers[socket.id];
    io.emit("users list", connectedUsers);
    console.log("Connected User", connectedUsers);
  });
});

// creating and connecting to a new Namespace
io.of("privgroup").on("connection", (socket) => {
  console.log(`New privated group created with ${socket.id}`);
