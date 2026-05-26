import { useState, useEffect } from "react";
import socket from "../socket";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";

const Home = () => {

  const [messages, setMessages] = useState([]);

  /*
 =====================================
        SOCKET CONNECTION
 =====================================
*/
  useEffect(() => {

    console.log("Frontend Connected");

    socket.on("connect", () => {

      console.log(
        "Socket Connected:",
        socket.id
      );

    });

    socket.on("receiveMessage", (data) => {

      console.log(
        "MESSAGE RECEIVED:",
        data
      );

      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
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
        <div className="flex-1 overflow-y-auto p-5">

          {messages.map((msg, index) => (

            <div
              key={index}
              className="bg-green-500 text-white p-3 rounded-lg mb-3 w-fit"
            >
              {msg.text}
            </div>

          ))}

        </div>

        {/* Input */}
        <ChatInput />

      </div>

    </div>

  );
};

export default Home;