import React, { useState } from 'react';
import api from './axios';
import { toast } from 'react-toastify';

function useTasksApi() {
  const [editedTask, setEditedTask] = useState(null); 
  const [alltasks, setAllTasks] = useState(null); 

  
  const getAllTasks = async () => {
    try {
      const res = await api.get("/tasks/getTasks");

      setAllTasks(res.data.payload);
      return res.data.payload;
    } catch (error) {
      console.error(error);  
    }
  };

  const createTask = async (payload) => {
    try {
      const res = await api.post("/tasks/createTask", payload)

      return res.data.payload;
    } catch (error) {
      console.error(error);
      
    }
  }

  const updateTask = async (id, payload) => {
    try {
      const res = await api.put(`/tasks/updateTask/${id}`, payload);
      setEditedTask(res.data.payload);
      return res.data.payload;
    } catch (error) {
      console.error(error);   
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await api.delete(`/tasks/deleteTask/${id}`)

      return res.data.payload;
    } catch (error) {
      console.error(error);
      
    }
  }

  return {
    getAllTasks,
    alltasks,
    updateTask,
    editedTask,
    createTask,
    deleteTask
  }
}

export default useTasksApi;