import { useEffect, useState } from 'react';
import { API } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOwnerDashboard();
    // eslint-disable-next-line
  }, []);

  const fetchOwnerDashboard = async () => {
    setLoading(true);
    try {
      const res = await API.getOwnerDashboard();
      if (res.success) {
        setStore(res.data.store);
        setRatings(res.data.ratings);
        setAverageRating(res.data.averageRating);
      } else {
        setError('Failed to fetch dashboard');
      }
    } catch (err) {
      setError('Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!store) return <div>No store found for this owner.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Store Owner Dashboard</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="text-lg font-bold mb-1">{store.name}</h3>
        <div className="text-gray-600 mb-1">{store.address}</div>
        <div className="mb-2">Average Rating: <b>{averageRating}</b></div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Users Who Rated</h3>
      <div className="border rounded bg-white">
        <table className="w-full text-left">
          <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
          <tbody>
            {ratings.map(r => (
              <tr key={r._id} className="border-t"><td>{r.user.name}</td><td>{r.user.email}</td><td>{r.user.address}</td><td>{r.rating}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard; 