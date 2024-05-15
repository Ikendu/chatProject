const socket = io();

socket.on("connect", () => {
  console.log(`connected with ${socket.id}`);
  socket.emit("checker", "Ikendu");
});
