import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Header Section */}
      <div className="bg-[#1e1e1e] py-4 px-8 flex items-center justify-between ">
      <h1 className="text-white text-2xl font-bold">
          <span className="text-yellow-500">&lt;/&gt;</span> LeetCode Together
        </h1>
        <div>
          <button
            className="text-white border border-yellow-500 px-6 py-2 rounded-lg mr-4 hover:bg-[#ffa116] hover:text-black transition-all cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
          <button
            className="bg-[#ffa116] text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          
        </div>
        
      </div>
      <section className="flex flex-col justify-center items-center text-center h-[calc(100vh-80px)]">
        <h2 className="text-5xl font-bold mb-4">
          Code. <span className="text-yellow-500">Compete.</span> Collaborate.
        </h2>
        <TypeAnimation
          sequence={[
            'Connect with friends, track standings, share solutions, and discuss LeetCode contests in one collaborative platform.',
            3000,
          ]}
          wrapper="p"
          speed={60}
          className="text-lg text-gray-400 max-w-3xl"
        />

        <div className="mt-8 space-x-4">
          <button
            className="bg-[#ffa116] text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-600 transition-all cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
