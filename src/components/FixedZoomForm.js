import React, { useState } from 'react';
import { TrashIcon } from 'lucide-react';
import moment from 'moment';

const FixedZoomForm = ({ onSubmit, isSubmitting }) => {
  const [zoomData, setZoomData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'PRESENTAZIONE'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(zoomData);
  };

  return (
    <div className="bg-[#0C1A0E] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Aggiungi Zoom Fisso per Tutti gli Utenti</h2>
        
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
                placeholder="es. ZOOM PRESENTAZIONE UFFICIALE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Data</label>
              <input
                type="date"
                value={zoomData.date}
                onChange={(e) => setZoomData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C29022] text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors duration-200"
          >
            {isSubmitting ? 'Creazione in corso...' : 'Crea Zoom Fisso'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FixedZoomForm;