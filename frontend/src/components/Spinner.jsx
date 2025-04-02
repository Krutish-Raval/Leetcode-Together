import { FaSpinner, FaRedo } from "react-icons/fa"; // Loading spinner & Retry icon
const Spinner= ()=>{
    return(
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0e0e10]">
        <div className="w-17 h-17 border-10 border-t-[#ffa116] border-gray-500 rounded-full animate-spin"></div>
        <p className="text-[#ffa116] text-2xl mt-3 ml-2">Loading...</p>
      </div>
    )
}
export default Spinner