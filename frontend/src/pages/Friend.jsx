import { useEffect, useRef, useState } from "react";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addFriend,
  getFriendsList,
  getUserDetails,
  removeFriend,
  updateFriend,
} from "../services/api_user.js";

const AddFriends = () => {
  const [username, setUsername] = useState("");
  const [leetcodeId, setLeetcodeId] = useState("");
  const [userLeetcodeId, setUserLeetcodeId] = useState("");
  const [friends, setFriends] = useState([]);
  const [page, setPage] = useState(1);
  const [totalFriends, setTotalFriends] = useState(0);
  const limit = 6;
  const leetcodeIdRef = useRef(null);
  const [editingFriendId, setEditingFriendId] = useState(null);
  const [editedFriendName, setEditedFriendName] = useState("");
  const [editedFriendId, setEditedFriendId] = useState("");
  const [loadAddFriend, setLoadAddFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data } = await getFriendsList(page, limit);
      setFriends(data?.friends || []);
      setTotalFriends(data?.totalFriends || 0);
    } catch (error) {
      toast.error("Failed to fetch friends.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCurrentUserLeetcodeId = async () => {
      const user = await getUserDetails();
      setUserLeetcodeId(user.data.leetcodeId);
      // console.log(user.data.leetcodeId)
      return user.data.leetcodeId;
    };
    getCurrentUserLeetcodeId();
  }, []);
  const handleAddFriend = async () => {
    // e.preventDefault();
    // console.log(friends);
    if (!username.trim() || !leetcodeId.trim()) {
      toast.error("Please enter both Username and LeetCode ID!");
      return;
    }
    try {
      // console.log(userLeetcodeId);
      setLoadAddFriend(true);
      if (leetcodeId !== userLeetcodeId) {
        const newFriend = await addFriend({ friendName: username, leetcodeId });
        setFriends((prev) => [newFriend.data, ...prev]);
        setUsername("");
        setLeetcodeId("");
      } else {
        toast.error("You cannot enter your leetcodeId");
      }
    } catch (error) {
      if (error === "Friend already exists in your friends list") {
        toast.error("Friend already exists in your friends list");
      }
    } finally {
      setLoadAddFriend(false);
    }
  };

  const handleUpdateFriend = async () => {
    if (!editedFriendName.trim() || !editedFriendId.trim()) {
      toast.error("Both friend name and LeetCode ID are required.");
      return;
    }
    try {
      //console.log(editedFriendId);
      const response = await updateFriend({
        beforeleetcodeId: editingFriendId,
        friendName: editedFriendName,
        leetcodeId: editedFriendId,
      });
      //console.log(response);
      setFriends((prev) =>
        prev.map((friend) =>
          friend.leetcodeId === editingFriendId
            ? { ...friend, ...response.data }
            : friend
        )
      );
      setEditingFriendId(null);
      setEditedFriendName("");
      setEditedFriendId("");
      toast.success("Friend updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update friend.");
    }
  };

  const handleRemoveFriend = async (leetcodeId) => {
    try {
      await removeFriend(leetcodeId);
      setFriends((prev) =>
        prev.filter((friend) => friend.leetcodeId !== leetcodeId)
      );
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

      {/* Header Section */}
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold text-[#ffa116]">LeetCode Friends</h1>
        <p className="text-gray-400">
          Add or remove friends to personalize your contest standings.
        </p>
        <p className="text-gray-400"> 
          Enter your friend's LeetCode ID exactly as it appears on their profile
          (case-sensitive)
        </p>
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
              if (e.key === "Enter") {
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
              if (e.key === "Enter") handleAddFriend();
            }}
          />
        </div>
        <button
          onClick={() => handleAddFriend()}
          className="mt-4 w-full bg-[#ffa116] text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all cursor-pointer"
        >
          {loadAddFriend ? <span>Loading...</span> : <span>Add Friend</span>}
        </button>
      </div>

      {/* Friends List Section */}
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-[#ffa116] mb-4">
          Your Friends
        </h2>
        {loading ? (
          <p className="text-2xl text-center">Loading...</p>
        ) : friends.length === 0 ? (
          <p className="text-gray-500 text-2xl text-center">
            No friends added yet.
          </p>
        ) : (
          <ul key="friends-list" className="space-y-4">
            {friends.map((friend, index) => (
              <li
                key={`${friend?.leetcodeId}-${index}`}
                className="flex justify-between items-center p-4 bg-[#1e1e1e] rounded-lg shadow-md hover:bg-[#2e2e30] transition-all"
              >
                <div>
                  {editingFriendId === friend?.leetcodeId ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editedFriendName}
                        onChange={(e) => setEditedFriendName(e.target.value)}
                        placeholder="Friend Name"
                        className="w-full p-2 bg-[#2e2e30] text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateFriend();
                          if (e.key === "Escape") setEditingFriendId(null);
                        }}
                      />
                      <input
                        type="text"
                        value={editedFriendId}
                        onChange={(e) => setEditedFriendId(e.target.value)}
                        placeholder="LeetCode ID"
                        className="w-full p-2 bg-[#2e2e30] text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateFriend();
                          if (e.key === "Escape") setEditingFriendId(null);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`https://leetcode.com/${friend.leetcodeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-[#ffa116]"
                        >
                          {friend?.friendName}
                        </Link>
                        <button
                          onClick={() => {
                            setEditingFriendId(friend?.leetcodeId);
                            setEditedFriendName(friend?.friendName);
                            setEditedFriendId(friend?.leetcodeId);
                          }}
                          className="text-m text-gray-400 hover:text-white"
                        >
                          <FaEdit />
                        </button>
                      </div>
                      <div>
                        <Link
                          to={`https://leetcode.com/${friend?.leetcodeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400"
                        >
                          LeetCode ID: {friend?.leetcodeId}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {editingFriendId === friend?.leetcodeId ? (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleUpdateFriend}
                      className="text-xl text-green-400 hover:text-green-500 transition-all"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => {
                        setEditingFriendId(null);
                        setEditedFriendName("");
                        setEditedFriendId("");
                      }}
                      className="text-xl text-red-400 hover:text-red-500 transition-all"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRemoveFriend(friend.leetcodeId)}
                    className="text-xl px-4 py-2 text-[#ffa116] rounded-lg hover:text-gray-400 transition-all"
                  >
                    <FaTrash />
                  </button>
                )}
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
              className={`px-4 py-2 rounded-lg ${
                page <= 1
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#ffa116] hover:bg-yellow-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded-lg ${
                page >= totalPages
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#ffa116] hover:bg-yellow-600"
              }`}
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
