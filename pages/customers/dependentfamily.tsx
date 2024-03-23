import React, { useEffect, useMemo, useState } from "react";

import Table from "../../components/Table";
import { importDependentCustomer, showDependents } from "../../services/customer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
interface tableprops {
  Id: string;
}
const DependentCustomer: React.FC<any> = ({ Id }: tableprops) => {
  const [customers, setCustomers] = useState([]);
  const [noDependent, setNoDependent] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;
  const query = useSelector((state: RootState) => state.query);
  console.log(Id, "dependentttttttttttttttttt");
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await showDependents(Id);
        console.log("dependent customers iddddddd", Id);
        setCustomers(response.data.dependents);
        setNoDependent(response.data.dependentsNumber);
        console.log("dependent customers", response.data);
      } catch (error) {
        console.error("Unable to fetch customers:", error);
        
      }
    };

    fetchCustomers();
  }, []);

  const searchedItems = useMemo(() => {
    return customers.filter((customer) => {
      const values = Object.values(customer).join(" ").toLowerCase();
      return values.includes(query.toLowerCase());
    });
  }, [customers, query]);

  const columns = [
    { header: "Full Name", accessor: "dependet_full_name" },
    { header: "Code", accessor: "dependet_code" },
    { header: "Birth Date", accessor: "dependet_birth_date" },
    { header: "Gender", accessor: "dependet_gender" },
    { header: "Phone Number", accessor: "phone_number" },
    { header: "Relationship", accessor: "dependet_relation" },
    { header: "Date of Registration", accessor: "dependet_registration_date" },
  ];
  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    console.log(customers,'inside handle page')
  }
  const handleImport = async (file: File) => {

    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await importDependentCustomer(file);
  
      const data =  response;
  
      console.log('Import successful', data);
  
    } catch (error) {
      console.error('Error importing data', error); 
    }
  
    console.log('whatFile to be uploaded:', file);
  
  };
 
  return (
    <div>
      {noDependent == 0 ? (
        <h1>No dependent Family </h1>
      ) : (
        <Table data={searchedItems} columns={columns}
        currentPage={currentPage} 
        onRowClick={null} 
        onImport={handleImport}
        onPageChange={handlePageChange} totalItems={totalItems} itemsPerPage={itemsPerPage} />
      )}
    </div>
  );
};

export default DependentCustomer;