import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { registerUser, otpSend } from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const VerifyOtp = ({ email, password, confirmPassword, goBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      await registerUser({ email, password, confirmPassword, otp: enteredOtp });
      toast.success('Registration and OTP Verification Successful! You can now log in.');
      navigate("/login")
    } catch (err) {
      toast.error('OTP Verification Failed. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      await otpSend({ email });
      toast.info('OTP Resent Successfully!');
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* Back to Register Button */}
        <button className="text-yellow-500 flex items-center mb-4" onClick={goBack}>
          <FaArrowLeft className="mr-2" /> Back to Register
        </button>

        <h1 className="text-3xl font-bold mb-6 text-white">Verify OTP</h1>
        <p className="text-gray-400 mb-8">Enter the 6-digit code sent to your email: {email}</p>

        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl bg-[#2e2e2e] border border-gray-600 rounded-lg text-white"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        <button
          className="w-full p-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 mb-4"
          onClick={handleVerifyOtp}     
        >
          Verify OTP
        </button>
        <p className="text-gray-400">
          Didn't receive the OTP?{' '}
          <span className="text-yellow-500 cursor-pointer" onClick={handleResendOtp}>
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
