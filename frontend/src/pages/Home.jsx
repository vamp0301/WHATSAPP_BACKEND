import { useEffect, useState } from "react";
import socket from "../socket";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";

const Home = () => {

  const [messages, setMessages] = useState([]);

  /*
   =====================================
          RECEIVE MESSAGE
   =====================================
  */
  useEffect(() => {

    socket.on("receiveMessage", (data) => {

      console.log("Received:", data);

      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          own: true,
        },
      ]);

    });

    return () => {

      socket.off("receiveMessage");

    };

  }, []);

  return (

    <div className="h-screen bg-[#111B21] flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0B141A]">

        {/* Header */}
        <ChatHeader />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">

          {messages.map((msg, index) => (

            <MessageBubble
              key={index}
              own={msg.own}
              text={msg.text}
            />

          ))}

        </div>

        {/* Input */}
        <ChatInput />

      </div>

    </div>

  );
};

export default Home;