import { useState, useContext } from 'react';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      setUser(data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login to RentEasy</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}