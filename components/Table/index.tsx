import router from "next/router";
import React, { useState, useEffect } from "react";
import NextShare, { EmailIcon, EmailShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'next-share';
import Modal from "react-modal";
import {
  FacebookShareButton,
  FacebookIcon,
} from 'next-share'
import {
  BiSolidDownload,
  BiPrinter,
  BiSolidShareAlt,
  BiImport
} from "react-icons/bi";
import ImportModal from "../../utils/importmodal";
import { ToastContainer } from "react-toastify";

interface Column {
  Cell?: any;
  header: string;
  accessor: string;

}

interface TableProps {
  data: any[];
  columns: Column[];
  enableRowClick?: boolean;
  onRoleSelect?:any;
  onRowClick?:any
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onImport: any

}


interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}


const Table: React.FC<TableProps> = ({ data,
  columns,
  enableRowClick = false,
  onRowClick,
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage, 
onImport}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(true);
  const [isSharing, setIsSharing] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [deletedRows, setDeletedRows] = useState<number[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number>();
  const [rowClickEnabled, setRowClickEnabled] = useState(enableRowClick);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
 
  useEffect(() => {

    // Simulating a data fetching delay
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(delay);
  }, []);

  const handleSort = (accessor: string) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig && sortConfig.key === accessor && sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key: accessor, direction });
  };
  const [file, setFile] = useState<File | null>(null);

  

  const handleImport = (file: File) => {
    
    if (file) {
      onImport(file);
      console.log("data import", file)

    }
  };

  const handleRowSelect = (rowIndex: number,event:any) => {
 
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((row) => row !== rowIndex));
    } else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const allRows = sortedData.map((_, index) => index);
      setSelectedRows(allRows);
      setSelectAll(true);
    }
  };

  const handlePrint = () => {
    const selectedData = selectedRows.map((index) => sortedData[index]);
    console.log("Print:", selectedData);
     const printContent = document.getElementById("table-container")?.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent || "";
    window.print();
    document.body.innerHTML = originalContent;
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const selectedData = selectedRows.map((index) => sortedData[index]);
    console.log("Download:", selectedData);
    // Implement the download functionality using the selected data

    // Example: Generate a CSV file and initiate download
    const csvContent = selectedData
      .map((item) => Object.values(item).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
    setIsDownloading(false);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  const handleDelete = () => {
    setDeletedRows(selectedRows);
    setSelectedRows([]);
    setSelectAll(false);
  };
  const hasSelection = selectedRows.length > 0;

  //const sortedData = Array.isArray(data) ? [...data] : [];

  const sortedData = [...data];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      const key = sortConfig.key;
      const valueA = a[key];
      const valueB = b[key];

      if (valueA < valueB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      } else if (valueA > valueB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  
  
 
  const getSortIcon = (columnKey: string) => {
    if (sortConfig && sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    // Add a default sort icon here
    return "▲"; // or any other default icon
  };

  // useEffect(() => {
  //   setRowClickEnabled(enableRowClick);
  // }, [enableRowClick]);
  const handleRowClick = (event:any,id: number) => {
    if (event.target.type === 'checkbox') {
      return; // Prevent redirection
    }
    if (onRowClick !== null) {
      onRowClick(id);
    }
  };
 


  useEffect(() => {
    if (selectedCustomer !== undefined) {
      const id = sortedData[selectedCustomer].code;
      router.push({
        pathname: "/customers/customerprofile",
        query: { id },
      });
    }
  }, [selectedCustomer, sortedData, router]);

  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      
    }
  };
  const [open, setOpen] = useState(false);
  
    const handleShare = () => {
      setOpen(true);
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImportIconClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // const handleImport = (file: File) => {
  //   // Implement your API call logic here
  //   console.log('File to be uploaded:', file);
  // };
  return (

    // <div className=" w-full h-full pb-10 mb-10">
    <div >
      <ToastContainer
        position="top-right"
        autoClose={false}
        className="absolute  top-0 right-0 mt-20 p-4  w-[40px] max-w-sm"
      />
 {isLoading ? (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
    </div>

      ) : (

        <div className="w-full h-full pb-10 mb-10">

      <div className="flex justify-start ">
      <button
              className=" text-blue-500 hover:text-blue-700 text-2xl font-bold py-2 px-2 "
              onClick={handlePrint}
            >
              <BiPrinter />
            </button>
            {/* <input type="file" onChange={handleFileChange} /> */}
            <button
              className=" text-blue-500 hover:text-blue-700 text-2xl font-bold py-2 px-2 "
              onClick={handleImportIconClick}
            >
              <BiImport />
            </button>
            
            
            <><button
              className=" text-blue-500 text-2xl hover:text-blue-700 font-bold py-2 px-2  "
              onClick={handleShare}
            >
    
              <BiSolidShareAlt />
            </button><ShareModal
              open={open}
              onClose={() => setOpen(false)}
              row={selectedRows} /></>
        {hasSelection && (
          <>
            
            <button
              className=" text-blue-500 text-2xl hover:text-blue-700 font-bold py-2 px-2 "
              onClick={handleDownload}
            >
              {isDownloading ? (
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              ) : (
                <BiSolidDownload />
              )}
            </button>
            
            
            
           
          </>
        )}
      </div>
     
          <ImportModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleImport} />

        <table
          id="table-container"



          className="mb-10 w-full divide-y divide-gray-200  border-collapse border border-blue-400 text-sm text-gray-700"


        >
          <thead>
            <tr className="bg-blue-200">
              <th className=" px-4 py-2">

                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="leading-tight"
                />
              </th>
              {columns.map((column, index) => (
                <th key={index} className="px-4 py-2">
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    <button
                      className="ml-1 focus:outlinenone"
                      onClick={() => handleSort(column.accessor)}
                      aria-label="Sort"
                    >
                      {getSortIcon(column.accessor)}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          
            {sortedData.map((item, index) => (
               <tr
               key={startIndex + index}
               className={
                 (startIndex + index) % 2 === 0
                   ? "bg-white hover:cursor-pointer"
                   : "bg-blue-50 hover:cursor-pointer"
               }
               onClick={() => handleRowClick(event,startIndex + index)}
             >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={(e) => handleRowSelect(index,e)}
                    className="mr-2 leading-tight"
                  />
                </td>
                {columns.map((column, index) => (
                  <td key={index} className="px-4 py-2">
                    {column.Cell ? column.Cell({ value: item[column.accessor] }) : item[column.accessor]}
                  </td>
                ))}
               
              </tr>
            ))}
          </tbody>
        </table>
       
        <div className="flex justify-center my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2"
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <span className="text-gray-800 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2"
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
        </div>
      )}
    </div>
  );
};

export default Table;

const ShareModal = ({open, onClose, row}:any) => {
  
  const { name, value } = row; // selected row values

  const shareData = `${name},${value}`; // data to share as csv

  return (
    // <Modal 
    //   isOpen={open} 
    //   onClose={onClose}
    // >
    <Modal
                      isOpen={open}
                      onRequestClose={onClose}
                      overlayClassName=" bg-black bg-opacity-50 fixed top-0 bottom-0 left-0 right-0 h-full w-full  z-50 flex justify-center items-center"
                      className=" bg-white w-full md:w-[600px] h-[160px] ml-[271px] mr-[183px] mt-[256px] mb-[407px] rounded-8 outline-none "
                    >
                      <h2 className="flex item-center justify-center my-10">share on every social media</h2>
                      <div className="flex item-center justify-center gap-x-4 mx-4">
       <FacebookShareButton
      url={'https://techethio.com'}
      quote={'techethio datahub'}
      hashtag={'#nextshare'}
    >
      <FacebookIcon size={32} round />
    </FacebookShareButton>
    <EmailShareButton
  url={'https://techethio.com'}
  subject={'Techethio Data'}
  body="body"
>
  <EmailIcon size={32} round />
</EmailShareButton>
<WhatsappShareButton
  url={'https://techethio.com'}
  title={'techethio datahub'}
  separator=":: "
>
  <WhatsappIcon size={32} round />
</WhatsappShareButton>
<TelegramShareButton
  url={'https://techethio.com'}
  title={'techethio datahub'}
> 
  <TelegramIcon size={32} round />
</TelegramShareButton>
<TwitterShareButton
  url={'https://techethio.com'}
  title={'techethio datahub'}
>
  <TwitterIcon size={32} round />
</TwitterShareButton>
    </div>
        
      {/* </Modal></NextShare> */}
    </Modal>
  )
}