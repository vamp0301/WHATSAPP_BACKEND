import { useEffect, useState } from "react";

import axios from "../api/axios";

const Sidebar = ({
  setSelectedUser
}) => {

  // REAL USERS STATE
  const [users, setUsers] = useState([]);

  // FETCH USERS
  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const res = await axios.get(
          "/users"
        );

        console.log(res.data);

        // SAVE USERS
        setUsers(res.data.users);

      } catch (error) {

        console.log(
          "Fetch Users Error:",
          error
        );

      }
    };

    fetchUsers();

  }, []);

  return (

    <div className="w-[30%] bg-[#202C33] border-r border-gray-700 flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-700">

        <h1 className="text-white text-3xl font-bold">
          WhatsApp
        </h1>

      </div>

      {/* Search */}
      <div className="p-3">

        <input
          type="text"
          placeholder="Search or start new chat"
          className="w-full bg-[#2A3942] text-white p-3 rounded-lg outline-none"
        />

      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto">

        {users.map((user) => (

          <div

  key={user._id}

  onClick={() =>

    setSelectedUser(user)

  }

  className="flex items-center gap-4 p-4 hover:bg-[#2A3942] cursor-pointer transition-all"

>

            {/* Avatar */}
            <div className="relative">

              <img
                src={
                  user.avatar ||
                  "https://i.pravatar.cc/150"
                }
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />

              {
                user.isOnline && (

                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#202C33]"></div>

                )
              }

            </div>

            {/* User Info */}
            <div>

              <h2 className="text-white font-semibold">

                {user.name || "User"}

              </h2>

              <p className="text-sm text-gray-400">

                {user.email}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Sidebar;