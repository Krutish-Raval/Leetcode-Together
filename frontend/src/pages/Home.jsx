import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      {/* Welcome Section */}
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
        <h1 className="text-5xl font-bold">
          Welcome to <span className="text-yellow-500">LeetCode Together</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl text-center">
          Track your friends' standings in LeetCode contests, discuss solutions, and grow together. 
          Experience coding like never before!
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button 
            className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition-all"
            onClick={() => navigate('/add-friends')}
          >
            Add Friends
          </button>
          <button 
            className="bg-orange-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-all"
            onClick={() => navigate('/profile')}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
