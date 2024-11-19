import React, { useState } from 'react';

const TelegramMessageForm = ({ users }) => {
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Inserisci un messaggio da inviare');
      return;
    }

    try {
      for (const userId of selectedUsers) {
        const user = users.find(u => u.id === userId);
        if (user && user.telegramId) {
          await fetch('/api/send-telegram-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
            },
            body: JSON.stringify({ chatId: user.telegramId, message }),
          });
        }
      }
      alert('Messaggio inviato con successo!');
      setMessage('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Invia Messaggio su Telegram</h2>
      <textarea
        placeholder="Scrivi il tuo messaggio qui..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-gray-700 text-white p-2 rounded mb-4"
        rows="4"
      />
      <button onClick={handleSendMessage} className="bg-blue-600 text-white py-2 px-4 rounded">Invia Messaggio</button>
    </div>
  );
};

export default TelegramMessageForm;