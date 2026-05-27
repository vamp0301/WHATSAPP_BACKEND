import {
  Phone,
  Video,
  MoreVertical
} from "lucide-react";

const ChatHeader = ({
  selectedUser
}) => {

  return (

    <div className="bg-[#202C33] p-4 border-b border-gray-700 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <img
          src={
            selectedUser?.avatar ||
            "https://i.pravatar.cc/150"
          }
          alt="avatar"
          className="w-12 h-12 rounded-full"
        />

        <div>

          <h2 className="text-white font-semibold text-lg">

            {
              selectedUser?.name ||
              "Select User"
            }

          </h2>

          <p className="text-green-400 text-sm">

            {
              selectedUser?.isOnline
                ? "Online"
                : "Offline"
            }

          </p>

        </div>

      </div>

      {/* RIGHT ICONS */}
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