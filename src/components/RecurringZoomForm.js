import React, { useState } from 'react';
import { TrashIcon } from 'lucide-react';
import moment from 'moment';

const RecurringZoomForm = ({ onSubmit, isSubmitting, existingZooms, onDelete, isDeleting }) => {
  const [zoomData, setZoomData] = useState({
    title: '',
    dayOfWeek: '',
    time: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: ''
  });

  const daysOfWeek = [
    { value: '1', label: 'Lunedì' },
    { value: '2', label: 'Martedì' },
    { value: '3', label: 'Mercoledì' },
    { value: '4', label: 'Giovedì' },
    { value: '5', label: 'Venerdì' },
    { value: '6', label: 'Sabato' },
    { value: '0', label: 'Domenica' }
  ];

  const months = [
    { value: 1, label: 'Gennaio' },
    { value: 2, label: 'Febbraio' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Aprile' },
    { value: 5, label: 'Maggio' },
    { value: 6, label: 'Giugno' },
    { value: 7, label: 'Luglio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Settembre' },
    { value: 10, label: 'Ottobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Dicembre' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(zoomData);
  };

  const getDayLabel = (value) => {
    const day = daysOfWeek.find(d => d.value === value);
    return day ? day.label : '';
  };

  const getMonthLabel = (value) => {
    const month = months.find(m => m.value === value);
    return month ? month.label : '';
  };

  const handleSendNotification = async (zoomId, dateTime) => {
    try {
      await fetch('/api/send-telegram-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
        },
        body: JSON.stringify({ zoomId, dateTime }),
      });
      alert('Notifica inviata con successo!');
    } catch (error) {
      console.error('Errore durante l\'invio della notifica:', error);
      alert('Errore durante l\'invio della notifica. Riprova più tardi.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#0C1A0E] rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Aggiungi Zoom Ricorrente</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Titolo</label>
                <input
                  type="text"
                  value={zoomData.title}
                  onChange={(e) => setZoomData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="es. ZOOM PRESENTAZIONE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
                <select
                  value={zoomData.type}
                  onChange={(e) => setZoomData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleziona tipo</option>
                  <option value="PRESENTAZIONE">PRESENTAZIONE</option>
                  <option value="NETWORK">NETWORK</option>
                  <option value="FORMAZIONE">FORMAZIONE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Giorno della settimana</label>
                <select
                  value={zoomData.dayOfWeek}
                  onChange={(e) => setZoomData(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleziona giorno</option>
                  {daysOfWeek.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Orario</label>
                <input
                  type="time"
                  value={zoomData.time}
                  onChange={(e) => setZoomData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Mese</label>
                <select
                  value={zoomData.month}
                  onChange={(e) => setZoomData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Anno</label>
                <input
                  type="number"
                  value={zoomData.year}
                  onChange={(e) => setZoomData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C29022] text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? 'Creazione in corso...' : 'Crea Zoom Ricorrenti'}
            </button>
          </form>
        </div>
      </div>

      {/* Sezione zoom ricorrenti esistenti */}
      <div className="bg-[#0C1A0E] rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Zoom Ricorrenti Esistenti</h2>
          
          {existingZooms && existingZooms.length > 0 ? (
            <div className="space-y-4">
              {existingZooms.map((zoom) => (
                <div key={zoom.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-semibold">{zoom.title}</h3>
                      <p className="text-gray-300 text-sm">
                        Tipo: {zoom.type} | 
                        Giorno: {getDayLabel(zoom.dayOfWeek)} |
                        Orario: {zoom.time} |
                        {getMonthLabel(zoom.month)} {zoom.year}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete(zoom.id)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Visualizza giorni della Zoom ricorrente */}
                  <div className="mt-4 space-y-2">
                    {getRecurringDates(zoom).map((date) => (
                      <div key={date} className="flex justify-between items-center bg-gray-600 p-2 rounded">
                        <span className="text-gray-200 text-sm">{date.format('DD/MM/YYYY HH:mm')}</span>
                        <button
                          onClick={() => handleSendNotification(zoom.id, date.toISOString())}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
                        >
                          Invia
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Nessuna zoom ricorrente impostata.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Funzione per calcolare le date ricorrenti in un mese
const getRecurringDates = (zoom) => {
  const dates = [];
  const startDate = moment([zoom.year, zoom.month - 1, 1]);
  const endDate = moment(startDate).endOf('month');
  
  let currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate)) {
    if (currentDate.day().toString() === zoom.dayOfWeek) {
      const [hours, minutes] = zoom.time.split(':');
      currentDate = currentDate.clone().set({ hour: parseInt(hours), minute: parseInt(minutes) });
      dates.push(moment(currentDate));
    }
    currentDate.add(1, 'days');
  }
  
  return dates;
};

export default RecurringZoomForm;