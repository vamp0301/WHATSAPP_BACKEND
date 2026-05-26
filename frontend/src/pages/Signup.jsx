import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Signup = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "/auth/signup",
        {
          name,
          email,
          password
        }
      );

      alert(res.data.message);

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message
      );
    }
  };

  return (

    <div className="h-screen bg-[#111B21] flex justify-center items-center">

      <form
        onSubmit={handleSignup}
        className="bg-[#202C33] p-8 rounded-2xl w-[400px] shadow-2xl"
      >

        <h1 className="text-white text-4xl font-bold text-center mb-8">

          WhatsApp Signup

        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full p-4 mb-4 rounded-lg bg-[#2A3942] text-white outline-none"
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-4 mb-4 rounded-lg bg-[#2A3942] text-white outline-none"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 mb-6 rounded-lg bg-[#2A3942] text-white outline-none"
        />

        <button
          type="submit"
          className="w-full bg-[#00A884] hover:bg-[#06cf9c] transition-all text-white py-4 rounded-lg font-bold text-lg"
        >

          Signup

        </button>

      </form>

    </div>
  );
};

export default Signup;