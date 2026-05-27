import { useState } from "react";

import axios from "../api/axios";
import socket from "../socket";

const ChatInput = ({
  selectedUser,
  setMessages
}) => {

  const [message, setMessage] =
    useState("");

  const sendMessage = async () => {

    if (
      !message.trim() ||
      !selectedUser
    ) return;

    try {

      // SEND TO BACKEND
      const res = await axios.post(
        "/messages/send",
        {
          receiverEmail:
            selectedUser.email,

          message: message
        }
      );

      // ADD MESSAGE TO UI
      setMessages((prev) => [
        ...prev,
        res.data.data
      ]);

      socket.emit(

  "send_message",

  res.data.data

);
      // CLEAR INPUT
      setMessage("");

    } catch (error) {

     console.log(
  "Send Message Error:",
  error.response?.data || error.message
);

alert(
  error.response?.data?.message || error.message
);
    }
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
        onChange={(e) =>
          setMessage(e.target.value)
        }

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