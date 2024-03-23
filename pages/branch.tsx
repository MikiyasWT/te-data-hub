


import React, { useEffect, useState } from 'react';

import Table from '../components/Table';
import { getAllBranchData, importBranch } from '../services/branch';
import { searchBranchApi } from '../services/search';
import { RootState } from '../redux/reducer';
import { useSelector } from 'react-redux';


//SearchBranch

const Product: React.FC = () => {
  const [branch, setBranch] = useState([]);
  const [isError ,setIsError] = useState('')
  const query = useSelector((state: RootState) => state.query); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20; 
  useEffect(() => {
    const fetchBranchs = async () => {
      try {
        
        const response = await getAllBranchData(currentPage, itemsPerPage);
       
        setBranch(response.branchs);
        setTotalItems(response.totalItems);
      } catch (error) {
        console.error('Unable to fetch branchs list:', error);
      }
    };

    const searchBranch = async () => {
      try {
        const response = await searchBranchApi(query);
         if(response.data.success && response.status >=200 && response.status <=300){
          setBranch(response.data.branches);
        } 
      } catch (error) {
        setBranch([]);
        setIsError("Nothing that matchs your search was found")
        console.error("Nothing that matchs your search was found:", error);
      }
    };





    if(query != '' || query || query.length>=2){
      searchBranch();
    }
    else{
      fetchBranchs()
    }
  },  [query,currentPage]);



  


  const columns = [
    { header: 'Branch Name', accessor: 'branch_name' },
    { header: 'Branch Number', accessor: 'branch_number' },
    { header: 'Subcity', accessor: 'subcity' },
    { header: 'Woreda', accessor: 'woreda' },
    { header: 'House Number', accessor: 'house_number' },
    { header: 'email', accessor: 'email' },
    { header: 'Phone Number', accessor: 'phone_number' },
    
  ];
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleImport = async (file: File) => {

    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await importBranch(file);
  
      const data =  response;
  
      console.log('Import successful', data);
  
    } catch (error) {
      console.error('Error importing data', error); 
    }
  
    console.log('whatFile to be uploaded:', file);
  
  };
 

  return (
    <div>
      <h1>Branchs List</h1>
      <Table data={branch} columns={columns}
      onRowClick={null} 
       currentPage={currentPage} 
       onPageChange={handlePageChange}
        totalItems={totalItems}
         itemsPerPage={itemsPerPage} 
         onImport={handleImport}/>
      {isError!='' && isError.length>1 &&  <h1 className="text-black">{isError}</h1>}
    </div>
  );
};

export default Product;