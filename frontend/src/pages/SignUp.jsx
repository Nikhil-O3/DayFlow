import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

function SignUp() {
  const [show, setshow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Role-1");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
  try {
    setLoading(true);

    const result = await axios.post(
      `${serverUrl}/api/auth/signup`,
      { name, email, password, role },
      { withCredentials: true }
    );

    setLoading(false);

    toast.success("Signup successful");
    navigate("/"); // ✅ THIS was missing
  } catch (error) {
    setLoading(false);
    toast.error(
      error?.response?.data?.message ||
        error.message ||
        "Something went wrong"
    );
  }
};


  const handleGoogleSignup = () => {
    try {
      window.location.href = `${serverUrl}/api/auth/google`;
      navigate("/");

      toast.success("sign up successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[#dddbdd] w-[100vw] h-[100vh] flex items-center justify-center ">
        <form
          className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* left div */}
          <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3">
            <div>
              <h1 className="font-semibold text-[black] text-2xl">
                let's Get Started
              </h1>
              <h2 className="text-[#999797] text-[18px]">
                {" "}
                Create Your Account
              </h2>
            </div>

            <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
                placeholder="Enter Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </div>

            <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
              <label htmlFor="Email" className="font-semibold">
                Email
              </label>
              <input
                id="Email"
                type="email"
                className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
                placeholder="Enter Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>

            <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <input
                id="password"
                type={show ? "text" : "password"}
                className="border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]"
                placeholder="Enter Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
              {show ? (
                <IoEye
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[15%]"
                  onClick={() => {
                    setshow((prev) => !prev);
                  }}
                />
              ) : (
                <IoEyeOff
                  className="absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[15%]"
                  onClick={() => {
                    setshow((prev) => !prev);
                  }}
                />
              )}
            </div>

            <div className="flex md:w-[50%] w-[70%] items-center justify-between">
              <span
                className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${
                  role === "Role-1" ? "border-black" : "border-[#646464]"
                }`}
                onClick={() => {
                  setRole("Role-1");
                }}
              >
                Role-1
              </span>
              <span
                className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${
                  role === "Role-2" ? "border-black" : "border-[#646464]"
                }`}
                onClick={() => {
                  setRole("Role-2");
                }}
              >
                Role-2
              </span>
            </div>

            <button
              className="w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
            </button>

            <div className="w-[80%] flex items-center gap-2">
              <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
              <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center">
                Or Continue with
              </div>
              <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
            </div>
            <div
              className="w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-gray-100"
              onClick={handleGoogleSignup}
            >
              <img src={google} alt="google" className="w-[30px] -mr-1" />
              <span className="text-[18px] text-gray-500">oogle</span>
            </div>

            <button className="text-[#6f6f6f] ">
              {" "}
              Already have an Account ?
              <span
                className="underline underline-offset-1 text-[black]"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </span>
            </button>
          </div>

          {/* right div */}
          <div className="w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden">
            <img src={logo} alt="logo" className="w-50 shadow-2xl" />
            <span className="text-2xl text-white m-5 mb-4">PROJECT NAME </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
