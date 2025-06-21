import { useEffect, useState } from 'react';
import { API } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.getAdminStats();
      if (res.success) setStats(res.data);
    } catch {}
  };
  const fetchUsers = async () => {
    try {
      const res = await API.getUsers({ search: userSearch, role: userRoleFilter });
      if (res.success) setUsers(res.data.users);
    } catch {}
  };
  const fetchStores = async () => {
    try {
      const res = await API.getStores({ search: storeSearch });
      if (res.success) setStores(res.data);
    } catch {}
  };

  const handleUserSearchChange = (e) => setUserSearch(e.target.value);
  const handleStoreSearchChange = (e) => setStoreSearch(e.target.value);
  const handleRoleFilterChange = (e) => setUserRoleFilter(e.target.value);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [userSearch, userRoleFilter]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStores();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [storeSearch]);

  const validateMemberForm = () => {
    if (memberForm.name.length < 2 || memberForm.name.length > 60) return 'Name must be 2-60 characters.';
    if (!/^\S+@\S+\.\S+$/.test(memberForm.email)) return 'Invalid email format.';
    if (memberForm.address.length === 0 || memberForm.address.length > 400) return 'Address is required and must be at most 400 characters.';
    if (memberForm.password.length < 8 || memberForm.password.length > 16) return 'Password must be 8-16 characters.';
    if (!/[A-Z]/.test(memberForm.password) || !/[^A-Za-z0-9]/.test(memberForm.password)) return 'Password must have at least one uppercase letter and one special character.';
    if (!['admin','user','owner'].includes(memberForm.role)) return 'Invalid role.';
    return null;
  };
  const handleMemberFormChange = e => setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
  const handleMemberFormSubmit = async e => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    const vErr = validateMemberForm();
    if (vErr) { setFormError(vErr); return; }
    try {
      const res = await API.createUser(memberForm);
      if (res.success) {
        setFormSuccess('Member created!');
        setShowMemberForm(false);
        setMemberForm({ name: '', email: '', password: '', address: '', role: 'user' });
        fetchUsers();
      } else setFormError(res.message || 'Failed to create member');
    } catch (err) { setFormError(err.message || 'Failed to create member'); }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Stores" value={stats.totalStores} />
        <StatCard label="Total Ratings" value={stats.totalRatings} />
      </div>
      <h3 className="text-xl font-semibold mb-2">Users</h3>
      <div className="mb-2 flex gap-2">
        <input 
          name="search" 
          placeholder="Search by name, email, or address" 
          value={userSearch} 
          onChange={handleUserSearchChange} 
          className="border px-2 py-1 rounded w-full" 
        />
        <select name="role" value={userRoleFilter} onChange={handleRoleFilterChange} className="border px-2 py-1 rounded bg-white">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Store Owner</option>
        </select>
      </div>
      <div className="mb-8 border rounded bg-white overflow-hidden shadow">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Address</th>
              <th scope="col" className="px-6 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.address}</td>
                <td className="px-6 py-4 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="text-xl font-semibold mb-2">Stores</h3>
      <div className="mb-2 flex gap-2">
        <input 
          name="search" 
          placeholder="Search by name, email, or address" 
          value={storeSearch} 
          onChange={handleStoreSearchChange} 
          className="border px-2 py-1 rounded w-full" 
        />
      </div>
      <div className="border rounded bg-white overflow-hidden shadow">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Address</th>
              <th scope="col" className="px-6 py-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{s.name}</td>
                <td className="px-6 py-4">{s.email}</td>
                <td className="px-6 py-4">{s.address}</td>
                <td className="px-6 py-4">{s.averageRating || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6 flex gap-4 mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowMemberForm(v => !v)}>Add Member</button>
      </div>
      {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{formError}</div>}
      {formSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">{formSuccess}</div>}
      {showMemberForm && (
        <form onSubmit={handleMemberFormSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <h4 className="font-bold mb-2">Add Member</h4>
          <input name="name" placeholder="Name" value={memberForm.name} onChange={handleMemberFormChange} className="border px-2 py-1 rounded w-full mb-2" />
          <input name="email" placeholder="Email" value={memberForm.email} onChange={handleMemberFormChange} className="border px-2 py-1 rounded w-full mb-2" />
          <input name="password" placeholder="Password" type="password" value={memberForm.password} onChange={handleMemberFormChange} className="border px-2 py-1 rounded w-full mb-2" />
          <input name="address" placeholder="Address" value={memberForm.address} onChange={handleMemberFormChange} className="border px-2 py-1 rounded w-full mb-2" />
          <select name="role" value={memberForm.role} onChange={handleMemberFormChange} className="border px-2 py-1 rounded w-full mb-2">
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Store Owner</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </form>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded shadow p-4 text-center">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default AdminDashboard; 