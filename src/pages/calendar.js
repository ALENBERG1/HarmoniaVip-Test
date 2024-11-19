import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CalendarComponent from '../components/Calendar/CalendarComponent';
import AppointmentForm from '../components/Calendar/AppointmentForm';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, Timestamp, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import moment from 'moment-timezone';
import { TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Loader from '../components/Loader';

export default function Calendar() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Recupera la timezone dell'utente
  const userTimeZone = moment.tz.guess();

  useEffect(() => {
    if (!user || !user.telegramId) {
      setLoading(false);
      return;
    }

    const userAppointmentsRef = collection(db, `users/${user.telegramId}/appointments`);
    const q = query(userAppointmentsRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      }));
      setAppointments(appointmentsData);
      setLoading(false);
      scheduleAllReminders();
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const scheduleAllReminders = () => {
    const remindersRef = collection(db, 'reminders');
    const now = moment().tz(userTimeZone);

    onSnapshot(remindersRef, (snapshot) => {
      snapshot.docs.forEach(doc => {
        const reminderData = doc.data();
        const reminderTime = moment(reminderData.reminderTime.toDate()).tz(userTimeZone);

        if (now.isSameOrAfter(reminderTime)) {
          reminderData.members.forEach(memberId => {
            sendTelegramMessage(memberId, reminderData.message);
          });

          deleteDoc(doc.ref); // Rimuovi il promemoria dopo l'invio
        }
      });
    });
  };

  const sendTelegramMessage = async (chatId, message) => {
    try {
      await fetch('/api/send-telegram-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
        },
        body: JSON.stringify({ chatId, message }),
      });
    } catch (error) {
      console.error("Errore durante l'invio del messaggio a Telegram:", error);
    }
  };

  const handleAddAppointment = async (newAppointment) => {
    if (!user || !user.telegramId) {
      console.error('User data not found');
      setFeedbackMessage("Errore durante la creazione dell'appuntamento. Dati utente non validi.");
      return;
    }

    setOperationLoading(true);
    try {
      const appointmentDate = moment.tz(`${newAppointment.date} ${newAppointment.time}`, 'YYYY-MM-DD HH:mm', userTimeZone).toDate();
      const members = Array.isArray(newAppointment.members) && newAppointment.members.length > 0 ? newAppointment.members : [user.telegramId];

      if (!members.includes(user.telegramId)) {
        members.push(user.telegramId);
      }

      if (!await isTimeSlotAvailable(newAppointment.date, newAppointment.time, members)) {
        setFeedbackMessage("Questo slot temporale non è disponibile per tutti i membri selezionati. Per favore, scegli un altro orario.");
        setOperationLoading(false);
        return;
      }

      const createdBy = user.username || user.firstName || `User${user.telegramId}`;
      const appointmentData = {
        title: newAppointment.title,
        date: Timestamp.fromDate(appointmentDate),
        description: newAppointment.description,
        members: members,
        createdBy: createdBy,
        creatorId: user.telegramId,
        duration: 30,
      };

      const appointmentId = doc(collection(db, 'appointments')).id;
      const addAppointmentPromises = members.map(memberId => {
        const memberAppointmentsRef = doc(collection(db, `users/${memberId}/appointments`), appointmentId);
        return setDoc(memberAppointmentsRef, appointmentData);
      });

      await Promise.all(addAppointmentPromises);

      // Messaggio di conferma per tutti i membri
      const confirmationMessage = `Ciao! È stato creato un nuovo appuntamento: "${newAppointment.title}" il ${moment(appointmentDate).format('DD/MM/YYYY [alle ore] HH:mm')}. Dettagli: ${newAppointment.description}`;
      await Promise.all(members.map(memberId => sendTelegramMessage(memberId, confirmationMessage)));

      // Crea i reminder solo per gli orari futuri rispetto all'ora corrente
      const now = moment().tz(userTimeZone);
      const reminderMessages = [
        { offset: -1, message: `Promemoria: il tuo appuntamento "${newAppointment.title}" inizierà tra un'ora alle ${moment(appointmentDate).format('HH:mm')}.` },
        { offset: 0, message: `Il tuo appuntamento "${newAppointment.title}" è ora in corso!` }
      ];

      const reminderPromises = reminderMessages
        .filter(({ offset }) => now.isBefore(moment(appointmentDate).add(offset, 'hours')))
        .map(({ offset, message }) => {
          const reminderTime = moment(appointmentDate).add(offset, 'hours').toDate();
          return setDoc(doc(collection(db, 'reminders')), {
            appointmentId,
            reminderTime: Timestamp.fromDate(reminderTime),
            message,
            members
          });
        });

      await Promise.all(reminderPromises);

      setFeedbackMessage("Appuntamento creato con successo!");
    } catch (error) {
      console.error("Errore durante l'aggiunta dell'appuntamento: ", error);
      setFeedbackMessage("Si è verificato un errore durante la creazione dell'appuntamento. Per favore, riprova.");
    } finally {
      setOperationLoading(false);
    }
  };

  const isTimeSlotAvailable = async (date, time, members = []) => {
    const selectedDateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', userTimeZone);

    if (moment().tz(userTimeZone).isAfter(selectedDateTime)) {
      return false;
    }

    const checkAvailability = async (userId) => {
      const userAppointmentsRef = collection(db, `users/${userId}/appointments`);
      const userAppointmentsSnapshot = await getDocs(userAppointmentsRef);
      const userAppointments = userAppointmentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date)
        };
      });

      return !userAppointments.some(appointment => {
        const appointmentStart = moment(appointment.date).tz(userTimeZone);
        const appointmentEnd = moment(appointment.date).add(30, 'minutes').tz(userTimeZone);
        return selectedDateTime.isBetween(appointmentStart, appointmentEnd, null, '[)');
      });
    };

    if (!await checkAvailability(user.telegramId)) return false;

    for (const memberId of members) {
      if (memberId === user.telegramId) continue;
      if (!await checkAvailability(memberId)) return false;
    }

    return true;
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!user || !user.telegramId) {
      console.error("User data not found");
      setFeedbackMessage("Errore durante l'eliminazione dell'appuntamento. Dati utente non validi.");
      return;
    }

    setOperationLoading(true);
    try {
      const appointmentRef = doc(db, `users/${user.telegramId}/appointments`, appointmentId);
      const appointmentSnap = await getDoc(appointmentRef);
      const appointmentData = appointmentSnap.data();

      if (appointmentData && appointmentData.members) {
        const deletePromises = appointmentData.members.map(memberId => {
          const memberAppointmentRef = doc(db, `users/${memberId}/appointments`, appointmentId);
          return deleteDoc(memberAppointmentRef);
        });

        await Promise.all(deletePromises);

        // Elimina anche i promemoria associati a questo appuntamento
        const remindersRef = collection(db, 'reminders');
        const remindersSnapshot = await getDocs(remindersRef);
        remindersSnapshot.forEach(doc => {
          const reminder = doc.data();
          if (reminder.appointmentId === appointmentId) {
            deleteDoc(doc.ref);
          }
        });
      }

      setSelectedAppointment(null);
      setFeedbackMessage("Appuntamento eliminato con successo!");
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'appuntamento: ", error);
      setFeedbackMessage("Si è verificato un errore durante l'eliminazione dell'appuntamento. Per favore, riprova.");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedAppointment(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedAppointment(appointments.find(app => app.id === event.id));
    setSelectedDate(event.start);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading || operationLoading) {
    return <Loader />;
  }

  if (!user || !user.telegramId) {
    return <Layout><div>Errore: Dati utente non disponibili. Per favore, effettua nuovamente il login.</div></Layout>;
  }

  return (
    <Layout>
      {feedbackMessage && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50" 
          style={{ zIndex: 9999 }}
        >
          {feedbackMessage}
        </div>
      )}
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">Il tuo Calendario Personale</h1>
          <a 
            href="https://us06web.zoom.us/j/7966816615" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 hover:text-blue-300 text-sm md:text-base"
          >
            Link Zoom: https://us06web.zoom.us/j/7966816615
          </a>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            {selectedAppointment ? (
              <div className="bg-[#0C1A0E] shadow-md rounded px-8 pt-6 pb-8 text-white">
                <h2 className="text-xl font-semibold mb-4">{selectedAppointment.title}</h2>
                <p><strong>Data:</strong> {moment(selectedAppointment.date).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Descrizione:</strong> {selectedAppointment.description}</p>
                <p><strong>Membri:</strong> {selectedAppointment.members ? selectedAppointment.members.join(', ') : 'Nessun membro'}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Indietro
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Elimina Appuntamento
                  </button>
                </div>
              </div>
            ) : (
              <AppointmentForm 
                onSubmit={handleAddAppointment} 
                selectedDate={selectedDate}
                appointments={appointments}
                onDateChange={handleDateChange}
                isTimeSlotAvailable={isTimeSlotAvailable}
              />
            )}
          </div>
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="w-full overflow-x-auto">
              <CalendarComponent 
                appointments={appointments} 
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
              />
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-white">I tuoi Appuntamenti</h2>
              {appointments.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto">
                  {appointments.map((appointment) => (
                    <li key={appointment.id} className="mb-2 p-2 bg-[#0C1A0E] rounded-md shadow flex justify-between items-center text-white">
                      <div className="flex-1 mr-2">
                        <strong className="block text-sm md:text-base">{appointment.title}</strong>
                        <span className="text-xs md:text-sm text-gray-400">
                          {moment(appointment.date).format('DD/MM/YYYY HH:mm')}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white">Nessun appuntamento</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}