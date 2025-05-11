import React, { useState } from "react";
import useTasksApi from "../Api/TasksApi";
import '../Styles/pages/AddCard.scss'
function AddCard({ columnId, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { createTask } = useTasksApi();

  const handleSubmit = async () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }

    if (!title.trim()) return;

    const payload = {
      title,
      description,
      column_id: columnId,
      task_id: null,
    };

    try {
      const newTask = await createTask(payload);
      onAdd?.(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setTitle("");
      setDescription("");
      setShowForm(false);
    }
  };

  return (
    showForm ? (
    <div className="add-card">
      <input
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input mb-2"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="textarea"
      />
      <div className="d-flex gap-1">
        <div className="button">
         <button onClick={handleSubmit} className="btn btn-success w-100 ml-1">Add</button>
        </div>
        <div className="button">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="btn btn-secondary w-100"
        >
          Cancel
        </button>
        </div>
      </div>
    </div>
  ) : (
    <button onClick={() => setShowForm(true)} className="btn btn-primary w-100">
      + Add Card
    </button>
  ))
}



export default AddCard;
