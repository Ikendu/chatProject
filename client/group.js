const socket = io("/privgroup");

socket.on("connect", () => {
  console.log(`A new user connected with id ${socket.id}`);
});
