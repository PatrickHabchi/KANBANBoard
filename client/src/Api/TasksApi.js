import React from 'react';
import api from './axios';

function useTasksApi() {
  
  const getAllTasks = async () => {
    const res = await api.get("/tasks");
        console.log("⚙️  GET /tasks response:", res);
    console.log("⚙️  GET /tasks res.data:", res.data);
    return res.data;
  };
  return {
    getAllTasks
  }
}

export default useTasksApi;