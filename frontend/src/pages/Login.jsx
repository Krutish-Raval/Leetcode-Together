import { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await loginUser({ email, password });
      alert('Login Successful!');
      localStorage.setItem('token', data.token); // Save token for authentication
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1c1c] text-white">
      <div className="bg-[#2C2C2C] p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6">Login to LeetCode Together</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button label="Login" onClick={handleLogin} isLoading={isLoading} />
        <p className="mt-4">
          Don't have an account?{' '}
          <span className="text-[#FFA116] cursor-pointer" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
