import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

import {
  FaGoogle,
  FaWhatsapp,
} from "react-icons/fa";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await axios.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    } finally {

      setLoading(false);
    }
  };

  const googleLogin = () => {

    window.location.href =
      "http://localhost:3020/api/auth/google";
  };

  return (

    <div className="h-screen flex items-center justify-center bg-[#111B21] px-4">

      <div className="bg-[#202C33] w-full max-w-md rounded-2xl p-8 shadow-2xl">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">

          <FaWhatsapp className="text-[#00A884] text-6xl mb-3" />

          <h1 className="text-white text-4xl font-bold">
            WhatsApp
          </h1>

        </div>

        {/* LOGIN FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-[#2A3942] text-white p-4 rounded-xl outline-none"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-[#2A3942] text-white p-4 rounded-xl outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A884] text-white py-4 rounded-xl font-semibold"
          >
            {
              loading
                ? "Logging in..."
                : "Login"
            }
          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">

          <div className="flex-1 h-[1px] bg-gray-600"></div>

          <span className="text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-[1px] bg-gray-600"></div>

        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={googleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-semibold"
        >
          <FaGoogle />

          Continue with Google
        </button>

        {/* OTP LOGIN */}
        <Link to="/otp-login">

          <button className="w-full mt-4 border border-[#00A884] text-[#00A884] py-4 rounded-xl font-semibold">

            Login with OTP

          </button>

        </Link>

        {/* SIGNUP */}
        <p className="text-gray-400 text-center mt-6 text-sm">

          Don't have an account?

          <Link
            to="/signup"
            className="text-[#00A884] ml-2"
          >
            Signup
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;