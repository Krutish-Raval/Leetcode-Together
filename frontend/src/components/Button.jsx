const Button = ({ label, onClick, isLoading }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full bg-[#FFA116] text-black p-3 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
  
  export default Button;
  