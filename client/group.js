const socket = io("/privgroup");

const username = prompt("Welcome, Please enter you name");

const input = document.getElementById("grpMsgInput");

//show when a user is typing
input.oninput = (e) => {
  socket.emit("is typing", username);
};
socket.on("is typing", (username) => {
  const typing = document.getElementById("typing");
  typing.innerText = `${username} is typing`;
});

//show when a user is not typing
input.onchange = () => {
  socket.emit("not typing", username);
};
socket.on("not typing", (username) => {
  const typing = document.getElementById("typing");
  typing.innerText = ``;
});

socket.on("connect", () => {
  console.log(`A new user connected with id ${socket.id}`);

  socket.emit("new user", username);
  socket.on("new user", (username) => {
    alert(`${username} is now with us`);
  });
});
