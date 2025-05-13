import React from 'react'
import { Modal } from "react-bootstrap";

function LogsPopup({ isOpen, setIsOpen }) {
  return (
    <div>
        <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Body>
                <div className="logs-popup">
                    <div className="header">
                        Logs History
                    </div>

                    <div className='logs-container'>
                        
                    </div>
                </div>  
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default LogsPopup