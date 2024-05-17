const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("grpMsgInput");
const form = document.getElementById("grpMsgForm");

socket.nickname = prompt("Enter you nickname");

const newConnection = (nickname) => {
  const newuser = document.getElementById("connectionStatus");
  newuser.innerText = `Welcome ${nickname}`;
};

//display message for all users
const messaging = (msgArea, name, msg) => {
  const item = document.createElement("li");
  item.textContent = `${name}: ${msg}`;
  msgArea.appendChild(item);

  window.scrollTo(0, document.body.scrollHeight);
};

//create socket.io connection
socket.on("connect", () => {
  console.log(`connected with ${socket.id}`);

  newConnection(socket.nickname);
  socket.emit("new user", socket.nickname);

  socket.on("new user", (user) => {
    alert(`${user} has has joined the chat`);
  });

  socket.on("users list", (listOfUsers) => {
    const connectedUsers = document.getElementById("connectedUsers");
    connectedUsers.innerHTML = "";
    for (const id in listOfUsers) {
      const nickname = listOfUsers[id];
      const user = document.createElement("li");
      user.innerText = nickname;
      connectedUsers.appendChild(user);
    }
  });

  const isTyping = document.getElementById("typing");
  input.oninput = () => {
    socket.emit("isTyping", socket.nickname);
  };

  socket.on("isTyping", (user) => {
    isTyping.innerText = `${user} is typing`;
  });

  input.onchange = () => {
    socket.emit("userNotType", socket.nickname);
  };
  socket.on("userNotType", () => {
    isTyping.innerText = "";
  });

  //send group message to serv
  form.onsubmit = (e) => {
    e.preventDefault();
    if (input.value) {
      const msg = input.value;
      socket.emit("group message", socket.nickname, msg);
      messaging(messages, "Me: ", msg);
      input.value = "";
    }
  };
  //display message for all users
  socket.on("group message", (nickname, msg) => {
    messaging(messages, nickname, msg);
  });

  socket.on("user disconnect", (userID, userName) => {
    alert(`${userName} with id ${userID} has disconnected`);
  });
});
