import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/it';

moment.locale('it');

export default function CalendarComponent({ appointments, onSelectSlot, onSelectEvent }) {
  const [currentDate, setCurrentDate] = useState(moment());
  const [displayDays, setDisplayDays] = useState([]);

  useEffect(() => {
    updateDisplayDays();
  }, [currentDate]);

  const updateDisplayDays = () => {
    const startDate = currentDate.clone().startOf('day');
    const endDate = startDate.clone().add(30, 'days');
    const tempDays = [];

    for (let day = startDate; day.isBefore(endDate); day = day.clone().add(1, 'd')) {
      tempDays.push(day.clone());
    }

    setDisplayDays(tempDays);
  };

  const nextMonth = () => setCurrentDate(currentDate.clone().add(1, 'month'));
  const prevMonth = () => setCurrentDate(currentDate.clone().subtract(1, 'month'));

  const getDayAppointments = (day) => {
    return appointments.filter(appointment => 
      moment(appointment.date).isSame(day, 'day')
    );
  };

  return (
    <div className="bg-[#0C1A0E] p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-white">&lt; Precedente</button>
        <h2 className="text-white text-xl">{currentDate.format('MMMM YYYY')}</h2>
        <button onClick={nextMonth} className="text-white">Successivo &gt;</button>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {displayDays.map(day => (
          <div key={day.format('YYYY-MM-DD')} className="bg-gray-700 p-2 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-bold">{day.format('dddd, D MMMM')}</span>
              <button 
                onClick={() => onSelectSlot({ start: day.toDate() })}
                className="bg-[#C29022] text-white px-2 py-1 rounded text-sm"
              >
                + Aggiungi
              </button>
            </div>
            <div className="space-y-1">
              {getDayAppointments(day).map(appointment => (
                <div 
                  key={appointment.id} 
                  onClick={() => onSelectEvent ? onSelectEvent(appointment) : null}
                  className="bg-[#0C1A0E] text-white p-1 rounded cursor-pointer text-sm"
                >
                  {moment(appointment.date).format('HH:mm')} - {appointment.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}