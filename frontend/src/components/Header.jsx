import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logOutUser } from "../services/api_user.js";
import { logout } from "../store/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logOutUser({});
      // toast.dismiss();
      // toast.success('Logged Out successfully');
      dispatch(logout());
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };
  const isActive = (path) => {
    if (path === "/contest-lists") {
      return location.pathname.startsWith("/contest-lists");
    }
    return location.pathname === path;
  };

  return (
    <div>
      <header className="bg-[#1e1e1e] text-white py-4 px-7 shadow-md">
        <div className="flex justify-between items-center">
          <div
            className="text-2xl font-bold cursor-pointer text-white"
            onClick={() => navigate("/home")}
          >
            <span className="text-[#ffa116]">&lt;/&gt;</span> LeetCode Together
          </div>

          <nav className="flex gap-7">
            <button
              onClick={() => navigate("/home")}
              className={`text-2xl font-semibold cursor-pointer transition-all ${
                isActive("/home")
                  ? "text-[#ffa116] "
                  : "hover:text-yellow-400"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate("/add-friends")}
              className={`text-2xl font-semibold cursor-pointer transition-all ${
                isActive("/add-friends")
                  ? "text-[#ffa116] "
                  : "hover:text-yellow-400"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => navigate("/contest-lists")}
              className={`text-2xl font-semibold cursor-pointer transition-all ${
                isActive("/contest-lists")
                  ? "text-[#ffa116] "
                  : "hover:text-yellow-400"
              }`}
            >
              Contest Standings
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="h-1 w-full bg-[#ffa116] "></div>
    </div>
  );
};

export default Header;
