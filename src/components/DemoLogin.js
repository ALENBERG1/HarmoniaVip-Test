import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const DemoLogin = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleDemoLogin } = useAuth();

  const DEMO_ACCOUNTS = {
    marketing: {
      username: 'marketing@test.com',
      password: 'marketing123',
      config: {
        telegramId: 'marketing_demo',
        username: 'Marketing Demo',
        status: 'Marketing',
        hasValidStatus: true,
        isDemoUser: true,
        allowedPages: ['/marketing']
      }
    },
    development: {
      username: 'dev@test.com',
      password: 'dev123',
      config: {
        telegramId: 'dev_demo',
        username: 'Development Demo',
        status: 'Sviluppo',
        hasValidStatus: true,
        isDemoUser: true,
        allowedPages: ['/development']
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trova l'account corrispondente
    const account = Object.values(DEMO_ACCOUNTS).find(
      acc => acc.username === username && acc.password === password
    );

    if (account) {
      try {
        const demoUser = await handleDemoLogin({ username, password });
        
        // Crea/aggiorna il documento dell'utente demo
        await setDoc(doc(db, 'users', account.config.telegramId), account.config, { merge: true });
        
        onSuccess(demoUser);
      } catch (error) {
        console.error('Demo login error:', error);
        setError('Errore durante il login demo. Riprova.');
      }
    } else {
      setError('Credenziali demo non valide');
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Account Demo</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2"
            placeholder="Inserisci username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2"
            placeholder="Inserisci password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
        >
          Login Demo
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-400">
        <div className="mb-6">
          <p className="font-semibold mb-2">Account Marketing:</p>
          <p>Username: marketing@test.com</p>
          <p>Password: marketing123</p>
          <p className="mt-1">Accesso esclusivo a:</p>
          <ul className="list-disc list-inside">
            <li>Marketing</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-2">Account Sviluppo:</p>
          <p>Username: dev@test.com</p>
          <p>Password: dev123</p>
          <p className="mt-1">Accesso esclusivo a:</p>
          <ul className="list-disc list-inside">
            <li>Sviluppo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;