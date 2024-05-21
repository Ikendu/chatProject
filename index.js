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
const grpNSP = io.of("privgroup");
grpNSP.on("connection", (socket) => {
  console.log(`New privated group created with ${socket.id}`);

  socket.on("sendGroupId", (sendGroupId) => {
    socket.join(sendGroupId);
  });

  const socketId = socket.id;

  socket.on("sendUserAndGrpName", (username, grpName, grpId) => {
    socket.nickname = username;
    console.log(`${socket.nickname} has joined ${grpName} with ${socketId}`);

    if (!grpNSP.adapter.rooms.get(grpId).connectedUsers) {
      grpNSP.adapter.rooms.get(grpId).connectedUsers = {};
    }
    grpNSP.adapter.rooms.get(grpId).connectedUsers[socketId] = username;
    console.log(`Connected users from ${grpName} 👇👇👇`);
    console.log(grpNSP.adapter.rooms.get(grpId).connectedUsers);

    grpNSP
      .to(grpId)
      .emit("users list", grpNSP.adapter.rooms.get(grpId).connectedUsers);

    socket.on("disconnect", () => {
      socket.to(grpId).emit("user left", socket.nickname);
      if (grpNSP.adapter.rooms.get(grpId)) {
        delete grpNSP.adapter.rooms.get(grpId).connectedUsers[socketId];
        console.log(
          `Remaining users`,
          grpNSP.adapter.rooms.get(grpId).connectedUsers
        );
        socket
          .to(grpId)
          .emit("users list", grpNSP.adapter.rooms.get(grpId).connectedUsers);
      } else {
        console.log(`Room ${grpName} has been deleted`);
      }
    });
  });

  socket.on("grp message", (msg, username, grpID) => {
    socket.to(grpID).emit("grp message", msg, username);
    console.log(msg, username, grpID);
  });

  socket.on("new user", (username, grpID) => {
    console.log(`${username} has joined the group`);
    socket.to(grpID).emit("new user", username);
  });

  //instead of broadcast we can use the 'to(grpID)' to emit it into the group
  socket.on("user typing", (username) => {
    socket.broadcast.emit("user typing", username);
  });
  socket.on("user not typing", (username) => {
    socket.broadcast.emit("user not typing", username);
  });
});

const port = 3001;
server.listen(port, () => console.log(`connected at post ${port}`));
