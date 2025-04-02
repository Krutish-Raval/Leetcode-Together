import React, { useRef, useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyOtp from "../components/VerifyOtp.jsx";
import { otpSend } from "../services/api_user.js";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.dismiss(); // Remove any existing toast

      toast.error("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      await otpSend({ email: formData.email });
      setOtp(true);
      toast.dismiss();
      toast.success("OTP sent! Please check your email.");
    } catch (error) {
      toast.dismiss(); // Remove any existing toast
      if (error !== "Login from this ID") {
        toast.error(
          error?.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      } else {
        toast.error("User already exists. Please Login");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBackToRegister = () => {
    setOtp(false);
  };

  const togglePasswordVisibility = (field) => {
    field === "password"
      ? setShowPassword((prev) => !prev)
      : setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
        limit={1}
      />

      {/* Header Section with Login Button */}
      <div className="bg-[#1e1e1e] py-4 px-8 flex items-center justify-between ">
        <h1 className="text-white text-2xl font-bold">
          <span className="text-yellow-500">&lt;/&gt;</span> LeetCode Together
        </h1>
        <button
          className="bg-[#ffa116] text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      {!otp ? (
        <div className="flex justify-center items-center m-25">
          <form
            className="bg-[#1e1e1e] p-8 rounded-lg shadow-lg max-w-md w-full"
            onSubmit={handleRegister}
          >
            {/* Back to Home Button */}
            <div className="mb-4">
              <button
                className="flex items-center text-yellow-500 hover:text-yellow-400 transition-all cursor-pointer"
                onClick={() => navigate("/")}
                type="button"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </button>
            </div>

            <h1 className="mx-auto w-fit text-3xl font-bold mb-4 text-white">
              Create Your Account
            </h1>
            <p className="mx-auto w-fit text-gray-200 mb-6 ">
              Join Leetcode Together
            </p>

            {/* Email Input */}
            <input
              type="email"
              name="email"
              ref={emailRef}
              placeholder="you@example.com"
              className="w-full p-3 mb-4 bg-[#2e2e2e] border border-gray-600 rounded-lg text-white"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  passwordRef.current?.focus();
                }
              }}
              required
            />

            {/* Password Input with Visibility Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                ref={passwordRef}
                placeholder="Password"
                className="w-full p-3 mb-4 bg-[#2e2e2e] border border-gray-600 rounded-lg text-white pr-10"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmPasswordRef.current?.focus();
                  }
                }}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-4 text-gray-400 cursor-pointer"
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password with Visibility Toggle */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                ref={confirmPasswordRef}
                placeholder="Confirm Password"
                className="w-full p-3 mb-4 bg-[#2e2e2e] border border-gray-600 rounded-lg text-white pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRegister(e);
                  }
                }}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-4 text-gray-400 cursor-pointer"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Sign-Up Button with Loading Effect */}
            <button
              className={`w-full p-3 ${
                loading ? "bg-yellow-400" : "bg-[#ffa116]"
              } text-black font-bold rounded-lg hover:bg-yellow-600 cursor-pointer`}
              disabled={loading}
            >
              {/*disabled is used to prevent duplicate submission*/}
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-black"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Sending OTP...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      ) : (
        <VerifyOtp
          email={formData.email}
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          goBack={goBackToRegister}
        />
      )}
    </div>
  );
};

export default Register;
