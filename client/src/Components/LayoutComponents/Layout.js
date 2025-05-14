
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LogsPopup from './LogsPopup';


function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="layout">
        <div className="home">KANBAN Board</div>

        <div className='logs'>
            <button className='logs-button' onClick={() => setIsOpen(true)}>Logs</button>
        </div>
      </div>
      <div>
        <Outlet />
      </div>

        <LogsPopup isOpen={isOpen} setIsOpen={setIsOpen}/>

    </>
  );
}

export default Layout;
