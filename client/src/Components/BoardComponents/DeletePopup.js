// client/src/Components/BoardComponents/DeletePopup.js
import React from 'react';
import { Modal } from 'react-bootstrap';
import useTasksApi from '../../Api/TasksApi';
import useLogsApi from '../../Api/LogsApi';
import { toast } from 'react-toastify';

function DeletePopup({ isOpen, setIsOpen, taskTitle, taskId, setColumns }) {

      const { deleteTask } = useTasksApi();
      const { getLogs } = useLogsApi();

      const handleDelete = async () => {
        try {
          await deleteTask(taskId);
          await getLogs();
        toast.success("Task deleted successfully!");
          
          setColumns(cols =>
            cols.map(c => ({
              ...c,
             tasks: c.tasks.filter(t => t.id !== taskId)
            }))
          );

          setIsOpen(false);
        } catch (err) {
          toast.error("Failed to delete task");

          console.error("Error deleting task", err);
        }
    };

  return (
    <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
      <Modal.Body>
        <div className="delete-popup">
          <div className="header mb-4">Delete Task</div>
          <div className="delete-container">
            <div className="title">
              {`Are you sure you want to delete "${taskTitle}"?`}
            </div>
            <div className="buttons mt-4 d-flex gap-2">
              <button
                className="btn btn-secondary w-50"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger w-50"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeletePopup;
