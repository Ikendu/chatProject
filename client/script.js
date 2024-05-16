const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("grpMsgInput");
const form = document.getElementById("grpMsgForm");

//display message for all users
const messaging = (msgArea, msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  msgArea.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
};

//create socket.io connection
socket.on("connect", () => {
  console.log(`connected with ${socket.id}`);
  socket.on("new user", (user) => {
    alert(`A new user connected with ${user}`);
  });

  //send group message to server
  form.onsubmit = (e) => {
    e.preventDefault();
    if (input.value) {
      const msg = input.value;
      socket.emit("group message", msg);
      input.value = "";
    }
  };
  //display message for all users
  socket.on("group message", (msg) => {
    messaging(messages, msg);
  });

  socket.on("user disconnect", (user) => {
    alert(`A user with id ${user} has disconnected`);
  });
});
