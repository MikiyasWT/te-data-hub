import api from "./api";





    

 
  export async function SearchCustomersData(searchValues:string){
    try {
      return await api.get(`search/customer?searchValues=${searchValues}`)   
    } catch (error) {
        console.error('Unable to search customer data :', error);
        throw error;
    }
  }





 



  export async function searchBranchApi(searchValue:string){
    try {
         return api.get(`search/branch?searchValues=${searchValue}`)
    } catch (error) {
      console.error('Unable to search branch data:', error);
      throw error;
    }
  }
  


 
  export async function productSearch(searchValue:string){
    try {
      return api.get(`search/product?searchValues=${searchValue}`)
    } catch (error) {
      console.error('Unable to search product data:', error);
      throw error;
    }
  }
  


  export async function salesSearch(searchValue:string){
    try {
      return api.get(`search/sales?searchValues=${searchValue}`)
    } catch (error) {
      console.error('Unable to search sales data:', error);
      throw error;
    }
  }


  export async function usersSearch(searchValue:string){
    try {
      return api.get(`search/user?searchValues=${searchValue}`)
      
    } catch (error) {
      console.error('Unable to search users data:', error);
      throw error;
    }
  }