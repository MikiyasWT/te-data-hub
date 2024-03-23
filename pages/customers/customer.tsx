import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

import Table from "../../components/Table";
import { CreditCustomerData, importCustomer } from "../../services/customer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import router, { useRouter } from "next/router";
import { dynamicFilter } from "../../utils/filter";

import { SearchCustomersData } from "../../services/search";
import { filterCustomersApi } from "../../services/filter";

import SelectedFilters, { removeObjectKey } from "../../util/SelectedFilter";
import { clearFilters, setFilter } from "../../redux/action";
import debounce from "lodash.debounce";
import { ToastContainer, toast } from "react-toastify";
//import { setFilter, clearFilters } from "../../redux/actions"; // Import your filter actions



const data = [
  {
    birth_date: "1980-02-08",
    code: "ኮ/ቀ/3/I0336/13/13-",
    full_name: "_x0090__x0090_ናሰር አደም ኤርሰቦ",
    gender: "Male",
    house_number: null,
    kebele: "Ketena 11 (ቀጠና 11)",
    phone_number: null,
    regionstate: "Addis Ababa",
    woreda: "3",
    ketena: "1",
    subCity: "Kolfe",
    dependants: 5,
  },
  {
    birth_date: "1990-01-15",
    code: "C123",
    full_name: "John Doe",
    gender: "Male",
    house_number: "456 Main St",
    kebele: "Kebele 123",
    phone_number: "123-456-7890",
    regionstate: "State A",
    woreda: 7,
    ketena: "2",
    subCity: "Akaki kality",
    dependants: 7,
  },
];

interface CaseFilter {
  subcity?: string;
  woreda?: string;
  ketena?: string;
  frombirthdate?: string | number | Date;
  tobirthdate?: string | number | Date;
  minimumAge?: number;
  maximumAge?: number;
  minimumChildren?: number;
  maximumChildren?: number;
}

// const casefilter: CaseFilter = {
//   minimumChildren: 0,
//   maximumChildren: 6,
// };







interface Customer {
  id: number;
  full_name: string;
  code: string;
  gender: string;
  phonenumber: string;
  regionstate: string;
  subcity: string;
  woreda: string;
  ketena: string;
  house_number: string;
  // Add more customer properties as needed
}
const Customer: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([{}]);
  
  const [isError,setIsError] = useState("")
  
  const dispatch = useDispatch();
  const [selectedFilters, setSelectedFilters] = useState<any>({});

  
  const filters = useSelector((state: RootState) => state.filter);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;


  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);


  const handleFilterRemove = (key: string) => {


   
     
    const newFilter = removeObjectKey(filters,key)
    dispatch(setFilter(newFilter));
   
    
  };

  //when selected used to clear all fillters set
  const handleClearFilters = () => {
    setSelectedFilters({}); // Clear local filters state
    dispatch(clearFilters()); // Dispatch action to clear filters in the Redux store
    
  };

  //this query is equal to the serarch value currently 
  //found inside the search input filed its a global state
  const query = useSelector((state: RootState) => state.query);



 // function to filter credit customer data based on the selected filter cases
//  const filterCustomers = async () => {
//   try {
//     const response = await filterCustomersApi(filters);
//     const success = response.data.success;
//     debugger;
//     if(success){
//       console.log()
//       setCustomers(response.data.customers)
//       setTotalItems(response.data.creditCustomers.length);

//     }
//   } catch (error) {
//     setCustomers([]);
//     setIsError("Nothing that matchs your search was found")
//     console.error("Unable to fetch customers:", error);
//   }
// };

const filterCustomers = async () => {
    
  try {
    
    const response = await filterCustomersApi(filters,currentPage,itemsPerPage);
    if(response.success){
      
      setCustomers(response.customers)
      setTotalItems(response.totalItems);
    }
  } catch (error) {
    setCustomers([]);
    setIsError("Nothing that matchs your search was found")
    console.error("Unable to fetch filtered custormers:", error);
  }
};


//function to search credit customers data
 const searchCreditCustomers = async () => {
  try {
    const response = await SearchCustomersData(query);
    if(response.data.creditCustomers){
      setIsError('')
      setCustomers(response.data.creditCustomers);
      setTotalItems(response.data.creditCustomers.length);

    }
    
    
    //setCustomers(data);
  } catch (error) {
    setCustomers([]);
    setIsError("Nothing that matchs your search was found")
    console.error("Unable to fetch customers:", error);
  }
};



// a memoized component to reduce unnecssary api computuation
const memoizedFetchCustomers = useMemo(() => {
  return async () => {
    try {
      const response = await CreditCustomerData(currentPage, itemsPerPage);
      if(response.customers.length >=1){
        setIsError('')
        setCustomers(response.customers);
        setTotalItems(response.totalItems);

      }
      
    } catch (error) {
      toast.error("Unable to fetch customers. Check your internet and try again");
      console.error("Unable to fetch customers:", error);
    }
  };
}, [filters,currentPage]);



//used to debounce credit customer search
 const debouncedSearchCreditCustomers = useCallback(
  debounce(searchCreditCustomers, 200),
  [searchCreditCustomers, query]
);



useLayoutEffect(() => {

    if(query != '' || query || query.length>=2){
      debouncedSearchCreditCustomers()
    }
    else if(Object.values(filters).length > 0){
      setIsError('')
      filterCustomers()
    }
    else{
      setIsError('')
      memoizedFetchCustomers();
    }
    
  }, [query,filters,memoizedFetchCustomers]);



  type DynamicObject = {
    [key: string]: any;
  };

  



  

  const columns = [
    { header: "Full Name", accessor: "full_name" },
    { header: "Code", accessor: "code" },
    { header: "Birth Date", accessor: "birth_date" },
    { header: "Gender", accessor: "gender" },
    { header: "Region/State", accessor: "regionstate" },
    { header: "Subcity", accessor: "subcity" },
    { header: "Woreda", accessor: "woreda" },
    { header: "Kebele", accessor: "ketena" },
   
  ];
  const handleRowClick = (index: number) => {

    const customerCode = customers[index]?.code;
    // Route to customer profile with customer code as query parameter
    router.push({
      pathname: "/customers/customerprofile",
      query: { customerCode },
    });
  };
  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    console.log(customers,'inside handle page')
  }
  const handleImport = async (file: File) => {

    try {
      const formData = new FormData();
      console.log(formData,'uploaded form data')
      formData.append('file', file);
  
      const response = await importCustomer(formData);
  
      const data =  response.data;
     
      const success = data.success;
      console.log(success);
      if (success) {
        toast.success(
          "Data imported successfully"
        );
        router.push("/auth/signin");
      
      
  
      console.log('Import successful', data);
  
    } }catch (error) {
      toast.error("unable to import data. Check your data and try again");
      console.error('Error importing data', error); 
    }
  
    console.log('whatFile to be uploaded:', file);
  
  };
 

  return (
    <div className="">
     
      <ToastContainer
        position="top-right"
        //autoClose={false}
        className="absolute  top-0 right-0 mt-20 p-4  w-[40px] max-w-sm"
      />
      {Object.keys(selectedFilters).length > 0 && (
            <div className="my-4">
              
        <SelectedFilters filters={selectedFilters} onRemoveFilter={handleFilterRemove} />
        <button onClick={handleClearFilters} className="bg-red-500 text-white px-2 py-1 rounded-md ml-2">
          Clear Filters
        </button>
       
      </div>
 )}


      <Table
        data={customers}
        columns={columns}
        enableRowClick={true}
        onRowClick={handleRowClick}
        currentPage={currentPage} 
        onPageChange={handlePageChange} totalItems={totalItems} itemsPerPage={itemsPerPage}
        onImport={handleImport}
      />
      {isError!='' && isError.length>1 &&  <h1 className="text-black">{isError}</h1>}
     
    </div>
  );
};

export default Customer;