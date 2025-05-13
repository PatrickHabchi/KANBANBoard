import api from "./axios";

 function useTagsApi() {

  const getAllTags = async () => {
    const res = await api.get("/tags/getTags");
    return res.data.payload;
  };
  
  const createTag = async (name) => {
    const res = await api.post("/tags/createTag", 
        { 
            name 
        });
        
    return res.data.payload;
  };

  return { 
    getAllTags, 
    createTag 
};
}


export default useTagsApi;