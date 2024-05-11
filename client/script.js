const socket = io();

const messages = document.getElementById("messages");
const form = document.getElementById("grpMsgForm");
const input = document.getElementById("grpMsgInput");

const messaging = (message, nickname, msg) => {
  const item = document.createElement("li");
  item.textContent = `${nickname}: ${msg}`;
  message.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
};
const newConnection = (nickname) => {
  const user = document.getElementById("connectionStatus");
  user.innerText = `Hello ${nickname}, you are welcome`;
  //   alert(`A new user ${nickname} has joined the group`);
};

socket.on("connect", () => {
  //   console.log(`a client user with ${socket.id} connected`);
  socket.nickname = prompt("Enter your nickname", "Nicky");
  newConnection(socket.nickname);
  socket.emit("new user", socket.nickname);

  form.onsubmit = (e) => {
    e.preventDefault();
    if (input.value) {
      const msg = input.value;
      socket.emit("group message", socket.nickname, msg);
      input.value = "";
    }
  };

  socket.on("new user", (nickname) => {
    if (nickname) alert(`${nickname} has joined`);
  });

  socket.on("group message", (nickname, msg) => {
    messaging(messages, nickname, msg);
  });

  socket.on("user left", (nickname) => {
    alert(`${nickname} has left the chat`);
  });

  //   socket.on("user disconnected", (id) => {
  //     alert(`${id} has disconnected`);
  //   });
});
