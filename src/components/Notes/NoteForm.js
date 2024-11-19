import { useState } from 'react';

export default function NoteForm({ onSubmit, initialNote = null }) {
  const [content, setContent] = useState(initialNote ? initialNote.content : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ content });
    if (!initialNote) {
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          Contenuto
        </label>
        <textarea
          name="content"
          id="content"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md bg-gray-800 text-gray-300"
        ></textarea>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#C29022] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialNote ? 'Aggiorna Nota' : 'Aggiungi Nota'}
      </button>
    </form>
  );
}