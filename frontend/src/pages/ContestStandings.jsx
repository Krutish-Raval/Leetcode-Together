import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContestStanding = () => {
  const [contestType, setContestType] = useState('');
  const [contestNumber, setContestNumber] = useState('');
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

  const handleButtonViewStanding= () => {
    if (!contestType.trim() || !contestNumber.trim()) {
      toast.error('Please enter valid Contest Type and Contest Number');
      return;
    }
    navigate(`/contest/${contestType}-${contestNumber}`);
  };

  const handleViewStanding = (contest) => {
    navigate(`/contest/${contest.contestType}-${contest.contestNumber}`);
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-4">
      <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            draggable
            theme="dark"
            limit={1}
            />
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold text-yellow-500">LeetCode Contest Standings</h1>
        <p className="text-gray-400">Add contests and view your friends' standings!</p>
      </header>

      {/* Add Contest Section */}
      <div className="max-w-lg mx-auto bg-[#1e1e1e] p-6 rounded-lg shadow-lg mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={contestType}
            onChange={(e) => setContestType(e.target.value)}
            className="w-full p-3 bg-[#2e2e30] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select Contest Type</option>
            <option value="Weekly">Weekly</option>
            <option value="Biweekly">Biweekly</option>
          </select>
          <input
            type="number"
            value={contestNumber}
            onChange={(e) => setContestNumber(e.target.value)}
            placeholder="Contest Number"
            className="w-full p-3 bg-[#2e2e30] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <button
         onClick={() => handleButtonViewStanding()}
          className="mt-4 w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all"
        >
          View Standings
        </button>
      </div>

      {/* Contests List Section */}
      <div className="max-w-lg mx-auto">
        {contests.length === 0 ? (
          <p className="text-gray-500 text-center">No contests added yet.</p>
        ) : (
          <ul className="space-y-4">
            {contests.map((contest, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 bg-[#1e1e1e] rounded-lg shadow-md hover:bg-[#2e2e30] transition-all"
              >
                <div>
                  <div className="text-lg font-semibold text-yellow-500 cursor-pointer" onClick={() => handleViewStanding(contest)}>
                    {contest.contestType} Contest {contest.contestNumber}
                  </div>
                </div>
                <Link
                  to={`/contest/${contest.contestType}-${contest.contestNumber}`}
                  className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  View Standing
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContestStanding;
