
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

import Table from "../../components/Table";
import { CashCustomerData, importDependentCustomer } from "../../services/customer";
import { RootState } from "../../redux/reducer";
import { useDispatch, useSelector } from "react-redux";
import { dynamicFilter } from "../../utils/filter";
import { SearchCustomersData } from "../../services/search";
import debounce from "lodash.debounce";  



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
    woreda: "Kolfe Woreda 03",
    ketena: "1",
    subCity: "Akaki kality",
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
  regionstate?:string;
  gender?:string;
}

const casefilter: CaseFilter = {
  minimumChildren: 0,
  maximumChildren: 6,
};


const Customer: React.FC = () => {
  const [cashCustomers, setCashCustomers] = useState([]);
  const dispatch = useDispatch();

  const [isError,setIsError] = useState("")

  const query = useSelector((state: RootState) => state.query);

  const filters = useSelector((state: RootState) => state.filter);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;




  //cashCustomers. creditCustomers
  const searchCashCustomers = async () => {
    try {
      const response = await SearchCustomersData(query);
      
      setCashCustomers(response.data.cashCustomers);
      //setCustomers(data);
    } catch (error) {
      setCashCustomers([]);
      setIsError("Nothing that matchs your search was found")
      console.error("Unable to fetch customers:", error);
    }

  };


  const debouncedSearchCashCustomers = useCallback(

    debounce(searchCashCustomers, 200),

    [searchCashCustomers, query]
  );

  useEffect(() => {

    const fetchCashCustomers = async () => {
      try {
        const response = await CashCustomerData(currentPage, itemsPerPage);

        setCashCustomers(response.cashcustomers);
        setTotalItems(response.totalItems);

      } catch (error) {
        console.error("Unable to fetch customers:", error);
      }
    };






    if(query != '' || query || query.length>=2){
      debouncedSearchCashCustomers();
    }
    else{
      fetchCashCustomers();
    }
    

  }, [query,currentPage]);

  type DynamicObject = {
    [key: string]: any;
  };


 
  const columns = [
    { header: "Full Name", accessor: "full_name" },
    { header: "Code", accessor: "code" },
    { header: "Birth Date", accessor: "birth_date" },
    { header: "Gender", accessor: "gender" },
    { header: "Phone Number", accessor: "phone_number" },
    { header: "Region/State", accessor: "regionstate" },
    { header: "Woreda", accessor: "woreda" },
    { header: "Kebele", accessor: "kebele" },
    { header: "House Number", accessor: "house_number" },
  ];

  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    console.log(cashCustomers,'inside handle page')
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

              <Table
        data={cashCustomers}
        columns={columns}
        
        onRowClick={null} 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        totalItems={totalItems}
         itemsPerPage={itemsPerPage}
        onImport={handleImport}
      />

  {isError!='' && isError.length>1 &&  <h1 className="text-black">{isError}</h1>}
 
    </div>
  );
};

export default Customer;