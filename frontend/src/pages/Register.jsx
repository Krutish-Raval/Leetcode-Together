import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import VerifyOtp from '../components/VerifyOtp';
import { otpSend } from '../services/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      await otpSend({ email });
      setOtp(true); // Move to OTP verification
      toast.success('OTP sent! Please check your email.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const goBackToRegister = () => {
    setOtp(false); // Return to register form
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <ToastContainer />
      <div className="bg-[#1e1e1e] py-4 px-8 flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">
          <span className="text-yellow-500">&lt;/&gt;</span> LeetCode Together
        </h1>
      </div>

      <div className="flex justify-center items-center m-10">
        <button className="text-yellow-500 flex items-center" onClick={() => (otp ? goBackToRegister() : navigate('/'))}>
          <FaArrowLeft className="mr-2" /> {otp ? 'Back to Register' : 'Back to Home'}
        </button>
      </div>

      {!otp ? (
        <div className="flex justify-center items-center">
          <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold mb-6 text-white">Welcome</h1>
            <p className="text-gray-400 mb-8">Sign up to your LeetCode Together account</p>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 mb-4 bg-[#2e2e2e] border border-gray-600 rounded-lg text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 bg-[#2e2e2e] border border-gray-600 rounded-lg text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 mb-4 bg-[#2e2e2e] border border-gray-600 rounded-lg text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full p-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600"
              onClick={handleRegister}
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : (
        <VerifyOtp email={email} password={password} confirmPassword={confirmPassword} goBack={goBackToRegister} />
      )}
    </div>
  );
};

export default Register;
