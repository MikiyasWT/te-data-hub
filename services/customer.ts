import api from "./api"


//get customer data scrapper
export interface customerDataPayload {
  full_name:string;
}


// export async function CreditCustomerData(){
//     try {
//         return await api.get('customer/showCredit')       
//     } catch (error) {
//       console.error('Unable to pull customer :', error);
//       throw error;
//     } 
// }
export async function CreditCustomerData(page:number,
  itemsPerPage:number) {
  try {
    const response = await api.get('customer/showCredit', {
      params: {
        page: page,
       
      },
    });

    
    const totalItems = response.data.pagination.total;

    
    const customers = response.data.customers;
console.log(customers, 'credit customer ')
    return { customers, totalItems };
  } catch (error) {
    console.error('Unable to get sales data:', error);
    throw error;
  }
}

export async function CashCustomerData(page:number,
  itemsPerPage:number) {
  try {
    const response = await api.get('customer/showCash', {
      params: {
        page: page,
        limit: itemsPerPage,
      },
    });

    
    const totalItems = response.data.pagination.total;

    
    const cashcustomers = response.data.customers;

    return { cashcustomers, totalItems };
  } catch (error) {
    console.error('Unable to get sales data:', error);
    throw error;
  }
}



// export async function CashCustomerData(){
//   try {
//       return await api.get('customer/showCash')       
//   } catch (error) {
//     console.error('Unable to pull customer :', error);
//     throw error;
//   } 
// }


//delete customer
export interface deleteCustomerPayload {

}

export async function deleteCustomer(){
    try {
        return await api.delete('/customer/deleteCustomer')       
    } catch (error) {
      console.error('Unable to delete customer :', error);
      throw error;
    } 
}


//all customer
export interface showCustomerPayload {

}


export async function showCustomerProfile(payload:any){
    try {
      console.log(payload, "from serviceeeeeeeeeeeeeeeeeeeeee")
     
        return await api.get(`/customer/show/?code=${payload}`)       
    } catch (error) {
      console.error('Unable to show customer :', error);
      throw error;
    } 
}


//print customer


//show dependents
export interface showDependentsPayload {
id:string
}

export async function showDependents(id: string){
    try {
        return await api.get(`/customer/allDependents?code=${id}`)       
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
export async function importCustomer(formData:any){
  try {
      const response=await api.post('/customer/import',formData) 
return response
  } catch (error) {
    console.error('Unable to import customer information :', error);
    throw error;
  } 
}
export async function importDependentCustomer(formData:any){
  try {
      const response=await api.post('/dependent/import',formData) 
return response
  } catch (error) {
    console.error('Unable to import customer information :', error);
    throw error;
  } 
}



