const InputField = ({ label, type, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 rounded bg-[#2C2C2C] text-white border border-gray-600"
      />
    </div>
  );
  
  export default InputField;