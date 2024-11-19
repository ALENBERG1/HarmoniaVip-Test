import { useState, useEffect } from 'react';
import moment from 'moment';
import MemberSelect from './MemberSelect';

export default function AppointmentForm({ onSubmit, selectedDate, appointments, onDateChange, isTimeSlotAvailable }) {
  const [appointment, setAppointment] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    members: []
  });
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      setAppointment(prev => ({
        ...prev,
        date: formattedDate,
        time: ''
      }));
      updateAvailableSlots(formattedDate, appointment.members);
    }
  }, [selectedDate, appointments]);

  useEffect(() => {
    if (appointment.date && appointment.time) {
      const presetDescription = `Ci vediamo il giorno ${moment(appointment.date).format('DD/MM/YYYY')} alle ore ${appointment.time} qui:\n\nhttps://us06web.zoom.us/j/7966816615`;
      setAppointment(prev => ({ ...prev, description: presetDescription }));
    }
  }, [appointment.date, appointment.time]);

  const updateAvailableSlots = (date, members) => {
    const slots = [];
    for (let hour = 8; hour <= 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (hour === 24 && minute > 0) break; // Stop at 24:00
        if (isTimeSlotAvailable(date, time, members)) {
          slots.push(time);
        }
      }
    }
    setAvailableSlots(slots);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({ ...prev, [name]: value }));

    if (name === 'date') {
      updateAvailableSlots(value, appointment.members);
      onDateChange(new Date(value));
    }
  };

  const handleMemberChange = (selectedMembers) => {
    setAppointment(prev => ({ ...prev, members: selectedMembers }));
    updateAvailableSlots(appointment.date, selectedMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment);
    setAppointment({ title: '', date: '', time: '', description: '', members: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0C1A0E] shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="title">
          Titolo
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
          id="title"
          type="text"
          name="title"
          value={appointment.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="date">
          Data
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
          id="date"
          type="date"
          name="date"
          value={appointment.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="members">
          Membri
        </label>
        <MemberSelect 
          onChange={handleMemberChange}
          selectedMembers={appointment.members}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="time">
          Ora
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
          id="time"
          name="time"
          value={appointment.time}
          onChange={handleChange}
          required
        >
          <option value="">Seleziona un orario</option>
          {availableSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="description">
          Descrizione
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
          id="description"
          name="description"
          value={appointment.description}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-[#C29022] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Aggiungi Appuntamento
        </button>
      </div>
    </form>
  );
}