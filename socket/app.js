import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173", // or your deployed frontend
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Register user
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Online users:", onlineUser);
  });

  // Message send and broadcast to both users
  socket.on("sendMessage", ({ receiverId, senderId, chatId, data }) => {
    const receiver = getUser(receiverId);
    const sender = getUser(senderId);

    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", { ...data, chatId });
    }

    if (sender) {
      io.to(sender.socketId).emit("getMessage", { ...data, chatId });
    }
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    removeUser(socket.id);
  });
});

io.listen(4000);
console.log("Socket.io server is running on port 4000");
