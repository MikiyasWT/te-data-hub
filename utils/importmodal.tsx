
import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import { FileUploader } from "react-drag-drop-files";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
}
const fileTypes = ["CSV", "XLSX"];

const ImportModal: React.FC<any> = ({ isOpen, onClose, onConfirm }) => {
  const [file, setFile] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fileData, setFileData] = useState<any>([]);

  const handleFileChange = (file: any) => {
    setFile(file);
    // const selectedFile = event.target.files?.[0];
    // if (selectedFile) {
    //   setSelectedFile(selectedFile);
    // }
  };


 

  const handleConfirm = () => {
    if (file) {
      onConfirm(file);
      onClose();
      // Implement your API call logic here
      // Use fileData to send the file content to the server
      console.log('File data to be uploaded:', fileData);

      // Reset selectedFile and fileData state after upload
      setSelectedFile(null);
      setFileData([]);
    } else {
      // Handle case where no file is selected
      console.error('No file selected');
    }
  };

  return (
    isOpen && (
        <Modal
                      isOpen={isOpen}
                      onRequestClose={onClose}
                      overlayClassName=" bg-black bg-opacity-50 fixed top-0 bottom-0 left-0 right-0 h-full w-full  z-50 flex justify-center items-center"
                      className=" bg-white w-full md:w-[600px] h-[200px] ml-[271px] mr-[183px] mt-[256px] mb-[407px] rounded-8 outline-none "
                    >
      
         <div className="flex flex-col items-center justify-center w-full h-full">
         
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
      </svg>
       
        
        {/* <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} /> */}
        <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} />
        <p>{file ?  <div><div> File name: {file.name}</div>
         <button onClick={handleConfirm} className="my-4 bg-blue-500 text-white px-4 py-2 rounded">
            Upload
          </button> </div>: "no files uploaded yet"}</p>
   
      </label>
      
      
      
    </div>
      </Modal>
    )
  );
};

export default ImportModal;
