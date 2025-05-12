import api from './axios';

function useColumnsApi() {

    const getAllColumns = async () => {
        const res = await api.get('/columns/getAllColumns');
        return res.data
    }

    const createColumn = async (title) => {
        const res = await api.post("/createColumns", 
            { 
              title
            });
        return res.data;
      };

    const updateColumn = async (id, { title, position }) => {
    const res = await api.put(`/columns/updateColumn/${id}`, 
        { 
          title, 
          position
        });
    return res.data;
    };

    const deleteColumn = async (id) => {
        await api.delete(`/columns/deleteColumn/${id}`);
    };

  return {
    getAllColumns,
    createColumn,
    updateColumn,
    deleteColumn,
  }
}

export default useColumnsApi