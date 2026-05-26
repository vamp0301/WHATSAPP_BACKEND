import { useState } from "react";
import socket from "../socket";

const ChatInput = () => {

  const [message, setMessage] = useState("");

  const sendMessage = () => {

    if (message.trim() === "") return;

    // SEND MESSAGE TO BACKEND
    socket.emit("sendMessage", {

      receiverId: "TEMP_USER_ID",

      message: message,

    });

    // CLEAR INPUT
    setMessage("");

  };

  return (

    <div className="p-4 bg-[#202C33] flex items-center gap-3">

      {/* Emoji */}
      <button className="text-2xl text-gray-400">
        😊
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {

          if (e.key === "Enter") {

            sendMessage();

          }

        }}
        className="flex-1 bg-[#2A3942] text-white px-4 py-3 rounded-full outline-none"
      />

      {/* Send Button */}
      <button
        onClick={sendMessage}
        className="bg-[#00A884] p-3 rounded-full text-white"
      >
        ➤
      </button>

    </div>

  );
};

export default ChatInput;