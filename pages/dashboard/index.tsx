import LineChart from "./line";
import * as React from "react";
import OrderChart from "./bar";
import Icon from "../../components/Icons/Icon";
import Transaction from "./transaction";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import { getAllPageSalesData, getAllSalesData } from "../../services/sale";
import { BiUserCheck } from "react-icons/bi";
import Link from "next/link";
export interface IIncomeProps {}


export default function Income(props: IIncomeProps) {
  const [customer, setCustomer] = useState<any>([]);
  const [sales, setSales] = useState<any>([]);
 
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllSalesData();
        
        setCustomer(response.data.dashboardCount);
        console.log("Hello",response.data.dashboardCount)
      } catch (error) {
        console.error("Unable to fetch customers:", error);
      }
    };

    fetchCustomers();
   
   
  }, []);
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getAllPageSalesData(1,10);
        if (Array.isArray(response.sales)) {
          // Check if yearlySales is an array before setting state
          setSales(response.sales);
        }
      } catch (error) {
        console.error("Unable to fetch customers:", error);
      }
    };

    fetchSales();
  }, []);

  const [selectedChart, setSelectedChart] = useState('line'); // 'line' or 'bar'

  const handleChange = (e:any) => {
    setSelectedChart(e.target.value);
  };

  return (
    <div className="">
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
  
  {/* First grid item */}
  <Link href="/sales">
  <div className="flex flex-col justify-center items-center space-y-2 md:pl-4 py-2 bg-[#E5E9F9] rounded-lg">
    <div className="flex justify-center items-center w-[34px] h-[34px] bg-blue-500 rounded-full border border-black border-opacity-5">
      <BiUserCheck className="text-white w-6 h-6" />
    </div>
    <div className="font-bold text-2xl text-center">
    <CountUp
  start={0}
  end={customer.activeCustomerCount}
  duration={2.75}
  separator=" "
  //decimals={4}
  decimal=","
  
  
  
/>
     
    </div>
    <div className="text-center">
      Active customers
    </div>
  </div>
  </Link>

  {/* Second grid item */}
  <Link href="/customers">
  <div className="flex flex-col justify-center items-center space-y-2 md:pl-4 py-2 bg-[#E5E9F9] rounded-lg">
    <div className="flex justify-start items-center w-[34px] h-[34px] bg-blue-500 rounded-full border border-black border-opacity-5">
      <Icon w="5" h="4" color="white" radius="2" path="customer" />
    </div>
    <div className="font-bold text-2xl text-center">
    <CountUp
  start={0}
  end= {customer.customerCount}
  duration={2.75}
  separator=" "
  //decimals={4}
  decimal=","
  
  
  
/>
     
    </div>
    <div className="text-center">
      Total No of customers
    </div>
  </div>
  </Link>

  {/* Third grid item */}
  <Link href="/sales">
  <div className="flex flex-col justify-center items-center space-y-2 md:pl-4 py-2 bg-[#ECD9F7] rounded-lg">
    <div className="flex justify-start items-center w-[34px] h-[34px] bg-purple-800 rounded-full border border-black border-opacity-5">
      <Icon w="5" h="4" color="white" radius="2" path="chart" />
    </div>
    <div className="font-bold text-2xl text-center">
    <CountUp
  start={0}
  end={customer.salesCount}
  duration={2.75}
  separator=" "
  //decimals={4}
  decimal=","
  
  
  
/>
      
    </div>
    <div className="text-center">
      Total Sales
    </div>
  </div>
</Link>
  {/* Fourth grid item */}
  <Link href="/branch">
  <div className="flex flex-col justify-center items-center space-y-2 md:pl-4 py-2 bg-[#DBFAE0] rounded-lg">
    <div className="flex justify-start items-center w-[34px] h-[34px] bg-teal-700 rounded-full border border-black border-opacity-5">
      <Icon w="5" h="4" color="white" radius="2" path="branch" />
    </div>
    <div className="font-bold text-2xl text-center">
    <CountUp
  start={0}
  end= {customer.branchCount}
  duration={2.75}
  separator=" "
  //decimals={4}
  decimal=","
  
  
  
/>
     
    </div>
    <div className="text-center">
      Total No of Branches
    </div>
  </div>
  </Link>

  {/* Fifth grid item */}
  <Link href="/product">
  <div className="flex flex-col justify-center items-center space-y-2 md:pl-4 py-2 bg-[#F6ECB8] rounded-lg">
    <div className="flex justify-start items-center w-[34px] h-[34px] bg-lime-600 rounded-full border border-black border-opacity-5">
      <Icon w="5" h="4" color="white" radius="2" path="product" />
    </div>
    <div className="font-bold text-2xl text-center">
    <CountUp
  start={0}
  end=   {customer.productCount}
  duration={2.75}
  separator=" "
  //decimals={4}
  decimal=","
  
  
  
/>
    
    </div>
    <div className="text-center">
      Total No of Products
    </div>
  </div>
  </Link>

</div>



      <div className="flex flex-col md:flex-row mt-2 ">
      <div className="mb-8 px w-full  ">
   
    
      {selectedChart === 'line' ? (
        <LineChart />
      ) : (
        <div className="mt-8">
          <OrderChart />
        </div>
      )}


<div className="flex justify-end align-center ">
        <select className="flex right-0" value={selectedChart} onChange={handleChange}>
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
      </select>
        </div>

     
    </div>
        <div className="w-screen px-6 py-4">
          <Transaction data={sales} />
        </div>
      </div>
    </div>
  );
}
