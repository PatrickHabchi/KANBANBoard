import React, { useEffect, useState } from 'react'
import useColumnsApi from '../Api/ColumnsApi';
import useTasksApi from '../Api/TasksApi';
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';
import AddCard from '../Components/AddCard';
import '../Styles/pages/Board.scss';
import AddColumn from '../Components/AddColumn';

function Board() {
  const { getAllColumns } = useColumnsApi();
  const { getAllTasks, updateTask } = useTasksApi();

  const [columns, setColumns] = useState([]);
  
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const cols = await getAllColumns();
        const tasks = await getAllTasks();
        console.log(Array.isArray(tasks), tasks);
        const colsMap = {};
        cols.forEach(col => {
          colsMap[col.id] = { ...col, tasks: [] };
        });

        tasks.forEach(task => {
          const col = colsMap[task.column_id];
          if (col) col.tasks.push(task);
        })

        // sort columns by position
        const sorted = Object.values(colsMap)
          .sort((a, b) => a.position - b.position)
          .map(col => ({
            ...col,
            tasks: col.tasks.sort((t1, t2) => t1.position - t2.position)
          }));

        setColumns(sorted);

      } catch (error) {
        console.error("error fetching data", error);
      }
    }
    fetchBoard();
  }, [])

  const onDragEnd = async result => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const newCols = columns.map(col => ({
      ...col,
      tasks: Array.from(col.tasks)
    }));

    const sourceCol = newCols.find(col => String(col.id) === source.droppableId);
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);

    const destCol = newCols.find(col => String(col.id) === destination.droppableId);
    destCol.tasks.splice(destination.index, 0, movedTask);

    setColumns(newCols);

    const payload = {
      ...movedTask,
      column_id: destCol.id,
      position: destination.index + 1
    }

    try {
      await updateTask(draggableId, payload);
    } catch (err) {
      console.error('Error updating task position', err);
    }
  };

  const handleAddCard = (newTask) => {
    setColumns(cols =>
      cols.map(c =>
        c.id === newTask.column_id
          ? { ...c, tasks: [...c.tasks, newTask] }
          : c
      ),
    );
  };

   return (
    <div className="board-page">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map(col => (
          <Droppable droppableId={String(col.id)} key={col.id}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='column'
              >
                <div className='column-header'>
                  {col.title}
                </div>

                <div className='mb-4'>
                  {col.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {prov => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className='card'
                        >
                          <div className='title'>{task.title}</div>
                          {task.description && (
                            <div className='desc'>
                              {task.description}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>

                {provided.placeholder}

                <div className='mt-auto'>
                  <AddCard columnId={col.id} onAdd={handleAddCard} />
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      <AddColumn />
    </div>
  );
};

export default Board;