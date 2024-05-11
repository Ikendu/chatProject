const socket = io();

const message = document.getElementById("messages");
const form = document.getElementById("grpMsgForm");
const input = document.getElementById("grpMsgInput");

form.onsubmit = (e) => {
  e.preventDefault();
  if (input.value) {
    const msg = input.value;
    socket.emit("group message", msg);
    input.value = "";
  }
};

const messaging = (message, msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  message.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
};
const newConnection = (nickname) => {
  const user = document.getElementById("newUserConnection");
  user.innerText = `Welcome ${nickname}`;
  //   alert(`A new user ${nickname} has joined the group`);
};

socket.on("connect", () => {
  //   console.log(`a client user with ${socket.id} connected`);
  socket.nickname = prompt("Enter your nickname", "Nicky");
  newConnection(socket.nickname);
  socket.emit("new user", socket.nickname);

  socket.on("new user", (nickname) => {
    alert(`${nickname} has joined`);
  });

  socket.on("group message", (msg) => {
    messaging(message, msg);
  });

  socket.on("user disconnected", (id) => {
    alert(`User with ${id} has disconnected`);
  });
});
