import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white font-sans">
      {/* Header Section */}
      <header className="flex justify-between items-center p-5 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-[#FFA116]">LeetCode Together</h1>
        <div>
          <button
            className="bg-[#FFA116] text-black px-4 py-2 rounded-lg mr-4"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="bg-transparent text-[#FFA116] px-4 py-2 rounded-lg border border-[#FFA116]"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20">
        <h2 className="text-5xl font-bold mb-6">Welcome to LeetCode Together 🚀</h2>
        <p className="text-gray-400 text-lg mb-8">
          Track your friends' progress, share solutions, and discuss challenges — all in one place!
        </p>
        <button
          className="bg-[#FFA116] text-black px-8 py-3 text-xl rounded-lg"
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </section>
    </div>
  );
}

export default App;
