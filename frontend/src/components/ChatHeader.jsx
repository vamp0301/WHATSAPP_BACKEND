import {
  Phone,
  Video,
  MoreVertical
} from "lucide-react";

const ChatHeader = () => {

  return (

    <div className="bg-[#202C33] p-4 border-b border-gray-700 flex items-center justify-between">

      {/* Left */}

      <div className="flex items-center gap-4">

        <img
          src="https://i.pravatar.cc/150"
          alt="avatar"
          className="w-12 h-12 rounded-full"
        />

        <div>

          <h2 className="text-white font-semibold text-lg">

            Aman

          </h2>

          <p className="text-green-400 text-sm">

            Online

          </p>

        </div>

      </div>


      {/* Right Icons */}

      <div className="flex items-center gap-5 text-gray-300">

        <Phone
          className="cursor-pointer hover:text-white"
        />

        <Video
          className="cursor-pointer hover:text-white"
        />

        <MoreVertical
          className="cursor-pointer hover:text-white"
        />

      </div>

    </div>
  );
};

export default ChatHeader;