import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use context's login()

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login({ email, password, role }); // ✅ use login from context
    if (result.success) {
      navigate('/'); // or wherever you want
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleLogin}>
        <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Store Owner</option>
        </select>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
