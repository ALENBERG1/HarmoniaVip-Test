import React from 'react';
import { TrashIcon } from 'lucide-react';

const TaskPriorityTable = ({ tasks, onDelete, onUpdatePriority }) => {
  const allTasks = Object.values(tasks).flat();
  const priorityColors = {
    alta: 'text-red-500',
    media: 'text-yellow-500',
    bassa: 'text-green-500'
  };

  return (
    <div className="overflow-x-auto mt-8">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-6 py-3 text-sm">Titolo</th>
            <th className="px-6 py-3 text-sm">Status</th>
            <th className="px-6 py-3 text-sm">Assegnato a</th>
            <th className="px-6 py-3 text-sm">Deadline</th>
            <th className="px-6 py-3 text-sm">Priorità</th>
            <th className="px-6 py-3 text-sm">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((task) => (
            <tr key={task.id} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="px-6 py-4">{task.title}</td>
              <td className="px-6 py-4">{task.status}</td>
              <td className="px-6 py-4">{task.assignee}</td>
              <td className="px-6 py-4">
                {task.deadline && new Date(task.deadline).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <select
                  value={task.priority || 'bassa'}
                  onChange={(e) => onUpdatePriority(task.id, e.target.value)}
                  className={`bg-gray-700 p-1 rounded ${priorityColors[task.priority || 'bassa']}`}
                >
                  <option value="bassa" className="text-green-500">Bassa</option>
                  <option value="media" className="text-yellow-500">Media</option>
                  <option value="alta" className="text-red-500">Alta</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskPriorityTable;