import { Router, useRouter } from "next/router";
import React, { useState } from "react";
interface SalesData {
  full_name: string;
  creation: string;
}
interface TableComponentProps {
  data: SalesData[];
}
 const transaction: React.FC<TableComponentProps> = ({ data })=> {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20; 
  return (
    <div className="bg-white shadow rounded-lg  w-full p-4 sm:p-6 xl:p-8 ">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Recent Transactions
          </h3>
        </div>
        <div className="flex-shrink-0 cursor-pointer">
          <a onClick={()=> router.push('/sales')}
           
            className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
          >
            View all
          </a>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto rounded-lg">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden sm:rounded-lg">
             
             <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col"
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
          <th scope="col"
                      className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {data.slice(0, 10).map((item, index) => (
          <tr key={index}>
            <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                      Payment from <span className="font-semibold">{item.full_name} </span></td>
                      <td>{formatTimestamp(item.creation)}</td>
          </tr>
        ))}
      </tbody>
    </table>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default transaction

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

