import api from './axios';

function useColumnsApi() {

    const getAllColumns = async () => {
        const res = await api.get('/columns/getAllColumns');
        return res.data.payload;
    }

    const createColumn = async (title) => {
      try {
        const res = await api.post("/columns/createColumn", 
            { 
              title
            });

        return res.data.payload;
      } catch (error) {
        console.error(error);
        
      }
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
      const res = await api.delete(`/columns/deleteColumn/${id}`);

        return res.data.payload;
    };

  return {
    getAllColumns,
    createColumn,
    updateColumn,
    deleteColumn,
  }
}

export default useColumnsApi