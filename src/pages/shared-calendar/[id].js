import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import CalendarComponent from '../../components/Calendar/CalendarComponent';
import AppointmentForm from '../../components/Calendar/AppointmentForm';
import moment from 'moment';

export default function SharedCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchCalendarData = async () => {
      try {
        const shareableRef = collection(db, 'shareableCalendars');
        const q = query(shareableRef, where('__name__', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          alert('Invalid or expired shareable link.');
          router.push('/');
          return;
        }

        const calendarData = querySnapshot.docs[0].data();
        setOwnerId(calendarData.userId);

        const appointmentsRef = collection(db, `users/${calendarData.userId}/appointments`);
        const appointmentsSnapshot = await getDocs(appointmentsRef);
        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.data().date.toDate(),
          title: 'Occupied',
          description: ''
        }));
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching shared calendar data: ', error);
        alert('Error loading shared calendar. Please try again.');
      }
    };

    fetchCalendarData();
  }, [id, router]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const handleAddAppointment = async (newAppointment) => {
    if (!ownerId) return;

    try {
      const appointmentDate = moment(`${newAppointment.date} ${newAppointment.time}`, 'YYYY-MM-DD HH:mm').toDate();
      
      const appointmentData = {
        ...newAppointment,
        date: Timestamp.fromDate(appointmentDate),
        createdBy: 'Guest'
      };

      // Add appointment to owner's calendar
      const ownerAppointmentsRef = collection(db, `users/${ownerId}/appointments`);
      await addDoc(ownerAppointmentsRef, appointmentData);

      // Update local state
      setAppointments([...appointments, { 
        ...appointmentData, 
        id: Date.now().toString(),
        title: 'Occupied',
        description: ''
      }]);

      alert('Appointment booked successfully!');
      setSelectedDate(null);
    } catch (error) {
      console.error('Error adding appointment: ', error);
      alert('Error booking appointment. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-white">Calendario Condiviso</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full overflow-x-auto">
          <CalendarComponent 
            appointments={appointments} 
            onSelectSlot={handleSelectSlot}
            // Non passiamo onSelectEvent qui
          />
        </div>
        <div>
          <AppointmentForm 
            onSubmit={handleAddAppointment} 
            selectedDate={selectedDate}
            appointments={appointments}
          />
        </div>
      </div>
    </div>
  );
}