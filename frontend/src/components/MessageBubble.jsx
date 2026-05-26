const MessageBubble = ({ own, text }) => {

  return (

    <div
      className={`w-full flex mb-4 ${
        own ? "justify-end" : "justify-start"
      }`}
    >

      <div
        className={`
          max-w-[300px]
          px-4
          py-2
          rounded-2xl
          text-white
          text-sm
          shadow-md
          ${
            own
              ? "bg-[#005c4b]"
              : "bg-[#202c33]"
          }
        `}
      >

        {text}

      </div>

    </div>
  );
};

export default MessageBubble;