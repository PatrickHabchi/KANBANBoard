import React, { useState } from "react";
import useColumnsApi from "../Api/ColumnsApi";
import "../Styles/pages/AddColumn.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function AddColumn({ onAdd }) {           
  const [showForm, setShowForm]   = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const [error, setError] = useState({});

  const { createColumn } = useColumnsApi();

  const reset = () => {
    setColumnTitle("");
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (validationForm()) {
        try {
          const newColumn = await createColumn(columnTitle); 
          onAdd?.(newColumn);           
          reset();
        } catch (err) {
          console.error("Error creating column:", err);
        }
    }
  };


  const validationForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!columnTitle.trim()) {
      newErrors.columnTitle = "Column Title is required";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  }
  

  return (
    <div className="add-column">
        {showForm ? (
        <div className="create-column">
          <input
            className="input mb-2"
            placeholder="Column title"
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
          />
          {error.columnTitle && (<div className='error'>{error.columnTitle}</div>)}
    
    <div className="d-flex gap-1">
        <div className="button">
         <button onClick={handleSubmit} className="btn btn-success w-100 ml-1">Add</button>
        </div>
        <div className="button">
        <button
          type="button"
          onClick={() => {setShowForm(false); setError({})}}
          className="btn"
        >
          <FontAwesomeIcon icon={faX}/>
        </button>
        </div>
      </div>
        </div>
        ) : (
            <div className="add-new-column" onClick={() => setShowForm(true)}>
            + Add New Column
          </div>
        )}
    </div>
);
}


export default AddColumn;
