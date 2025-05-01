import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";

function Chatt({ chats, receiverId, onClose }) {
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
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));
      e.target.reset();

      socket.emit("sendMessage", {
        receiverId: chat?.receiver?.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
          read();
        }
      });
    }

    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);
  console.log("receiverId in Chat:", receiverId);

  return (
    <div>
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

export default Chatt;
