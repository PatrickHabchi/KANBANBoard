import React from 'react'
import api from './axios';
import { useDispatch } from "react-redux";
import { settingData } from '../Redux/Slices/AppSlice';

function useLogsApi() {

  const dispatch = useDispatch();

    const getLogs = async () => {
        try {
            const res = await api.get("/logs/getLogs");

            dispatch(settingData({ field: "logs", value: res.data.payload }))

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