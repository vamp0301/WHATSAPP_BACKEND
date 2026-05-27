import { useState } from "react";

import axios from "../api/axios";

import { useNavigate } from "react-router-dom";

const OtpLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);

  const sendOtp = async () => {

    try {

      await axios.post(
        "/auth/send-otp",
        { email }
      );

      alert("OTP sent");

      setStep(2);

    } catch (error) {

      alert(
        error.response?.data?.message
      );
    }
  };

  const verifyOtp = async () => {

    try {

      const res = await axios.post(
        "/auth/verify-otp",
        {
          email,
          otp,
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

      <div className="bg-[#202C33] w-full max-w-md rounded-2xl p-8">

        <h1 className="text-white text-3xl font-bold text-center mb-8">

          OTP Login

        </h1>

        {
          step === 1 ? (

            <>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-[#2A3942] text-white p-4 rounded-xl outline-none"
              />

              <button
                onClick={sendOtp}
                className="w-full mt-4 bg-[#00A884] text-white py-4 rounded-xl font-semibold"
              >
                Send OTP
              </button>

            </>

          ) : (

            <>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                className="w-full bg-[#2A3942] text-white p-4 rounded-xl outline-none"
              />

              <button
                onClick={verifyOtp}
                className="w-full mt-4 bg-[#00A884] text-white py-4 rounded-xl font-semibold"
              >
                Verify OTP
              </button>

            </>

          )
        }

      </div>

    </div>
  );
};

export default OtpLogin;