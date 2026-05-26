import { useState } from "react";
import axios from "../api/axios";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "/auth/login",
        {
          email,
          password
        },
        {
          withCredentials: true
        }
      );

      alert(res.data.message);

    } catch (error) {

      alert(
        error.response?.data?.message
      );
    }
  };

  return (

    <div className="h-screen flex items-center justify-center bg-[#111B21]">

      <form
        onSubmit={handleLogin}
        className="bg-[#202C33] p-8 rounded-xl w-[350px]"
      >

        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-[#2A3942] text-white outline-none"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-[#2A3942] text-white outline-none"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="w-full bg-[#00A884] text-white py-3 rounded font-semibold"
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default Login;