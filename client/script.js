const socket = io();
const usersTalkingPrivately = {};

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

      //display private message button
      const sendPrvMsg = document.createElement("button");
      sendPrvMsg.innerText = "Send Message";
      const yourSelf = document.createElement("span");
      yourSelf.innerText = "Yourself";
      if (id === socket.id) {
        connectedUsers.appendChild(yourSelf);
      } else {
        connectedUsers.appendChild(sendPrvMsg);
      }

      //create private chat
      const privateMsgs = document.getElementById("privateMsgs");
      sendPrvMsg.onclick = () => {
        if (!usersTalkingPrivately[id]) {
          usersTalkingPrivately[id] = nickname;

          //create mesg area
          const privMsgArea = document.createElement("ul");
          privMsgArea.id = id;
          privMsgArea.classList.add("privMsg");

          //create heading for each message
          const privHeading = document.createElement("h1");
          privHeading.innerText = `Mesages between you and ${nickname}`;

          //create input area
          const input = document.createElement("input");
          //create button
          const sendBtn = document.createElement("button");
          sendBtn.type = "submit";
          sendBtn.innerText = "Send";

          //append and build private message area
          privMsgArea.appendChild(privHeading);
          privMsgArea.appendChild(input);
          privMsgArea.appendChild(sendBtn);
          privateMsgs.appendChild(privMsgArea);

          sendBtn.onclick = (e) => {
            e.preventDefault();
            const msg = input.value;
            socket.emit("privateMsg", socket.id, id, socket.nickname, msg);
            messaging(privMsgArea, "Me", msg);
            input.value = "";
          };
        } else {
          alert(`Already connected with ${nickname}`);
        }
      };
    }
  });

  // recieving private chat
  socket.on("recMessage", (senderID, senderName, msg) => {
    if (!usersTalkingPrivately[senderID]) {
      usersTalkingPrivately[senderID] = senderName;

      //create msg area
      const privMsgArea = document.createElement("ul");
      privMsgArea.id = senderID;
      privMsgArea.classList.add("privMsg");

      //create input and send button
      const input = document.createElement("input");
      const sendBtn = document.createElement("button");
      sendBtn.type = "submit";
      sendBtn.innerText = "Send";

      //create header for the message
      const privHeading = document.createElement("h1");
      privHeading.innerText = `Message between you and ${senderName}`;

      //append and build the message area
      privMsgArea.appendChild(privHeading);
      privMsgArea.appendChild(input);
      privMsgArea.appendChild(sendBtn);
      privateMsgs.appendChild(privMsgArea);

      //display sender message
      messaging(privMsgArea, senderName, msg);

      //reply sender message
      sendBtn.onclick = (e) => {
        e.preventDefault();
        const msg = input.value;
        const msgArea = document.getElementById(senderID);
        messaging(msgArea, "Me", msg);
        socket.emit("privateMsg", socket.id, senderID, socket.nickname, msg);
        input.value = "";
      };
    } else {
      const mesgArea = document.getElementById(senderID);
      messaging(mesgArea, senderName, msg);
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
