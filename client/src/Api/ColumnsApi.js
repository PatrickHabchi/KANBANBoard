import api from './axios';

function useColumnsApi() {

    const getAllColumns = async () => {
        const res = await api.get('/columns');
        return res.data
    }

    const createColumn = async (title, position) => {
        const res = await api.post("/columns", 
            { 
              title, 
              position 
            });
        return res.data;
      };

    const updateColumn = async (id, { title, position }) => {
    const res = await api.put(`/columns/${id}`, 
        { 
          title, 
          position
        });
    return res.data;
    };

    const deleteColumn = async (id) => {
        await api.delete(`/columns/${id}`);
    };

  return {
    getAllColumns,
    createColumn,
    updateColumn,
    deleteColumn,
  }
}

export default useColumnsApi