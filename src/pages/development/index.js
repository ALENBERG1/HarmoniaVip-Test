// pages/development/index.js
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskPriorityTable from '../../components/Development/TaskPriorityTable';
import Loader from '../../components/Loader';  // Importa il Loader

const TASK_STATUSES = ['To Do', 'In Progress', 'Review', 'Done'];

export default function Development() {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    assignee: '', 
    deadline: '',
    priority: 'bassa'
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'development_tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = {};
      TASK_STATUSES.forEach(status => tasksData[status] = []);
      
      snapshot.docs.forEach(doc => {
        const task = { id: doc.id, ...doc.data() };
        const status = task.status || 'To Do';
        tasksData[status].push(task);
      });

      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'development_tasks'), {
        ...newTask,
        status: 'To Do',
        createdAt: new Date(),
        createdBy: user.telegramId,
        creatorName: user.username || user.firstName,
        priority: newTask.priority || 'bassa'
      });

      setNewTask({ title: '', description: '', assignee: '', deadline: '', priority: 'bassa' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      await updateDoc(doc(db, 'development_tasks', draggableId), {
        status: destination.droppableId
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'development_tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdatePriority = async (taskId, priority) => {
    try {
      await updateDoc(doc(db, 'development_tasks', taskId), {
        priority
      });
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  if (loading) {
    return <Loader />;  // Sostituisce "Caricamento..." con il loader trasparente
  }

  if (!user || (user.status !== 'Sviluppo' && user.telegramId !== '402570623' && user.telegramId !== '6868138640')) {
    return <Layout><div>Accesso non autorizzato</div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0c0c0c] text-white">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl text-white font-bold mb-8">Dashboard Sviluppo</h1>
          
          {/* Form per nuovo task */}
          <form onSubmit={handleAddTask} className="mb-8 bg-[#0C1A0E] p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Titolo</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-gray-700 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Assegnato a</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full bg-gray-700 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full bg-gray-700 p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Priorità</label>
                <select
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full bg-gray-700 p-2 rounded"
                >
                  <option value="bassa">Bassa</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Descrizione</label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-gray-700 p-2 rounded"
                  rows="3"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-[#C29022] px-4 py-2 rounded"
            >
              Aggiungi Task
            </button>
          </form>

          {/* Kanban Board - Sezione aggiornata */}
<DragDropContext onDragEnd={handleDragEnd}>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {TASK_STATUSES.map(status => (
      <div key={status} className="bg-[#0C1A0E] p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">{status}</h3>
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[200px]"
            >
              {tasks[status]?.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-700 p-4 mb-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      {/* Header con Titolo */}
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium truncate">{task.title}</h4>
                        <span className={`text-sm px-2 py-1 rounded ${
                          task.priority === 'alta' ? 'bg-red-600' :
                          task.priority === 'media' ? 'bg-yellow-600' : 
                          'bg-green-600'
                        }`}>
                          {task.priority || 'bassa'}
                        </span>
                      </div>
                      
                      {/* Deadline */}
                      {task.deadline && (
                        <div className="text-sm text-gray-400 mb-2">
                          Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      )}
                      
                      {/* Pulsante Elimina */}
                      <div className="flex justify-end pt-2 border-t border-gray-600">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
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
          )}
        </Droppable>
      </div>
    ))}
  </div>
</DragDropContext>

          {/* Task Table */}
          <TaskPriorityTable 
            tasks={tasks} 
            onDelete={handleDeleteTask}
            onUpdatePriority={handleUpdatePriority}
          />
        </div>
      </div>
    </Layout>
  );
}