import React, { useState } from 'react';
import '../Styles/pages/AddColumn.scss'

function AddColumn() {
    const [addColumn, setAddColumn] = useState(false);

    const handleAddColumn = () => {
        setAddColumn(true)
    }
  return (
        addColumn ? (
            <>
            </>
        ) : (
            <>   
            <div className='add-column' onClick={handleAddColumn}>
                + Add New Column
            </div>
            </>
        )
  )
}

export default AddColumn