import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    if (name.length < 20 || name.length > 60) return "Name must be 20-60 characters.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format.";
    if (address.length === 0 || address.length > 400) return "Address is required and must be at most 400 characters.";
    if (password.length < 8 || password.length > 16) return "Password must be 8-16 characters.";
    if (!/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) return "Password must have at least one uppercase letter and one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');
    setLoading(true);
    const vErr = validate();
    if (vErr) {
      setValidationError(vErr);
      setLoading(false);
      return;
    }
    try {
      const result = await API.register({ name, email, password, address });
      if (result.success) {
        const loginResult = await API.login({ email, password,role: 'user'});
        if (loginResult.success) {
          localStorage.setItem('token', loginResult.data.token);
          login(loginResult.data.user);
          navigate('/');
          window.location.reload();
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={400}
            />
          </div>

          {validationError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">{validationError}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 