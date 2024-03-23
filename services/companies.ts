import api from "./api";


//fetchs companies
export async function fetchCompanies() {
    try {
        return await api.get('/company/all')       
    } catch (error) {
      console.error(error);
      throw error;
    } 
  }
  
  