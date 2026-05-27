import { useState, useEffect } from "react";

import axios from "../api/axios";
import socket from "../socket";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";

const Home = () => {

  // SELECTED USER
  const [selectedUser, setSelectedUser] =
    useState(null);

  // ALL CHAT MESSAGES
  const [messages, setMessages] =
    useState([]);

  // =========================================
  // FETCH OLD CONVERSATION
  // =========================================
  useEffect(() => {

    const fetchMessages = async () => {

      // IF NO USER SELECTED
      if (!selectedUser) return;

      try {

        const res = await axios.get(
          `/messages/conversation/${selectedUser.email}`
        );

        setMessages(res.data.messages);

      } catch (error) {

        console.log(
          "Conversation Error:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchMessages();

  }, [selectedUser]);

  // =========================================
  // REAL-TIME SOCKET MESSAGE LISTENER
  // =========================================
  useEffect(() => {

    socket.on(
      "receive_message",
      (newMessage) => {

        setMessages((prev) => [
          ...prev,
          newMessage
        ]);
      }
    );

    return () => {

      socket.off("receive_message");

    };

  }, []);

  return (

    <div className="h-screen bg-[#111B21] flex">

      {/* SIDEBAR */}
      <Sidebar
        setSelectedUser={setSelectedUser}
      />

      {/* CHAT SECTION */}
      <div className="flex-1 flex flex-col bg-[#0B141A]">

        {/* HEADER */}
        <ChatHeader
          selectedUser={selectedUser}
        />

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-5">

          {
            messages.length > 0 ? (

              messages.map((msg) => (

                <MessageBubble
                  key={msg._id}

                  // MESSAGE TEXT
                  text={msg.message}

                  // OWN MESSAGE CHECK
                  own={
                    msg.sender?.email !==
                    selectedUser?.email
                  }
                />

              ))

            ) : (

              <div className="h-full flex items-center justify-center text-gray-500">

                No messages yet

              </div>
            )
          }

        </div>

        {/* CHAT INPUT */}
        <ChatInput
          selectedUser={selectedUser}
          messages={messages}
          setMessages={setMessages}
        />

      </div>

    </div>
  );
};

export default Home;