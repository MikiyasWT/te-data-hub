import api from "./api"


//fetch And Store Data
export interface fetchAndStoreData {

}



export async function getAllBranchData(page:number,
  itemsPerPage:number) {
  try {
    const response = await api.get(`/branch/all`, {
      params: {
        page: page,
        limit: itemsPerPage,
      },
    });

    
    const totalItems = response.data.pagination.total;

    // Extract the sales data from the response
    const branchs = response.data.branchs;

    return { branchs, totalItems };
  } catch (error) {
    console.error('Unable to get sales data:', error);
    throw error;
  }
}



//delete branch data
export interface deleteBranchData{

}

export async function deleteBranchData() {
    try {
        return await api.delete('/branch/deleteBranch')       
    } catch (error) {
      console.error('unable to delete branch data :', error);
      throw error;
    }
}



//show branch profile
export interface showBranchProfile{

}

export async function showBranchProfile() {
    try {
        return await api.get('/branch/')       
    } catch (error) {
      console.error('unable to show branch profile :', error);
      throw error;
    }
}




//import branch data
export interface importBranchData{

}

export async function importBranchData() {
    try {
        return await api.post('/branch/importBranchData')       
    } catch (error) {
      console.error('unable to import branch data :', error);
      throw error;
    }
}



//generate pdf
export interface generatePdf{

}

export async function generatePdf() {
    try {
        return await api.get('/branch/pdf')       
    } catch (error) {
      console.error('unable to import branch data :', error);
      throw error;
    }
}


//list of all branchs
export async function getAllBranchs() {
  try {
    return await api.get('/branch/all')
  } catch (error) {
    console.log('unable to fetch all branchs')
  }
}export async function importBranch(formData:any){
  try {
      const response=await api.post('/branch/import',formData) 
return response
  } catch (error) {
    console.error('Unable to import branch information :', error);
    throw error;
  } 
}