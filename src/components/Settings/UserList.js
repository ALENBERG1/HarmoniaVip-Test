import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const UserList = ({ onPlanChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handlePlanChange = async (userId, newPlan) => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { plan: newPlan });
      setUsers(users.map(user => user.id === userId ? { ...user, plan: newPlan } : user));
      if (onPlanChange) onPlanChange(userId, newPlan);
    } catch (error) {
      console.error("Error updating user plan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Gestione Piano Utenti</h2>
      <table className="min-w-full bg-gray-700 rounded-lg shadow divide-y divide-gray-600">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Piano</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Azioni</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-600">
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-4 py-2 text-gray-300">{user.username || user.firstName}</td>
              <td className="px-4 py-2 text-gray-300">{user.plan || 'Non impostato'}</td>
              <td className="px-4 py-2">
                <select
                  value={user.plan || ''}
                  onChange={(e) => handlePlanChange(user.id, e.target.value)}
                  className="bg-gray-600 text-white p-2 rounded"
                >
                  <option value="">Seleziona piano</option>
                  <option value="VIP">VIP</option>
                  <option value="Standard">Standard</option>
                  <option value="Sviluppo">Sviluppo</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;