import { useRef, useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../services/api_user.js";
import { login } from "../store/authSlice.js";
const Login = () => {
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData,[e.target.name]: e.target.value });
  };
  // That logic allows all inputs (text, email, checkbox) to be handled by a single generic function
  // Without it, we'd need separate handlers like:
  // const handleEmail = (e) => setFormData({ ...formData, email: e.target.value });
  // const handleRemember = (e) => setFormData({ ...formData, remember: e.target.checked });
  // Too much repetition. The generic approach = DRY, clean, scalable.
  // ...to preserve existing state
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
        <Link
          className="bg-yellow-500 text-black px-6 py-2 rounded-sm hover:bg-yellow-600 transition-all cursor-pointer"
          to="/register"
        >
          Register
        </Link>
      </div>
      <div className="flex items-center justify-center m-20 bg-[#0e0e10]">
        <div className="w-full max-w-sm p-6 bg-[#222222] rounded-lg shadow-lg border border-[#333]">
          <div className="mb-4">
            <Link
              className="flex items-center text-yellow-500 hover:text-yellow-400 transition-all cursor-pointer"
              to="/"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center text-white">
            Welcome back
          </h2>
          <p className="text-sm text-center text-gray-400 mb-6">
            Log in to your LeetCode account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                ref={emailRef}
                type="email"
                autoComplete="current-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-white bg-[#2b2b2b] border border-[#444] rounded focus:outline-none focus:ring-2 focus:ring-[#ffa116]"
                required
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === "NumpadEnter" ||
                    e.key === "ArrowDown"
                  ) {
                    e.preventDefault();
                    passwordRef.current.focus();
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-white bg-[#2b2b2b] border border-[#444] rounded focus:outline-none focus:ring-2 focus:ring-[#ffa116]"
                  required
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "NumpadEnter") {
                      e.preventDefault();
                      handleSubmit(e); 
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      emailRef.current.focus();
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      document.querySelector("button[type='submit']").focus();
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

            <button
              type="submit"
              className="w-full py-2 text-white bg-[#ffa116] rounded hover:bg-[#ff8c00] cursor-pointer"
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  passwordRef.current?.focus();
                }
              }}
            >
              Log In
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#ffa116] hover:underline cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
