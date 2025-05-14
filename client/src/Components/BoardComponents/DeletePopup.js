import React from 'react';
import { Modal } from 'react-bootstrap';
import useTasksApi from '../../Api/TasksApi';
import useLogsApi from '../../Api/LogsApi';
import { toast } from 'react-toastify';
import useColumnsApi from '../../Api/ColumnsApi';

function DeletePopup({ isOpen,
  itemType,
  itemTitle,
  onCancel,
  onConfirm }) {

    const prettyType = itemType === 'task' ? 'Task' : 'Column';

  return (
    <Modal centered show={isOpen} onHide={onCancel}>
      <Modal.Body>
        <div className="delete-popup">
          <div className="header mb-4">Delete {prettyType}</div>
          <div className="delete-container">
            <div className="title">
              Are you sure you want to delete {itemTitle}{' '}{prettyType}?
            </div>
            <div className="buttons mt-4 d-flex gap-2">
              <button
                className="btn btn-secondary w-50"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger w-50"
                onClick={onConfirm}
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
