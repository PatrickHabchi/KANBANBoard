import React, { useEffect, useRef, useState } from "react";
import useTasksApi from "../../Api/TasksApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import useLogsApi from "../../Api/LogsApi";
import { toast } from "react-toastify";
import TagSelector from "./TagSelector";

function AddCard({ columnId, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState({});
  const [tagId, setTagId] = useState(null);

  const { createTask } = useTasksApi();
  const { getLogs } = useLogsApi();

  const InputRef = useRef(null);

  useEffect(() => {
    if (showForm && InputRef.current) {
      InputRef.current.focus();
    }
  }, [showForm]);

  const reset = () => {
    setTitle('');
    setDescription('');
    setTagId(null);
    setShowForm(false);
  };


  const handleSubmit = async () => {
    if (validationForm()) {

      if (!showForm) {
        setShowForm(true);
        return;
      }

      const payload = {
        title,
        description,
        column_id: columnId,
        tag_id: tagId,
      };

      try {
        const newTask = await createTask(payload);
        onAdd?.(newTask);
        await getLogs();
        toast.success("Task created successfully!");

      } catch (error) {
        toast.error("Failed to create task");
        console.error("Error creating task:", error);
      } finally {
        reset();
      }
    }
  };

  const validationForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!title) {
      newErrors.title = "Card Title is required";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  }

  return (
    showForm ? (
      <div className="add-card w-100">
        <input
          ref={InputRef}
          placeholder="Card title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input mb-2"
        />
        {error.title && (<div className= 'error mb-2'>{error.title}</div>)}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="textarea"
        />

        <TagSelector value={tagId} onChange={setTagId} className="w-100" />
        <div className="d-flex gap-1">
          <div className="button">
            <button onClick={handleSubmit} className="btn btn-success w-100 ml-1">Add</button>
          </div>
          <div className="button">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError({})
              }}
              className="btn"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>
      </div>
    ) : (
      <button onClick={() => setShowForm(true)} className="btn w-100 text-start">
        + Add Card
      </button>
    ))
}



export default AddCard;
