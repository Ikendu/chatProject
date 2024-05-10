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

socket.on("connect", () => {
  console.log(`a client user with ${socket.id} connected`);
  socket.on("new user", (id) => {
    alert(`A new user with id ${id} has joined`);
  });

  socket.on("group message", (msg) => {
    messaging(message, msg);
  });

  socket.on("user disconnected", (id) => {
    alert(`User with ${id} has disconnected`);
  });
});
