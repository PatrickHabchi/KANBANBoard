// client/src/Pages/Board.js
import React, { useEffect, useState } from 'react';
import useColumnsApi from '../Api/ColumnsApi';
import useTasksApi   from '../Api/TasksApi';
import useLogsApi    from '../Api/LogsApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AddCard       from '../Components/BoardComponents/AddCard';
import AddColumn     from '../Components/BoardComponents/AddColumn';
import DeletePopup   from '../Components/BoardComponents/DeletePopup';
import TagSelector   from '../Components/BoardComponents/TagSelector';
import '../Styles/pages/Board.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export default function Board() {
  const { getAllColumns, deleteColumn } = useColumnsApi();
  const { getAllTasks, updateTask, deleteTask } = useTasksApi();
  const { getLogs } = useLogsApi();

  const [columns, setColumns]       = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [draft, setDraft]           = useState({ title: '', description: '' });
  const [draftTag, setDraftTag] = useState("");
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemType: null,   
    item: null      
  });

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const cols  = await getAllColumns();
        const tasks = await getAllTasks();
        const map   = {};
        cols.forEach(c => map[c.id] = { ...c, tasks: [] });
        tasks.forEach(t => map[t.column_id]?.tasks.push(t));
        const sorted = Object.values(map)
          .sort((a,b) => a.position - b.position)
          .map(c => ({
            ...c,
            tasks: c.tasks.sort((x,y) => x.position - y.position)
          }));
        setColumns(sorted);
      } catch (e) {
        console.error('error fetching board', e);
      }
    };
    fetchBoard();
  }, []);

  // handle both column- and task-dnd
  const onDragEnd = async result => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    // --- COLUMN DND ---
    if (type === 'COLUMN') {
      if (source.index === destination.index) return;
      const reordered = Array.from(columns);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setColumns(reordered);
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const newCols = columns.map(c => ({ ...c, tasks: [...c.tasks] }));
    const fromCol = newCols.find(c => String(c.id) === source.droppableId);
    const [movedTask] = fromCol.tasks.splice(source.index, 1);
    const toCol = newCols.find(c => String(c.id) === destination.droppableId);
    toCol.tasks.splice(destination.index, 0, movedTask);
    setColumns(newCols);

    try {
      await updateTask(draggableId, {
        ...movedTask,
        column_id: toCol.id,
        position: destination.index + 1
      });
      const latest = await getLogs();
    } catch (err) {
      toast.error('Failed to move task');
      console.error(err);
    }
  };

  const handleAddCard = newTask => {
    setColumns(cols =>
      cols.map(c =>
        c.id === newTask.column_id
          ? { ...c, tasks: [...c.tasks, newTask] }
          : c
      )
    );
  };

  const handleColumnAdded = newCol => {
    if (!newCol) return;
    setColumns(prev => [...prev, { ...newCol, tasks: [] }]);
  };

  const startEdit = task => {
    setEditingId(task.id);
    setDraft({ title: task.title, description: task.description || '' });
    setDraftTag(task.tag_id || null);
  };

  const saveEdit = async task => {
    try {
      const updated = await updateTask(task.id, {
        ...task,
        title:       draft.title,
        description: draft.description,
        tag_id:      draftTag
      });
      if (!updated) {
        toast.error('Task update failed');
        return;
      }
      setColumns(cols =>
        cols.map(c =>
          c.id === updated.column_id
            ? {
                ...c,
                tasks: c.tasks.map(t => t.id === updated.id ? updated : t)
              }
            : c
        )
      );
      toast.success('Task updated');
      setEditingId(null);
    } catch (e) {
      console.error('saveEdit error', e);
      toast.error('Error saving task');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleConfirmDelete = async () => {
    const { itemType, item } = deleteModal;
  
    try {
      if (itemType === 'task') {
        await deleteTask(item.id);
        setColumns(cols =>
          cols.map(c => ({ ...c, tasks: c.tasks.filter(t => t.id !== item.id) }))
        );
      } else {
        await deleteColumn(item.id);
        setColumns(cols => cols.filter(c => c.id !== item.id));
      }
      toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete ${itemType}`);
    } finally {
      setDeleteModal({ isOpen: false, itemType: null, item: null });
    }
  };
  

  return (
    <>
      <div className="board-page container-fluid">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="COLUMN"
          >
            {provCols => (
              <div
                className="row gy-3 d-flex flex-nowrap overflow-auto "
                ref={provCols.innerRef}
                {...provCols.droppableProps}
              >
                {columns.map((col, idx) => (
                  <Draggable
                    draggableId={`column-${col.id}`}
                    index={idx}
                    key={col.id}
                  >
                    {provCol => (
                      <div
                        className="col-12 col-sm-6 col-md-3 col-lg-3 column-bottom"
                        ref={provCol.innerRef}
                        {...provCol.draggableProps}
                        {...provCol.dragHandleProps}
                      >
                        <Droppable
                          droppableId={String(col.id)}
                          type="TASK"
                        >
                          {provTasks => (
                            <div
                              className="column h-100 d-flex flex-column"
                              ref={provTasks.innerRef}
                              {...provTasks.droppableProps}
                            >
                              <div className="column-header">
                                {col.title}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="delete-icon"
                                  onClick={() => {
                                    setDeleteModal({
                                      isOpen: true,
                                      itemType: 'column',
                                      item: col
                                    })
                                    setOpenDeletePopup(true);
                                  }}
                                />
                              </div>
                              <div className="mb-4">
                                {col.tasks.map((task, i) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={String(task.id)}
                                    index={i}
                                  >
                                    {provTask => (
                                      <div
                                        className="card"
                                        ref={provTask.innerRef}
                                        {...provTask.draggableProps}
                                        {...provTask.dragHandleProps}
                                      >
                                        {editingId === task.id ? (
                                          <>
                                            <input
                                              className="input mb-2"
                                              value={draft.title}
                                              onChange={e =>
                                                setDraft(d => ({
                                                  ...d,
                                                  title: e.target.value
                                                }))
                                              }
                                            />
                                            <textarea
                                              className="textarea mb-2"
                                              value={draft.description}
                                              onChange={e =>
                                                setDraft(d => ({
                                                  ...d,
                                                  description: e.target.value
                                                }))
                                              }
                                            />
                                            <TagSelector
                                              value={draftTag}
                                              onChange={setDraftTag}
                                            />
                                            <div className="mt-2 d-flex gap-2">
                                              <button
                                                className="btn btn-success"
                                                onClick={() => saveEdit(task)}
                                              >
                                                Save
                                              </button>
                                              <button
                                                className="btn btn-secondary"
                                                onClick={cancelEdit}
                                              >
                                                <FontAwesomeIcon icon={faX} />
                                              </button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="title">
                                              {task.title}
                                            </div>
                                            {task.tag_name && (
                                              <span className="tag-badge">
                                                {task.tag_name}
                                              </span>
                                            )}
                                            <div className="desc">
                                              {task.description}
                                            </div>
                                            <div className="card-actions d-flex gap-2">
                                              <FontAwesomeIcon
                                                icon={faPen}
                                                className="edit-icon"
                                                onClick={() => startEdit(task)}
                                              />
                                              <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => {
                                                  setDeleteModal({
                                                    isOpen: true,
                                                    itemType: 'task',
                                                    item: task
                                                  });
                                                  setOpenDeletePopup(true);
                                                }}
                                              />
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provTasks.placeholder}
                              </div>
                              <div className="mt-auto">
                                <AddCard
                                  columnId={col.id}
                                  onAdd={handleAddCard}
                                />
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provCols.placeholder}
                <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                  <AddColumn onAdd={handleColumnAdded} />
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <DeletePopup
        isOpen={deleteModal.isOpen}
        itemType={deleteModal.itemType}
        itemTitle={deleteModal.item?.title}
        onCancel={() => setDeleteModal({ isOpen: false, itemType: null, item: null })}
        onConfirm={handleConfirmDelete}
      />

    </>
  );
}
