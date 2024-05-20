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