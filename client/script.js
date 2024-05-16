const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("grpMsgInput");
const form = document.getElementById("grpMsgForm");

socket.on("connect", () => {
  console.log(`connected with ${socket.id}`);
  socket.emit("checker", "Ikendu");

  form.onsubmit = (e) => {
    e.preventDefault();

    if (input.value) {
      const msg = input.value;
      socket.emit("group message", msg);
      input.value = "";
    }
  };

  socket.on("group message", (msg) => {
    alert(msg);
  });
});
