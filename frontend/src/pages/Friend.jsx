import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { addFriend, removeFriend, getFriendsList } from "../services/api_user.js";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";

const AddFriends = () => {
  const [username, setUsername] = useState("");
  const [leetcodeId, setLeetcodeId] = useState("");
  const [friends, setFriends] = useState([]);
  const [page, setPage] = useState(1);
  const [totalFriends, setTotalFriends] = useState(0);
  const limit = 7;
  const leetcodeIdRef = useRef(null);

  const fetchFriends = async () => {
    try {
      const { data } = await getFriendsList(page, limit);
      setFriends(data?.friends || []);
      setTotalFriends(data?.totalFriends || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch friends.");
    }
  };

  
  const handleAddFriend = async () => {
    // e.preventDefault();
    // console.log(friends);                                                                
    if (!username.trim() || !leetcodeId.trim()) {
      toast.error("Please enter both Username and LeetCode ID!");
      return;
    }
    try {
      const newFriend = await addFriend({ friendName: username, leetcodeId });
      setFriends((prev) => [newFriend.data, ...prev]);  
      setUsername("");
      setLeetcodeId("");

    } catch (error) {
      
    }
  };

  // Remove a friend
  const handleRemoveFriend = async (leetcodeId) => {
    try {
      await removeFriend(leetcodeId);
      setFriends((prev) => prev.filter((friend) => friend.leetcodeId !== leetcodeId));
      setTotalFriends((prev) => prev - 1);
      // toast.success("Friend removed successfully!");
    } catch (error) {
      toast.error(error || "Failed to remove friend.");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [page]);

  const totalPages = Math.ceil(totalFriends / limit);

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-4">
      {/* <ToastContainer autoClose={1000} theme="dark" limit={1} /> */}
      
      {/* Header Section */}
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold text-[#ffa116]">LeetCode Friends</h1>
        <p className="text-gray-400">Add or remove friends to personalize your contest standings. Enter correct LeetcodeID.</p>
      </header>

      {/* Add Friend Section */}
      <div className="max-w-lg mx-auto bg-[#1e1e1e] p-6 rounded-lg shadow-lg mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 bg-[#2e2e30] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            onKeyDown={(e) => {
              if(e.key==='Enter'){
                leetcodeIdRef.current.focus();
              }
            }}
          />
          <input
            ref={leetcodeIdRef}
            type="text"
            value={leetcodeId}
            onChange={(e) => setLeetcodeId(e.target.value)}
            placeholder="LeetCode ID"
            className="w-full p-3 bg-[#2e2e30] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            onKeyDown={(e) => {
              // e.preventDefault()
              if(e.key==='Enter')
              handleAddFriend();
            }}
          />
        </div>
        <button
          onClick={handleAddFriend}
          className="mt-4 w-full bg-[#ffa116] text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all cursor-pointer"
        >
          Add Friend
        </button>
      </div>

      {/* Friends List Section */}
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-[#ffa116] mb-4">Your Friends</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500 text-center">No friends added yet.</p>
        ) : (
          <ul className="space-y-4">
        {friends.map((friend) => (
    <li
      key={friend.leetcodeId}
      className="flex justify-between items-center p-4 bg-[#1e1e1e] rounded-lg shadow-md hover:bg-[#2e2e30] transition-all"
    >
      <div>
        <div>
          <Link
            to={`https://leetcode.com/${friend.leetcodeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-[#ffa116]"
          >
            {friend.friendName}
          </Link>
        </div>
        <div>
          <Link
            to={`https://leetcode.com/${friend.leetcodeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-m text-gray-400 "
          >
            Leetcode ID: {friend.leetcodeId}
          </Link>
        </div>
      </div>
      <button
        onClick={() => handleRemoveFriend(friend.leetcodeId)}
        className="text-sm px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
      >
        Remove
      </button>
    </li>
  ))}
</ul>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`px-4 py-2 rounded-lg ${page <= 1 ? "bg-gray-600 cursor-not-allowed" : "bg-[#ffa116] hover:bg-yellow-600"}`}
            >
              Previous
            </button>
            <span className="text-gray-400">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded-lg ${page >= totalPages ? "bg-gray-600 cursor-not-allowed" : "bg-[#ffa116] hover:bg-yellow-600"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFriends;
