const socket = io("/privgroup");

const username = prompt("Welcome, Please enter you name");

const input = document.getElementById("grpMsgInput");
input.oninput = (e) => {
    socket.emit('is typing', username)
}



socket.on("connect", () => {
  console.log(`A new user connected with id ${socket.id}`);

  socket.emit("new user", username);
  socket.on("new user", (username) => {
    alert(`${username} is now with us`);
  });
});
