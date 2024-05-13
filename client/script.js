const socket = io();
const usersTalkingPrivately = {};

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
const userTyping = () => {};

socket.on("connect", () => {
  //   console.log(`a client user with ${socket.id} connected`);
  socket.nickname = prompt("Enter your nickname", "Nicky");
  if (socket.nickname) {
    newConnection(socket.nickname);
    socket.emit("new user", socket.nickname);
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    if (input.value) {
      const msg = input.value;
      messaging(messages, "Me", msg);
      socket.emit("group message", socket.nickname, msg);
      input.value = "";
    }
  };

  socket.on("new user", (nickname, id) => {
    if (nickname) alert(`${nickname} has joined`);
    socket.otherId = id;
  });

  socket.on("group message", (nickname, msg) => {
    messaging(messages, nickname, msg);
  });

  socket.on("user left", (nickname) => {
    alert(`${nickname} has left the chat`);
  });

  input.oninput = () => {
    socket.emit("userTyping", socket.nickname);
  };
  socket.on("userTyping", (username) => {
    const typing = document.getElementById("typing");
    typing.innerText = `${username} is typing`;
  });
  input.onchange = () => {
    socket.emit("userNotTyping");
  };
  socket.on("userNotTyping", () => {
    const typing = document.getElementById("typing");
    typing.innerText = ``;
  });

  socket.on("allUsersList", (allUsers) => {
    const connectedUsers = document.getElementById("connectedUsers");
    connectedUsers.innerHTML = "";
    for (id in allUsers) {
      let user = document.createElement("li");
      user.innerText = allUsers[id];
      connectedUsers.appendChild(user);

      //private message component
      const sendMsgBtn = document.createElement("button");
      sendMsgBtn.innerText = "Private chat👩🏽‍🤝‍🧑🏾";
      const cantSendMsg = document.createElement("span");
      cantSendMsg.innerText = "Self✌";
      if (socket.id !== id) {
        connectedUsers.appendChild(sendMsgBtn);
      } else {
        connectedUsers.appendChild(cantSendMsg);
      }
      const privateMsgs = document.getElementById("privateMsgs");
      sendMsgBtn.onclick = () => {
        if (!usersTalkingPrivately[id]) {
          alert("private chat created");
          usersTalkingPrivately[id] = nickname;

          const privMsgArea = document.createElement("ul");
          privMsgArea.id = id;
          privMsgArea.classList.add("privMsg");

          const privHeading = document.createElement("h1");
          privHeading.innerText = `Message between you and ${nickname}`;


          const input = docment.createElement("input");

          const sendBtn = document.createElement("button");
          sendBtn.type = "submit";
          sendBtn.innerText = "Send";

          privMsgArea.appendChild(privHeading);
          privMsgArea.appendChild(input)
          
        } else {
          alert(`You are already chatting with ${nickname}`);
        }
      };
    }
  });

  //   socket.on("user disconnected", (id) => {
  //     alert(`${id} has disconnected`);
  //   });
});
