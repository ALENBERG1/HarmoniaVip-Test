import React from 'react';
import { TrashIcon } from 'lucide-react';

const CampaignPriorityTable = ({ campaigns, onDeleteCampaign: onDelete, onUpdatePriority }) => {
  const allCampaigns = Array.isArray(campaigns) ? campaigns : [];
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
            <th className="px-6 py-3 text-sm">Tipo</th>
            <th className="px-6 py-3 text-sm">Budget</th>
            <th className="px-6 py-3 text-sm">Periodo</th>
            <th className="px-6 py-3 text-sm">Priorità</th>
            <th className="px-6 py-3 text-sm">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {allCampaigns.map((campaign) => (
            <tr key={campaign.id} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="px-6 py-4">{campaign.title}</td>
              <td className="px-6 py-4">{campaign.status}</td>
              <td className="px-6 py-4">{campaign.type}</td>
              <td className="px-6 py-4">€{campaign.budget}</td>
              <td className="px-6 py-4">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <select
                  value={campaign.priority || 'bassa'}
                  onChange={(e) => onUpdatePriority(campaign.id, e.target.value)}
                  className={`bg-gray-700 p-1 rounded ${priorityColors[campaign.priority || 'bassa']}`}
                >
                  <option value="bassa" className="text-green-500">Bassa</option>
                  <option value="media" className="text-yellow-500">Media</option>
                  <option value="alta" className="text-red-500">Alta</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(campaign.id)}
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

export default CampaignPriorityTable;