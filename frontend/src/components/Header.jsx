import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice"; 
import { toast } from "react-toastify";
import { logOutUser } from "../services/api"; 

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOutUser({});
      toast.dismiss();
      toast.success('Logged Out successfully');
      dispatch(logout());
      navigate('/');
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
    }
  };

  return (
    <header className="bg-[#1e1e1e] text-white py-4 px-8 shadow-md">
      <div className="flex justify-between items-center">
        {/* Brand Logo */}
        <h1 
          className="text-3xl font-bold cursor-pointer text-white"
          onClick={() => navigate("/home")}
        >
          <span className="text-yellow-500">&lt;/&gt;</span> LeetCode Together
        </h1>

        {/* Navigation Links */}
        <nav className="flex gap-6">
          <button
            onClick={() => navigate("/home")}
            className="text-lg font-semibold hover:text-yellow-400 transition-all"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/add-friends")}
            className="text-lg font-semibold hover:text-yellow-400 transition-all"
          >
            Add Friends
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-lg font-semibold hover:text-yellow-400 transition-all"
          >
            Profile
          </button>
        </nav>

        {/* Buttons Section */}
        <div className="flex items-center gap-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orange Line for Separation */}
      <div className="h-1 w-full bg-yellow-500 mt-4"></div>
    </header>
  );
};

export default Header;
