import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white relative overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-[#1e1e1e] py-5 px-8 flex items-center justify-between shadow-lg">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          <span className="text-yellow-500">&lt;/&gt;</span> LeetCode Together
        </h1>
        <div className="space-x-4">
          <button
            className="border border-yellow-500 text-yellow-500 px-5 py-2 rounded hover:bg-yellow-500 hover:text-black transition"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <button
            className="bg-yellow-500 text-black px-5 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </header>

      {/* Decorative Separator */}
      <div className="border-t border-yellow-500 mt-[-1px] shadow-[0_0_10px_rgba(255,193,7,0.4)]"></div>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center h-[calc(100vh-90px)] px-4">
        <h2 className="text-5xl font-extrabold mb-4 text-white tracking-tight">
          Track. Compare. Improve.
        </h2>
        <p className="text-gray-400 text-lg max-w-5xl leading-relaxed mt-2">
          "Track friends’ LeetCode contest rankings, submissions, and rating
          changes — all in one clean, competitive leaderboard."
        </p>

        <div className="mt-10 space-x-4">
          <button
            className="bg-yellow-500 text-black font-semibold px-8 py-3 rounded hover:bg-yellow-600 transition"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
