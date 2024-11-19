import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, doc, updateDoc, addDoc, Timestamp, deleteDoc, where } from 'firebase/firestore';
import Loader from '../components/Loader';
import RecurringZoomForm from '../components/RecurringZoomForm';
import FixedZoomForm from '../components/FixedZoomForm';
import moment from 'moment';

const plans = ['free', 'vip', 'admin'];

export default function Settings() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingZoom, setSubmittingZoom] = useState(false);
  const [existingZooms, setExistingZooms] = useState([]);
  const [deletingZoom, setDeletingZoom] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.plan === 'admin') {
        fetchUsers();
        fetchRecurringZooms();
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const results = users.filter((user) =>
      (user.telegramId && user.telegramId.toString().includes(searchTerm)) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert('Errore nel caricamento degli utenti. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecurringZooms = async () => {
    try {
      const q = query(
        collection(db, 'recurring_zooms'), 
        where('creatorId', '==', user.telegramId)
      );
      
      const snapshot = await getDocs(q);
      const zooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExistingZooms(zooms);
    } catch (error) {
      console.error('Error fetching recurring zooms:', error);
      alert('Errore nel caricamento delle zoom ricorrenti');
    }
  };

  const handlePlanChange = async (userId, newPlan) => {
    try {
      await updateDoc(doc(db, 'users', userId), { plan: newPlan });
      setUsers(users.map((user) =>
        user.id === userId ? { ...user, plan: newPlan } : user
      ));
      alert('Piano utente aggiornato con successo!');
    } catch (error) {
      console.error("Error updating user plan:", error);
      alert('Errore durante l\'aggiornamento del piano utente.');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteRecurringZoom = async (zoomId) => {
    if (!confirm('Sei sicuro di voler eliminare questa zoom ricorrente?')) {
      return;
    }

    setDeletingZoom(true);
    try {
      await deleteDoc(doc(db, 'recurring_zooms', zoomId));

      for (const userDoc of users) {
        const appointmentsRef = collection(db, `users/${userDoc.telegramId}/appointments`);
        const q = query(appointmentsRef, where('recurringZoomId', '==', zoomId));
        const snapshot = await getDocs(q);
        
        for (const doc of snapshot.docs) {
          await deleteDoc(doc.ref);
        }
      }

      alert('Zoom ricorrente eliminata con successo!');
      fetchRecurringZooms();
    } catch (error) {
      console.error('Error deleting recurring zoom:', error);
      alert('Errore durante l\'eliminazione della zoom ricorrente');
    } finally {
      setDeletingZoom(false);
    }
  };

  const handleSubmitRecurringZoom = async (zoomData) => {
    setSubmittingZoom(true);
    try {
      const recurringZoomRef = await addDoc(collection(db, 'recurring_zooms'), {
        ...zoomData,
        createdAt: Timestamp.now(),
        creatorId: user.telegramId
      });

      const targetMonth = zoomData.month - 1;
      const targetYear = zoomData.year;
      const dates = [];
      
      const startDate = moment([targetYear, targetMonth, 1]);
      const endDate = moment(startDate).endOf('month');
      
      let currentDate = moment(startDate);
      while (currentDate.isSameOrBefore(endDate)) {
        if (currentDate.day().toString() === zoomData.dayOfWeek) {
          dates.push(moment(currentDate));
        }
        currentDate.add(1, 'days');
      }

      for (const userDoc of users) {
        const appointments = dates.map(date => {
          const [hours, minutes] = zoomData.time.split(':');
          const appointmentDate = date.clone().set({
            hour: parseInt(hours),
            minute: parseInt(minutes),
            second: 0,
            millisecond: 0
          });

          return {
            title: `${zoomData.type}: ${zoomData.title}`,
            date: Timestamp.fromDate(appointmentDate.toDate()),
            description: `Zoom Ricorrente: ${zoomData.title}\nhttps://us06web.zoom.us/j/7966816615`,
            members: [userDoc.telegramId],
            createdBy: 'ADMIN',
            creatorId: user.telegramId,
            isRecurring: true,
            recurringZoomId: recurringZoomRef.id,
            type: zoomData.type,
            backgroundColor: '#FFD700',
            duration: 30
          };
        });

        for (const appointment of appointments) {
          await addDoc(collection(db, `users/${userDoc.telegramId}/appointments`), appointment);
        }
      }

      alert('Zoom ricorrenti create con successo per tutti gli utenti!');
      await fetchRecurringZooms();
    } catch (error) {
      console.error('Error creating recurring zooms:', error);
      alert('Errore durante la creazione delle zoom ricorrenti');
    } finally {
      setSubmittingZoom(false);
    }
  };

  const handleSubmitFixedZoom = async (zoomData) => {
    setSubmittingZoom(true);
    try {
      const appointmentDate = moment(`${zoomData.date} ${zoomData.time}`, 'YYYY-MM-DD HH:mm').toDate();
      const appointmentData = {
        title: zoomData.title,
        date: appointmentDate,
        type: 'PRESENTAZIONE',
        description: 'Zoom di presentazione ufficiale per Harmonya',
        duration: 60,
      };
  
      const webinarUrl = "https://us06web.zoom.us/w/89001437054?tk=cbTQf7H6G6QtHDb7cnOcBd6SlCKs5W2oEPn_GbzqkyI.DQcAAAAUuOYnfhZnX1NJV2JuOFRxVzRfN1lKYlVQRHF3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&pwd=ac2DZsajQGB5wAqtNGFVpfbmLe0gJH.1&uuid=WN_ytwbqanISoCnIRDMGwFc_g";
  
      for (const userDoc of users) {
        const appointmentsRef = collection(db, `users/${userDoc.telegramId}/appointments`);
        await addDoc(appointmentsRef, appointmentData);
        await sendTelegramNotification(userDoc.telegramId, zoomData.title, zoomData.date, zoomData.time, webinarUrl);
      }
  
      alert('Zoom fisso creato con successo e notificato a tutti gli utenti!');
    } catch (error) {
      console.error('Errore durante la creazione della Zoom fissa:', error);
      alert('Errore durante la creazione della Zoom fissa. Riprova più tardi.');
    } finally {
      setSubmittingZoom(false);
    }
  };
  
  // Funzione per inviare una notifica Telegram
  const sendTelegramNotification = async (chatId, title, date, time, url) => {
    try {
      await fetch('/api/sendZoomInvitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
        },
        body: JSON.stringify({ chatId, title, date, time, url }),
      });
    } catch (error) {
      console.error('Errore durante l\'invio della notifica Telegram:', error);
    }
  };
  

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Inserisci un messaggio da inviare');
      return;
    }

    setLoading(true);
    try {
      for (const userId of selectedUsers) {
        const selectedUser = users.find(user => user.id === userId);
        if (selectedUser && selectedUser.telegramId) {
          await fetch('/api/send-telegram-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
            },
            body: JSON.stringify({ chatId: selectedUser.telegramId, message }),
          });
        }
      }
      alert('Messaggio inviato con successo!');
      setMessage('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error);
      alert('Errore durante l\'invio del messaggio. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user || user.plan !== 'admin') {
    return <Layout><div className="text-white">Accesso non autorizzato. Solo gli amministratori possono visualizzare questa pagina.</div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-[#0c0c0c] min-h-screen">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold mb-6 text-white">Impostazioni Utenti</h1>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cerca per ID Telegram, username o nome"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow mb-8">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID Telegram
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Piano
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#0C1A0E] divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.telegramId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.plan || 'Non impostato'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={user.plan || ''}
                        onChange={(e) => handlePlanChange(user.id, e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Seleziona piano</option>
                        {plans.map((plan) => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <RecurringZoomForm 
              onSubmit={handleSubmitRecurringZoom}
              isSubmitting={submittingZoom}
              existingZooms={existingZooms}
              onDelete={handleDeleteRecurringZoom}
              isDeleting={deletingZoom}
            />
          </div>

          <div className="mt-8">
            <FixedZoomForm 
              onSubmit={handleSubmitFixedZoom}
              isSubmitting={submittingZoom}
            />
          </div>

          <div className="mt-8 bg-[#0C1A0E] p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-white mb-4">Invia Messaggio su Telegram</h2>
            <div className="mb-4">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length}
                  onChange={handleSelectAllUsers}
                  className="mr-2"
                />
                <span>Seleziona tutti gli utenti ({selectedUsers.length} selezionati)</span>
              </label>
            </div>
            <ul className="mb-4 max-h-40 overflow-y-auto bg-gray-700 rounded-lg p-4">
              {filteredUsers.map((user) => (
                <li key={user.id} className="flex justify-between items-center text-white mb-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="mr-2"
                    />
                    {user.firstName} (@{user.username})
                  </label>
                </li>
              ))}
            </ul>
            <textarea
              placeholder="Scrivi il tuo messaggio qui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md mb-4"
              rows="4"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#C29022] text-white font-semibold py-2 px-4 rounded"
            >
              Invia Messaggio
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
