import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchContests } from "../services/api_contest.js";

const ContestLists = () => {
  let [contestType, setContestType] = useState("");
  const [contestNumber, setContestNumber] = useState("");
  const [contests, setContests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const inputRefs = useRef(null);

  useEffect(() => {
    const loadContests = async () => {
      const realData = await fetchContests(page, 6);
      const data = realData.data;
      if (data && Array.isArray(data.contests)) {
        setContests(data.contests);
        setTotalPages(data.totalPages);
      } else {
        setContests([]);
      }
    };
    loadContests();
  }, [page]);

  const handleButtonViewStanding = (e) => {
    e.preventDefault();
    if (!contestType.trim() || !contestNumber.trim()) {
      toast.error("Please enter valid Contest Type and Contest Number");
      return;
    }
    contestType = contestType.toLowerCase();
    navigate(`/contest-standing/${contestType}-contest-${contestNumber}`);
  };
  
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-4">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="dark"
        limit={1}
      />

      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold text-[#ffa116]">
          LeetCode Contest Dashboard
        </h1>
        <p className="text-gray-400 text-xl">
          {" "}
          Explore contest solutions and track standings of your friends.
        </p>
      </header>

      {/* Add Contest Section */}
      <div className="max-w-lg mx-auto bg-[#1e1e1e] p-6 rounded-lg shadow-lg mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={contestType}
            onChange={(e) => setContestType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                inputRefs.current.focus();
              }
            }}
            className="w-full p-3 bg-[#2e2e30] text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">Select Contest Type</option>
            <option value="Weekly">Weekly</option>
            <option value="Biweekly">Biweekly</option>
          </select>
          <input
            type="number"
            value={contestNumber}
            ref={inputRefs}
            onChange={(e) => setContestNumber(e.target.value)}
            placeholder="Contest Number"
            className="w-full p-3 bg-[#2e2e30] text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleButtonViewStanding(e);
              }
            }}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleButtonViewStanding}
            className="w-full  bg-[#ffa116] text-black text-2m font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all cursor-pointer"
          >
            View Standings
          </button>
        </div>
      </div>

      {/* Contests List Section */}
      <div className="max-w-lg mx-auto">
        {contests.length === 0 ? (
          <p className="text-gray-500 text-center">No contests added yet.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {contests.map((contest) => (
                <li
                  key={contest._id}
                  className="flex justify-between items-center p-4 bg-[#1e1e1e] rounded-lg shadow-md hover:bg-[#2e2e30] transition-all"
                >
                  <div>
                    <div
                      className="text-lg font-semibold text-[#ffa116] cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/contest-lists/${contest.contestType}-contest-${contest.contestId}`
                        )
                      }
                    >
                      {contest.contestType} Contest {contest.contestId}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(contest.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1 pt-2">
                    <Link
                      to={`/contest-lists/${contest.contestType.toLowerCase()}-contest-${
                        contest.contestId
                      }`}
                      className="text-m px-8 py-3 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-all"
                    >
                      View Standing
                    </Link>
          
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 text-white rounded-lg transition-all ${
                  page === 1
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 text-white rounded-lg transition-all ${
                  page === totalPages
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContestLists;