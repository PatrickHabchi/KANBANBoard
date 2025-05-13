import React from 'react';
import { Modal } from "react-bootstrap";

function DeletePopup({ isOpen, setIsOpen, taskTitle, onDelete }) {
    return (
        <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Body>
                <div className="delete-popup">
                    <div className="header mb-4">
                        Delete Task
                    </div>

                    <div className='delete-container'>
                        <div className='title'>
                            {`Are you sure do you want to delete ${taskTitle} task?`}
                        </div>
                        <div className='buttons mt-4'>
                            <div className='cancel-button'>
                                <button className='cancel-btn'>
                                    Cancel
                                </button>
                            </div>
                            <div className='delete-button'>
                                <button className='delete-btn' onClick={onDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeletePopup