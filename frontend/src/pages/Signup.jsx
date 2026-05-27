import { useState } from "react";

import axios from "../api/axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.message
      );
    }
  };

  return (

    <div className="h-screen flex items-center justify-center bg-[#111B21] px-4">

      <form
        onSubmit={handleSignup}
        className="bg-[#202C33] w-full max-w-md rounded-2xl p-8"
      >

        <h1 className="text-white text-4xl font-bold text-center mb-8">

          Signup

        </h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full bg-[#2A3942] text-white p-4 rounded-xl mb-4 outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full bg-[#2A3942] text-white p-4 rounded-xl mb-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-[#2A3942] text-white p-4 rounded-xl mb-6 outline-none"
        />

        <button className="w-full bg-[#00A884] text-white py-4 rounded-xl font-semibold">

          Create Account

        </button>

        <p className="text-center text-gray-400 mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-[#00A884] ml-2"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Signup;