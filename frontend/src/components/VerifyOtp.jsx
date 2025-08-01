import React, { useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { otpSend, registerUser } from '../services/api_user.js';

const VerifyOtp = ({ email, password, confirmPassword, goBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
        handleVerifyOtp(); 
      } else if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
    toast.dismiss(); 
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ email, password, confirmPassword, otp: enteredOtp });
      toast.dismiss(); 
      toast.success('Registration and OTP Verification Successful! You can now log in.');
      navigate("/login");
    } catch (err) {
        if(err==="User already exists"){
            toast.dismiss(); 
            toast.error('User already exists. Login or enter different email ID');
        }
        else{
            toast.dismiss(); 
            toast.error('OTP Verification Failed. Please try again.');
        }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await otpSend({ email });
      toast.dismiss(); // Remove any existing toast

      toast.info('OTP Resent Successfully!');
    } catch (err) {
        toast.dismiss(); // Remove any existing toast

      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0e0e10] text-white">
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
      <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* Back Button */}
        <button 
          className="text-yellow-500 flex items-center cursor-pointer mb-4" 
          onClick={goBack}
        >
          <FaArrowLeft className="mr-2" /> Back to Registration
        </button>

        {/* OTP Section */}
        <h1 className="text-3xl font-bold mb-6">Verify OTP</h1>
        <p className="text-gray-400 mb-8">Enter the 6-digit code sent to your email: <span className="font-semibold">{email}</span></p>

        {/* OTP Input Fields */}
        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl bg-[#2e2e2e] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        {/* Verify OTP Button */}
        <button
          className={`w-full p-3 ${loading ? 'bg-yellow-400' : 'bg-yellow-500'} text-black font-bold rounded-lg hover:bg-yellow-500 cursor-pointer`}
          onClick={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-black" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Verifying OTP...
            </div>
          ) : (
            'Verify OTP'
          )}
        </button>

        {/* Resend OTP Link */}
        <p className="text-gray-400 mt-4">
          Didn't receive the OTP?{' '}
          <span className="text-yellow-500 cursor-pointer hover:underline" onClick={handleResendOtp}>
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;

