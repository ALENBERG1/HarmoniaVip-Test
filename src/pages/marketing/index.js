import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CampaignPriorityTable from '../../components/Marketing/CampaignPriorityTable';
import Loader from '../../components/Loader';  // Importa il Loader

const CAMPAIGN_STATUS = ['Pianificazione', 'In Corso', 'Review', 'Completata'];
const CAMPAIGN_TYPES = ['Social Media', 'Email', 'Content', 'Event', 'Advertising'];

export default function Marketing() {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsByStatus, setCampaignsByStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    type: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    target: '',
    kpis: '',
    status: 'Pianificazione',
    priority: 'bassa'
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'marketing_campaigns'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate?.() || doc.data().startDate,
        endDate: doc.data().endDate?.toDate?.() || doc.data().endDate,
      }));

      setCampaigns(campaignsData);

      const organized = CAMPAIGN_STATUS.reduce((acc, status) => {
        acc[status] = campaignsData.filter(campaign => campaign.status === status);
        return acc;
      }, {});
      
      setCampaignsByStatus(organized);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'marketing_campaigns'), {
        ...newCampaign,
        createdAt: new Date(),
        createdBy: user.telegramId,
        creatorName: user.username || user.firstName,
        priority: newCampaign.priority || 'bassa'
      });

      setNewCampaign({
        title: '',
        type: '',
        description: '',
        budget: '',
        startDate: '',
        endDate: '',
        target: '',
        kpis: '',
        status: 'Pianificazione',
        priority: 'bassa'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding campaign:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      await updateDoc(doc(db, 'marketing_campaigns', draggableId), {
        status: destination.droppableId
      });
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await deleteDoc(doc(db, 'marketing_campaigns', campaignId));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleUpdatePriority = async (campaignId, priority) => {
    try {
      await updateDoc(doc(db, 'marketing_campaigns', campaignId), {
        priority
      });
    } catch (error) {
      console.error('Error updating campaign priority:', error);
    }
  };

  if (loading) {
    return <Loader />;  // Sostituisce "Caricamento..." con il loader trasparente
  }

  if (!user || (user.status !== 'Marketing' && user.telegramId !== '402570623' && user.telegramId !== '6868138640')) {
    return <Layout><div className="text-white">Accesso non autorizzato</div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0c0c0c] text-white">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl text-white font-bold">Marketing Dashboard</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#C29022] px-4 py-2 rounded"
            >
              {showAddForm ? 'Chiudi' : 'Nuova Campagna'}
            </button>
          </div>

          {showAddForm && (
            <div className="mb-8 bg-[#0C1A0E] p-6 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Titolo Campagna</label>
                    <input
                      type="text"
                      value={newCampaign.title}
                      onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Tipo Campagna</label>
                    <select
                      value={newCampaign.type}
                      onChange={e => setNewCampaign({...newCampaign, type: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      required
                    >
                      <option value="">Seleziona tipo</option>
                      {CAMPAIGN_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Budget</label>
                    <input
                      type="number"
                      value={newCampaign.budget}
                      onChange={e => setNewCampaign({...newCampaign, budget: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="€"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Target</label>
                    <input
                      type="text"
                      value={newCampaign.target}
                      onChange={e => setNewCampaign({...newCampaign, target: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="Target audience"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Data Inizio</label>
                    <input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={e => setNewCampaign({...newCampaign, startDate: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Data Fine</label>
                    <input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={e => setNewCampaign({...newCampaign, endDate: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Priorità</label>
                    <select
                      value={newCampaign.priority}
                      onChange={e => setNewCampaign({...newCampaign, priority: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      required
                    >
                      <option value="bassa">Bassa</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2">KPIs</label>
                    <input
                      type="text"
                      value={newCampaign.kpis}
                      onChange={e => setNewCampaign({...newCampaign, kpis: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="Obiettivi e metriche"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2">Descrizione</label>
                    <textarea
                      value={newCampaign.description}
                      onChange={e => setNewCampaign({...newCampaign, description: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      rows="3"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-[#C29022] px-4 py-2 rounded hover:bg-bg-[#C29022]"
                >
                  Crea Campagna
                </button>
              </form>
            </div>
          )}

<DragDropContext onDragEnd={handleDragEnd}>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {CAMPAIGN_STATUS.map(status => (
      <Droppable key={status} droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-[#0C1A0E] p-4 rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-4 text-center text-white">{status}</h2>
            <div className="space-y-4">
              {campaignsByStatus[status]?.map((campaign, index) => (
                <Draggable
                  key={campaign.id}
                  draggableId={campaign.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-700 p-4 rounded hover:bg-gray-600 transition-colors"
                    >
                      {/* Header con Titolo e Priorità */}
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium truncate">{campaign.title}</h3>
                        <span className={`text-sm px-2 py-1 rounded ${
                          campaign.priority === 'alta' ? 'bg-red-600' :
                          campaign.priority === 'media' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}>
                          {campaign.priority}
                        </span>
                      </div>
                      
                      {/* Budget */}
                      <div className="text-sm text-gray-300 mb-2">
                        Budget: €{campaign.budget || '0'}
                      </div>
                      
                      {/* Periodo */}
                      <div className="text-sm text-gray-400 mb-3">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                      
                      {/* Footer con pulsante elimina */}
                      <div className="flex justify-end pt-2 border-t border-gray-600">
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="text-xs bg-red-600/50 px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    ))}
  </div>
</DragDropContext>

          <div className="mt-8">
            <h2 className="text-2xl text-white font-semibold mb-4">Priorità Campagne</h2>
            <CampaignPriorityTable
              campaigns={campaigns}
              onUpdatePriority={handleUpdatePriority}
              onDeleteCampaign={handleDeleteCampaign}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}