import api from "./api"


//get customer data scrapper
export interface customerDataPayload {

}



export async function ProductData(page:number,
  itemsPerPage:number) {
  try {
    const response = await api.get('product/all', {
      params: {
        page: page,
        limit: itemsPerPage,
      },
    });

    
    const totalItems = response.data.pagination.total;

    
    const products = response.data.products;

    return { products, totalItems };
  } catch (error) {
    console.error('Unable to get products data:', error);
    throw error;
  }
}


//delete customer
export interface deleteCustomerPayload {

}

export async function deleteCustomer(){
    try {
        return await api.delete('/product/deleteProduct')       
    } catch (error) {
      console.error('Unable to delete product :', error);
      throw error;
    } 
}


//all customer
export interface showCustomerPayload {

}


export async function showCustomer(){
    try {
        return await api.get('/customer/allCustomers')       
    } catch (error) {
      console.error('Unable to show customer :', error);
      throw error;
    } 
}


//print customer


//show dependents
export interface showDependentsPayload {

}

export async function showDependents(){
    try {
        return await api.get('/customer/showDependents')       
    } catch (error) {
      console.error('Unable to show dependents information :', error);
      throw error;
    } 
}



//update customer
export interface updateCustomerPayload {

}

export async function updateCustomer(){
    try {
        return await api.put('/customer/updateCustomer')       
    } catch (error) {
      console.error('Unable to update customer information :', error);
      throw error;
    } 
}


//update dependents
export interface updateDependentPayload {

}

export async function updateDependent(){
    try {
        return await api.put('/customer/updateDependent')       
    } catch (error) {
      console.error('Unable to update dependent information :', error);
      throw error;
    } 
}


//export data to csv
export interface exportDataCsvPayload {

}

export async function exportDataCsv(){
    try {
        return await api.get('/customer/exportCustomerExcel')       
    } catch (error) {
      console.error('Unable to export customer information :', error);
      throw error;
    } 
}
export async function importProduct(formData:any){
  try {
      const response=await api.post('/product/import',formData) 
return response
  } catch (error) {
    console.error('Unable to import customer information :', error);
    throw error;
  } 
}