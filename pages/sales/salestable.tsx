


import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Table from '../../components/Table';

import { getAllPageSalesData, getAllSalesData, importSales } from '../../services/sale';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import { salesSearch } from '../../services/search';

import debounce from 'lodash.debounce';


const Sales: React.FC = () => {

  const [sales, setSales] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20; 

  const [isError,setIsError] = useState("")
  const query = useSelector((state: RootState) => state.query);

  const searchSales = async () => {
    try {
      const response = await salesSearch(query);
  
      setSales(response.data.sales);
      //setCustomers(data);
    } catch (error) {
      setSales([]);
      setIsError("Nothing that matchs your search was found")
      console.error("Unable to fetch customers:", error);
    }
  };




  const memoizedFetchSales = useMemo(() => {
    return async () => {
      try {
        const response = await getAllPageSalesData(currentPage, itemsPerPage);
        
        setSales(response.sales);
        setTotalItems(response.totalItems);
      } catch (error) {
        console.error('Unable to fetch Sales:', error);
      }
    };
  }, [query,currentPage]);

  
  //used to debounce credit customer search
 const debouncedSalesSearch = useCallback(
  debounce(searchSales, 200),
  [searchSales, query]
);


  useEffect(() => {

    if(query != '' || query || query.length>=2){
      debouncedSalesSearch()
    }
    else{
      memoizedFetchSales();
    }
  },  [query,currentPage]);




  

  const columns = [
    { header: 'Drug Shop Name', accessor: 'name' },
    { header: 'Customer Name', accessor: 'full_name' },
    { header: 'Customer ID', accessor: 'id_number' },
    { header: 'Customer Subcity', accessor: 'customer_subcity' },
    { header: 'Customer Woreda', accessor: 'customer_woreda' },
    { header: 'Item Code', accessor: 'item_code' },
    { header: 'Description', accessor: 'description' },
    { header: 'UOM', accessor: 'uom' },
    { header: 'VAT', accessor: 'vat' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Unit Price', accessor: 'unit_price' },
    { header: 'Total Selling Price', accessor: 'total_inc_vat' },
    { header: 'Dispenser', accessor: 'prepared' },
    { header: 'Cashier', accessor: 'cashier_full_name' },
  ];
  const handleRowClick = (index: number) => {

    const customerCode = sales[index].id_number;
    // Route to customer profile with customer code as query parameter
    console.log(customerCode,"this is from sales" )
    router.push({
      pathname: "/customers/customerprofile",
      query: { customerCode },
    });
  };
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleImport = async (file: File) => {

    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await importSales(file);
  
      const data =  response;
  
      console.log('Import successful', data);
  
    } catch (error) {
      console.error('Error importing data', error); 
    }
  
    console.log('whatFile to be uploaded:', file);
  
  };
 

  return (
    <div>
      <h1>Sales</h1>

      <Table data={sales} columns={columns} onRowClick={handleRowClick}
        currentPage={currentPage} 
        onPageChange={handlePageChange}
         totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onImport={handleImport} />

    </div>
  );
};

export default Sales;


