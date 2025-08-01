import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUserDetail, getUserDetails } from "../services/api_user.js";

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    leetcodeId: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseData = await getUserDetails();
        const response = responseData.data;
        // console.log("User Data:", response.email);
        setUserData({
          name: response.name || "",
          leetcodeId: response.leetcodeId || "",
          email: response.email || "",
        });
        if (response.name !== "") {
          setIsSubmitted(true);
        } else {
          setIsSubmitted(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addUserDetail(userData);
      if (response) {
        setIsSubmitted(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white flex flex-col items-center px-6">
      <main className="flex flex-col items-center justify-center text-center space-y-12 flex-grow">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-[#ffa116]">LeetCode Together</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Track your friends' LeetCode contest standings, discuss solutions, and
          code together!
        </p>

        {isSubmitted && !isEditing ? (
          <div className="bg-[#1a1a1d] p-3 rounded-xl shadow-lg w-full max-w-90 text-center">
            <h3 className="text-2xl font-semibold text-[#ffa116]">
              Welcome, {userData.name}!
            </h3>
            <p className="text-gray-300 mt-1">
              LeetCode ID: {userData.leetcodeId}
            </p>
            <p className="text-gray-300 mt-1">Email: {userData.email}</p>
            <button
              className="mt-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
              onClick={() => setIsEditing(true)}
            >
              Edit Details
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#1a1a1d] p-6 rounded-xl shadow-lg w-full max-w-md text-center space-y-4"
          >
            <h3 className="text-2xl font-semibold text-[#ffa116]">
              {isEditing ? "Edit Your Details" : "Enter Your Details"}
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#0e0e10] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#ffa116]"
              required
            />
            <input
              type="text"
              name="leetcodeId"
              placeholder="LeetCode ID"
              value={userData.leetcodeId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#0e0e10] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#ffa116]"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#0e0e10] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#ffa116]"
            />
            <button
              type="submit"
              className="bg-[#ffa116] hover:bg-[#e69500] text-black font-bold py-2 px-6 rounded-lg transition-all w-full"
            >
              {isEditing ? "Update" : "Submit"}
            </button>
          </form>
        )}

        {/* Features Section */}
        <section className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-gray-300">
          <FeatureCard
            title="LeetCode Contest Friends Standings"
            description="See where your friends rank in contests and compare your performance."
          />
          <FeatureCard
            title="View Friends Solutions"
            description="Check out your friends solutions for contests to learn new approaches."
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-1 text-gray-500 text-center">
        © 2025 LeetCode Together | Made with ❤️ for Coders
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="bg-[#1a1a1d] p-6 rounded-lg shadow-md hover:scale-105 transition-transform border border-gray-700">
    <h4 className="text-xl font-semibold text-[#ffa116]">{title}</h4>
    <p className="text-gray-400 mt-2">{description}</p>
  </div>
);

export default HomePage;
