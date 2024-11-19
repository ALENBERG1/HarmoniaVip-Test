import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

// Configurazione di Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || null;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase non è configurato. Alcune funzionalità potrebbero non funzionare.');
}

// Non esportare supabase come default
export { supabase };

const EmailBroadcast = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const { user, loading } = useAuth();
  const router = useRouter();

  // Effettua il fetch degli utenti
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('registrations').select('id, name, email');
        if (error) throw error;
        setUsers(data);
      } catch (error) {
        console.error('Errore nel recupero degli utenti:', error.message);
      }
    };
    fetchUsers();
  }, []);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((user) => user.id));
  };

  const handleSendEmails = async () => {
    setIsSending(true);
    setStatusMessage({ type: '', message: '' });

    try {
      const selectedEmails = users.filter((user) => selectedUsers.includes(user.id));

      for (const user of selectedEmails) {
        console.log(`Mock: Email inviata a ${user.email} (${user.name})`);
      }

      setStatusMessage({
        type: 'success',
        message: 'Mock: Email inviate correttamente a tutti gli utenti selezionati.',
      });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: "Mock: Si è verificato un errore durante l'invio delle email.",
      });
    } finally {
      setIsSending(false);
      setSelectedUsers([]);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0C1A0E]">
      <header className="p-4 bg-[#956A1E] text-center">
        <h2 className="text-3xl font-bold text-white">Pannello di Invio Email Broadcast</h2>
      </header>

      {statusMessage.message && (
        <div
          className={`p-4 text-center ${
            statusMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          {statusMessage.message}
        </div>
      )}

      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center text-white cursor-pointer">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span>Seleziona tutti gli utenti ({selectedUsers.length} selezionati)</span>
          </label>
          <button
            onClick={handleSendEmails}
            disabled={isSending || selectedUsers.length === 0}
            className={`bg-[#147939] text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300 uppercase font-bold ${
              isSending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSending ? 'Invio in corso...' : 'Invia Email'}
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto border border-[#956A1E] rounded-lg">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-3 border-b border-[#956A1E]">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="mr-2"
                />
                <span>{user.name}</span>
              </label>
              <span className="text-gray-400 text-sm">{user.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailBroadcast;
