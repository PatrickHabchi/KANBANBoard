import React from 'react'
import api from './axios';

function useLogsApi() {

    const getLogs = async () => {
        try {
            const res = await api.get("/logs/getLogs");

            return res.data.payload;
        } catch (error) {
            console.error(error);
        }
    }

  return {
    getLogs
  }
}

export default useLogsApi