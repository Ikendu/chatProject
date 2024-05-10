const socket = io();
socket.on("connect", () => {
  console.log(`a client user with ${socket.id} connected`);
});
