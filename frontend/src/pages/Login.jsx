import React, { useRef, useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../services/api_user.js";
import { login } from "../store/authSlice.js";
const Login = () => {
  const navigate = useNavigate();
  const passwordRef = useRef(null); // Reference to password input field
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email: formData.email, password: formData.password });
      toast.dismiss();
      toast.success("Logged In successful");
      dispatch(login({ email: formData.email }));
      navigate("/home");
    } catch (error) {
      toast.dismiss();
      toast.error("Enter correct details");
    }
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
      <div className="bg-[#1e1e1e] py-4 px-8 flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">
          <span className="text-yellow-500">&lt;/&gt;</span> LeetCode Together
        </h1>
        <button
          className="bg-yellow-500 text-black px-6 py-2 rounded-sm hover:bg-yellow-600 transition-all cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
      <div className="flex items-center justify-center m-20 bg-[#0e0e10]">
        <div className="w-full max-w-sm p-6 bg-[#222222] rounded-lg shadow-lg border border-[#333]">
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
          <h2 className="text-2xl font-bold text-center text-white">
            Welcome back
          </h2>
          <p className="text-sm text-center text-gray-400 mb-6">
            Log in to your LeetCode account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-white bg-[#2b2b2b] border border-[#444] rounded focus:outline-none focus:ring-2 focus:ring-[#ffa116]"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current?.focus(); // Move to password input
                  }
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-white bg-[#2b2b2b] border border-[#444] rounded focus:outline-none focus:ring-2 focus:ring-[#ffa116]"
                  required
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(e); // Submit form
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button className="text-m text-[#ffa116] hover:underline float-right m-2">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-2 text-white bg-[#ffa116] rounded hover:bg-[#ff8c00] cursor-pointer"
            >
              Log In
            </button>
          </form>

          {/* Footer */}
          <p className="mt-4 text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-[#ffa116] hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
