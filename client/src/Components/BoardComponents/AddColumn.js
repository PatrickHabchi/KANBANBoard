import React, { useEffect, useRef, useState } from "react";
import useColumnsApi from "../../Api/ColumnsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import useLogsApi from "../../Api/LogsApi";
import { toast } from 'react-toastify';

function AddColumn({ onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const [error, setError] = useState({});

  const { createColumn } = useColumnsApi();
  const { getLogs } = useLogsApi()

  const InputRef = useRef(null);

  useEffect(() => {
    if (showForm && InputRef.current) {
      InputRef.current.focus();
    }
  }, [showForm]);

  const reset = () => {
    setColumnTitle("");
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (validationForm()) {
      try {
        const newColumn = await createColumn(columnTitle);
        onAdd?.(newColumn);
        await getLogs();
        toast.success("Column created successfully!");
        reset();
      } catch (err) {
        toast.error("Failed to create column");
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
            ref={InputRef}
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
                onClick={() => { setShowForm(false); setError({}) }}
                className="btn"
              >
                <FontAwesomeIcon icon={faX} />
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