import React, { useEffect } from 'react'
import { Modal } from "react-bootstrap";
import { useSelector } from 'react-redux';
import useLogsApi from '../../Api/LogsApi';

function LogsPopup({ isOpen, setIsOpen }) {
    const logs = useSelector(state => state.appData.logs);

    console.log(logs);
    
  return (
    <div>
        <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Body>
                <div className="logs-popup">
                    <div className="header">
                        Logs History
                    </div>

                    <div className='logs-container'>
                         {Array.isArray(logs) && logs.length > 0 ? (
                            logs.map(log => (
                                <div className="log-item mb-2" key={log.id}>
                                <div className="log-action">{log.action}</div>        
                            </div>
                            ))
                            ) : (
                            <div className="no-logs">No logs available</div>
                            )}
                    </div>
                </div>  
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default LogsPopup