import { useEffect, useState } from 'react';
import { API } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    console.log('Fetching stores with search:', search);
    try {
      const res = await API.getStores({ name: search });
      console.log('API response for stores:', res);
      if (res.success) setStores(res.data);
      else {
        setError('Failed to fetch stores');
        console.error('Failed to fetch stores:', res);
      }
    } catch (err) {
      setError('Failed to fetch stores');
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
      console.log('Finished fetching stores');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Stores</h2>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or address"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map(store => (
            <StoreCard key={store.id} store={store} userId={user?.id} />
          ))}
        </div>
      )}
    </div>
  );
};

const StoreCard = ({ store, userId }) => {
  const [userRating, setUserRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!userId) return;
      try {
        const res = await API.getUserRating(store.id);
        if (res.success && res.data) {
          setUserRating(res.data.rating);
          setMyRating(res.data.rating);
        }
      } catch (err) {
        console.error('Failed to fetch user rating:', err);
      }
    };

    fetchUserRating();
  }, [store.id, userId]);

  const handleRate = async (rating) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await API.submitRating({ storeId: store.id, rating });
      if (res.success) {
        setUserRating(rating);
        setMyRating(rating);
      } else {
        setError('Failed to submit rating');
      }
    } catch (err) {
      setError('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded p-4 bg-white shadow">
      <h3 className="text-lg font-bold mb-1">{store.name}</h3>
      <div className="text-gray-600 mb-1">{store.address}</div>
      <div className="mb-2">Overall Rating: <b>{store.averageRating || 0}</b></div>
      <div className="mb-2">Your Rating: <b>{userRating || 'Not rated'}</b></div>
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5].map(num => (
          <button
            key={num}
            className={`px-2 py-1 rounded ${myRating === num ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            disabled={submitting}
            onClick={() => handleRate(num)}
          >{num}</button>
        ))}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default StoreList; 