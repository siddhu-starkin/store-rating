import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StoreList from './pages/StoreList';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? children : <Navigate to="/login" />;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'owner') return <Navigate to="/owner" />;
  return <Navigate to="/stores" />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/stores" element={<PrivateRoute><StoreList /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/owner" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
