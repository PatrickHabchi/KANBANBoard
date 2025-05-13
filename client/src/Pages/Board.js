import React, { useEffect, useState } from 'react';
import useColumnsApi from '../Api/ColumnsApi';
import useTasksApi from '../Api/TasksApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AddCard from '../Components/BoardComponents/AddCard';
import '../Styles/pages/Board.scss';
import AddColumn from '../Components/BoardComponents/AddColumn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import useLogsApi from '../Api/LogsApi';
import DeletePopup from '../Components/BoardComponents/DeletePopup';
import TagSelector from '../Components/BoardComponents/TagSelector';
import { toast } from 'react-toastify';


function Board() {
  const { getAllColumns } = useColumnsApi();
  const { getAllTasks, updateTask, deleteTask } = useTasksApi();
  const { getLogs } = useLogsApi();
  const [columns, setColumns] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [draft, setDraft] = useState({ title: '', description: '' });
  const [draftTag, setDraftTag] = useState(null);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const cols = await getAllColumns();
        const tasks = await getAllTasks();
        const colsMap = {};
        cols.forEach(col => { colsMap[col.id] = { ...col, tasks: [] }; });
        tasks.forEach(task => {
          const col = colsMap[task.column_id];
          if (col) col.tasks.push(task);
        });
        const sorted = Object.values(colsMap)
          .sort((a, b) => a.position - b.position)
          .map(col => ({
            ...col,
            tasks: col.tasks.sort((a, b) => a.position - b.position)
          }));
        setColumns(sorted);
      } catch (error) {
        console.error('error fetching data', error);
      }
    };
    fetchBoard();
  }, []);

  const onDragEnd = async result => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newCols = columns.map(col => ({ ...col, tasks: Array.from(col.tasks) }));
    const sourceCol = newCols.find(col => String(col.id) === source.droppableId);
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    const destCol = newCols.find(col => String(col.id) === destination.droppableId);
    destCol.tasks.splice(destination.index, 0, movedTask);
    
    setColumns(newCols);

    const payload = { 
      ...movedTask, 
      column_id: destCol.id, 
      position: 
      destination.index + 1 
    };

    try { 
      await updateTask(draggableId, payload); 

      const latest = await getLogs();
      toast.success("Task edited successfully!");
      setLogs(latest);
    } catch (err) { 
      toast.success("Failed to edit task!");
      console.error('Error updating task position', err); 
    }
  };

  const handleAddCard = newTask => {
    setColumns(cols => cols.map(c => c.id === newTask.column_id ? { ...c, tasks: [...c.tasks, newTask] } : c));
  };

  const handleColumnAdded = newCol => {
    if (!newCol) return;
    setColumns(prev => [...prev, { ...newCol, tasks: [] }]);
  };

  const startEdit = task => {
    setEditingId(task.id);
    setDraft({ title: task.title, description: task.description || '' });
    setDraftTag(task.tag_id);  
  };

  const saveEdit = async task => {
    try {
      const updated = await updateTask(task.id, 
        { ...task, 
          title: draft.title, 
          description: draft.description,
          tag_id: draftTag 
        });

      setColumns(cols =>
         cols.map(c =>
           c.id === updated.column_id
             ? { ...c, tasks: c.tasks.map(t => (t.id === updated.id ? updated : t)) }
             : c
           )
        );

      setEditingId(null);
    } catch (e) {
      console.error('update failed', e);
    }
  };

  const cancelEdit = () => { 
    setEditingId(null); 
  };



  return (
    <>
    <div className='board-page container-fluid'>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='row gy-3'>
          {columns.map(col => (
            <div className='col-12 col-sm-6 col-md-3 col-lg-3' key={col.id}>
              <Droppable droppableId={String(col.id)}>
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className='column h-100 d-flex flex-column'>
                    <div className='column-header'>{col.title}</div>
                    <div className='mb-4'>
                      {col.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {prov => (
                            <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className='card'>
                              {editingId === task.id ? (
                                <>
                                  <input
                                    className='input mb-2'
                                    type='text'
                                    placeholder='Card Title'
                                    value={draft.title}
                                    onChange={e => setDraft({ ...draft, title: e.target.value })}
                                  />
                                  <textarea
                                    className='textarea'
                                    placeholder='Description (optional)'
                                    value={draft.description}
                                    onChange={e => setDraft({ ...draft, description: e.target.value })}
                                  />

                                   <TagSelector
                              value={draftTag}
                             onChange={setDraftTag}
                            />
                                  <div className='mt-2'>
                                    <button className='btn btn-success me-2' onClick={() => saveEdit(task)}>Save</button>
                                    <button className='btn ' onClick={cancelEdit}><FontAwesomeIcon icon={faX} /></button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className='title'>{task.title}</div>
                                  <div className='desc'>{task.description}</div>
                                  
                                  <div className="card-actions">
                                  <FontAwesomeIcon 
                                    icon={faPen} 
                                    className="edit-icon" 
                                    onClick={() => startEdit(task)} 
                                  />                  
                                  <FontAwesomeIcon 
                                    icon={faTrash} 
                                    className="delete-icon" 
                                    onClick={() => {setOpenDeletePopup(true); setToDelete(task)}} 
                                  />
                                </div>                       
                                </>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                    <div className='d-flex justify-content-start mt-auto'>
                      <AddCard columnId={col.id} onAdd={handleAddCard} />
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
          <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
            <div className='d-flex'>
              <AddColumn onAdd={handleColumnAdded} />
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>

    <DeletePopup 
      isOpen={openDeletePopup} 
      setIsOpen={setOpenDeletePopup} 
      taskTitle={toDelete?.title} 
      taskId={toDelete?.id} 
      setColumns={setColumns}
    /> 
</>
    
  );
}

export default Board;