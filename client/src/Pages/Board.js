import React, { useEffect, useState } from 'react'
import useColumnsApi from '../Api/ColumnsApi';
import useTasksApi from '../Api/TasksApi';
import {
    DragDropContext,
    Droppable,
    Draggable
  } from '@hello-pangea/dnd';
import api from '../Api/axios';

function Board() {
    const { getAllColumns } = useColumnsApi();
    const { getAllTasks } = useTasksApi();

    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const cols = await getAllColumns();
                const tasks = await getAllTasks();
                console.log(Array.isArray(tasks), tasks); 
                const colsMap = {};
                cols.forEach(col => {
                    colsMap[col.id] = { ...col, tasks: []};
                });

                tasks.forEach(task => {
                    const col = colsMap[task.column_id];
                    if (col) col.tasks.push(task);
                })

                // sort columns by position
                const sorted = Object.values(colsMap)
                .sort(col => ({
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
    
        // No change
        if (
          source.droppableId === destination.droppableId &&
          source.index === destination.index
        ) return;
    
        // Create a deep copy of columns state
        const newCols = columns.map(col => ({
          ...col,
          tasks: Array.from(col.tasks)
        }));
    
        // Remove task from source
        const sourceCol = newCols.find(col => String(col.id) === source.droppableId);
        const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    
        // Insert into destination
        const destCol = newCols.find(col => String(col.id) === destination.droppableId);
        destCol.tasks.splice(destination.index, 0, movedTask);
    
        // Update local state for instant UI feedback
        setColumns(newCols);
    
        // Send update to backend
        try {
          await api.put(`/tasks/${draggableId}`, {
            ...movedTask,
            column_id: destCol.id,
            position: destination.index + 1
          });
        } catch (err) {
          console.error('Error updating task position', err);
        }
      };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map(col => (
          <Droppable droppableId={String(col.id)} key={col.id}>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: '#f7f7f7',
                  borderRadius: 4,
                  padding: 8,
                  width: 250,
                  minHeight: 500
                }}
              >
                <h3 style={{ margin: '0 0 8px' }}>{col.title}</h3>
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
                        style={{
                          userSelect: 'none',
                          padding: 8,
                          margin: '0 0 8px 0',
                          background: '#ffffff',
                          borderRadius: 4,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          ...prov.draggableProps.style
                        }}
                      >
                        <strong>{task.title}</strong>
                        <p style={{ margin: '4px 0 0', fontSize: 14 }}>
                          {task.description}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default Board;