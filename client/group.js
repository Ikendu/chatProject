const socket = io("/privgroup");

const newConnection = (nickname, groupname) => {
  const newuser = document.getElementById("connectionStatus");
  newuser.innerText = `${nickname} welcome to ${groupname} private group 😎🤐`;
};

socket.on("connect", () => {
  console.log(`A new user connected with id ${socket.id}`);
  socket.emit("sendGroupId", grpID);

  //get user's name
  socket.nickname = prompt("Welcome, Please enter you name");

  //display users name with welcome message
  newConnection(socket.nickname, grpName);

  //send group name, group id and user name
  socket.emit("sendUserAndGrpName", socket.nickname, grpName, grpID);

  socket.emit("new user", socket.nickname, grpID);
  socket.on("new user", (username) => {
    alert(`${username} is now with us`);
  });

  socket.on("users list", (users) => {
    const connectedUsers = document.getElementById("connectedUsers");
    connectedUsers.innerHTML = "";
    for (const id in users) {
      const nickname = users[id];
      const user = document.createElement("li");
      user.innerText = nickname;
      connectedUsers.appendChild(user);
    }
  });

  //messaging function
  const messaging = (msgArea, name, msg) => {
    const item = document.createElement("li");
    item.textContent = `${name}: ${msg}`;
    msgArea.appendChild(item);

    window.scrollTo(0, document.body.scrollHeight);
  };

  const messages = document.getElementById("messages");
  const form = document.getElementById("grpMsgForm");
  const input = document.getElementById("grpMsgInput");

  form.onsubmit = (e) => {
    e.preventDefault();
    const msg = input.value;
    if (msg) {
      messaging(messages, "Me: ", msg);
      socket.emit("grp message", msg, socket.nickname, grpID);
      input.value = "";
    }
  };

  socket.on("grp message", (msg, username) => {
    messaging(messages, username, msg);
    console.log(msg, username);
  });

  input.oninput = () => {
    socket.emit("user typing", socket.nickname);
  };
  socket.on("user typing", (username) => {
    const typing = document.getElementById("typing");
    typing.innerText = `${username} is typing`;
  });

  input.onchange = () => {
    socket.emit("user not typing", socket.nickname);
  };
  socket.on("user not typing", () => {
    typing.innerText = "";
  });

  socket.on("user left", (nickname) => {
    alert(`${nickname} has left the group 🙋‍♀️👋🙋‍♂️`);
  });

  const leave = document.getElementById("leave");

  leave.onclick = () => {
    let answer = prompt(
      `${socket.nickname} are you sure you want to leave ${grpName} associate🤨 \n Reply with yes or no`
    );

    while (
      answer !== "yes" &&
      answer !== "Yes" &&
      answer !== "no" &&
      answer !== "No" &&
      answer !== "YES" &&
      answer !== "NO"
    ) {
      alert("invalid entry 🙈🙈 try again");

      answer = prompt(
        `${socket.nickname} are you sure you want to leave ${grpName} associate \n Reply with yes or no`
      );
    }
    if (answer === "yes" || answer === "Yes" || answer === "YES") {
      alert(
        `Good bye 👋👋${socket.nickname} you can join again using the group link `
      );
      socket.disconnect();
      window.location.href = "about:blank";
      window.top.close();
    } else if (answer === "no" || answer === "No" || answer === "NO") {
      alert(`You are still an associate of ${grpName}`);
    }
  };
});
