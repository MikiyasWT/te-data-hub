import api from "./api"


export interface salesDataPayload{
id:string
}

export async function getEachSalesData(id:any){
    try {
      console.log("id in medicine", id)
        const med= await api.get(`/sales/show?id_number=${id}`)  
        console.log(med, "medicine returned")  
      
        return med  
    } catch (error) { 
      console.error('Unable to get medicine data :', error);
      
      throw error;
    } 
}
export async function getAllSalesData(){
  try {
    
      const sale= await api.get('/sales/all')  
     
      return sale  
  } catch (error) {
    console.error('Unable to get sales data :', error);
    throw error;
  } 
}
export interface salesPayload {
  page:number;
  itemsPerPage:number
}


export async function getAllPageSalesData(page:number,
  itemsPerPage:number) {
  try {
    const response = await api.get(`/sales/allSales`, {
      params: {
        page: page,
        limit: itemsPerPage,
      },
    });

    
    const totalItems = response.data.pagination.total;

    // Extract the sales data from the response
    const sales = response.data.sales;

    return { sales, totalItems };
  } catch (error) {
    console.error('Unable to get sales data:', error);
    throw error;
  }
}

export async function getSalesData(selectedPeriod: string) {
  try {
    console.log(selectedPeriod,"selectedperiod")
    const response = await api.get(`/sales/all?timeInterval=${selectedPeriod}`);
    const data = response.data.sales;
    console.log(data, 'from servie')
    // Perform filtering and aggregation based on the selected period
    
    return data;
  } catch (error) {
    console.error("Unable to get sales data:", error);
    throw error;
  }
}

//delete sales
export interface deleteSalesDataPayload{

}

export async function deleteSalesData(){
    try {
        return await api.delete('/sales/deleteSales')       
    } catch (error) {
      console.error('Unable to delete sales data :', error);
      throw error;
    } 
}

//all sales
export interface getAllSalesDataPayload{

}


//sale
export interface getSaleDataPayload{

}

export async function getSaleData(){
    try {
        return await api.get('/sales/sales')       
    } catch (error) {
      console.error('Unable to get sale data :', error);
      throw error;
    } 
}

//update sales
export interface updateSalePayload{

}

export async function updateSale(){
    try {
        return await api.put('/sales/updateSale')       
    } catch (error) {
      console.error('Unable to update sales data :', error);
      throw error;
    } 
}
export async function importSales(formData:any){
  try {
      const response=await api.post('/sales/import',formData) 
return response
  } catch (error) {
    console.error('Unable to import sales information :', error);
    throw error;
  } 
}