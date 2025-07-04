import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";

function Chat({ chats, receiverId, onClose }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id) => {
    try {
      const res = await apiRequest("/chats/" + id);

      // Correctly find the receiver from the users array
      const receiver = res.data.users.find(
        (u) => u.userId !== currentUser.id
      )?.user;

      setChat({ ...res.data, receiver });

      console.log("Chat data from backend:", res.data);
      console.log("Receiver found:", receiver);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchOrCreateChat = async () => {
      if (!receiverId) return;

      try {
        const res = await apiRequest.post("/chats", { receiverId });

        // Set the correct receiver (not the currentUser)
        const receiver = res.data.users?.find(
          (u) => u.userId !== currentUser.id
        )?.user;

        // Debugging the receiver
        console.log("Receiver from fetchOrCreateChat:", receiver);

        setChat({
          ...res.data,
          receiver, // Set the receiver correctly
        });
      } catch (err) {
        console.log("Error fetching or creating chat:", err);
      }
    };

    fetchOrCreateChat();
  }, [receiverId, currentUser.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      e.target.reset();

      // Send message via socket to both sender and receiver
      socket.emit("sendMessage", {
        receiverId: chat?.receiver?.id,
        senderId: currentUser.id,
        chatId: chat.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (socket && currentUser?.id) {
      socket.emit("newUser", currentUser.id); // match socket code
    }
  }, [socket, currentUser?.id]);

  useEffect(() => {
    if (!chat || !socket) return;

    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    const handleMessage = (data) => {
      if (chat.id === data.chatId) {
        setChat((prev) => {
          const exists = prev.messages.some((m) => m.id === data.id);
          if (exists) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data],
          };
        });

        read();
      }
    };

    socket.on("getMessage", handleMessage);

    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, [socket, chat]);

  console.log("receiverId in Chat:", receiverId);

  // Sort chats here, outside JSX
  const sortedChats = [...chats].sort((a, b) => {
    const aTime = a.messages?.length
      ? new Date(a.messages[a.messages.length - 1]?.createdAt)
      : 0;
    const bTime = b.messages?.length
      ? new Date(b.messages[b.messages.length - 1]?.createdAt)
      : 0;
    return bTime - aTime;
  });

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {[...chats].reverse().map((c) => {
          const isDeleted = !c.receiver;
          const isAdmin = c.receiver?.role === "admin";

          return (
            <div
              className={`message ${isDeleted ? "disabled" : ""}`}
              key={c.id}
              onClick={!isDeleted ? () => handleOpenChat(c.id) : undefined}
              style={{ cursor: isDeleted ? "default" : "pointer" }}
            >
              <img src={c.receiver?.avatar || "/noavatar.jpg"} alt="avatar" />
              <span>
                {c.receiver?.username || "deleted user"}
                {isAdmin && (
                  <span className="adminTag" style={{ color: "red" }}>
                    {" "}
                    [Admin]
                  </span>
                )}
              </span>
              <p>{c.lastMessage || "No message yet"}</p>
            </div>
          );
        })}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="avatar" />
              {chat.receiver.username || "Unknown"}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>

          <div className="center">
            {chat.messages?.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type a message..." />
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
