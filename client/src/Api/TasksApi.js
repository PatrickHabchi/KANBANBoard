import React from 'react';
import api from './axios';

function useTasksApi() {
  
  const getAllTasks = async () => {
    try {
      const res = await api.get("/tasks/getTasks");
      return res.data;
    } catch (error) {
      console.error(error);  
    }
  };

  const createTask = async (payload) => {
    try {
      const res = await api.post("/tasks/createTask", payload)

      return res.data
    } catch (error) {
      console.error(error);
      
    }
  }

  const updateTask = async (id, payload) => {
    try {
      const res = await api.put(`/tasks/updateTask/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error(error);   
    }
  };

  return {
    getAllTasks,
    updateTask,
    createTask
  }
}

export default useTasksApi;