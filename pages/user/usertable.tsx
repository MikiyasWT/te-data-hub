import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { getUsers, deleteUser,updateUser, importUser} from '../../services/user';
import Modal from "react-modal";
import { validate } from "../../util/validator";
import { Input } from "../../components/Input/form_input";
import { EDIT } from "../../util/constants";
import { CustomErrorViewer } from "../../components/ErrorViewer/show_error"
import { fetchCompanies } from "../../services/auth";
import { Router, useRouter } from "next/router";
import { CustomButton } from "../../components/Button";
import DeleteConfirmationModal from '../../components/delete';
interface Company {
  name: string;
  code: string;
  address: string;
  email: string;
}
import {
  BiEdit,
  BiTrash,

} from "react-icons/bi";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
interface User {
  email: string;
  fullName: string;
  code: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();
  const [EditError, setEditError] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({
   
    email: "",
    newEmail: "",
    newFirstName:"",
    newLastName: "",
    newType:""
});
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const [totalItems, setTotalItems] = useState(0);
const itemsPerPage = 20; 
const [isError,setIsError] = useState("")
const query = useSelector((state: RootState) => state.query);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const response = await getUsers(currentPage, itemsPerPage);
       
        setUsers(response.users);
        setTotalItems(response.totalItems);
        
      } catch (error) {
        console.error('Unable to fetch Users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

//delete

  let deletionClicked = false;
  const handleDelete = async ( index: number) => {

    deletionClicked = true;
    setSelectedRowIndex(index);
     const selectedUser = users[index];
     setSelectedUser(selectedUser);
     setIsDeleteModalOpen(true);
  };

  //edit 

  let editClicked = false;
  const handleEdit = async (index: number) => {
    editClicked = true;
    const selectedUser = users[index];
  
    if (selectedUser) {
      setFormData({
        ...formData,
        email:selectedUser.email || '',
        newFirstName: selectedUser.fullName?.split(' ')[0] || '',
        newLastName: selectedUser.fullName?.split(' ')[1] || '',
        newEmail: selectedUser.email || '',
      });
  
      setSelectedUser(selectedUser);
      setIsModalOpen(true);
    }
  };
  
  const handleRowClick = ( index: number) => {
    const userCode = users[index].email;
   
    console.log('from row user:', users[index]);
  
    if(!deletionClicked && !editClicked) { 
      router.push({
        pathname: '/user/userProfile', 
        query: {userCode}
      });
    }else if(editClicked ==false){
     handleDelete( index)
  }else{handleEdit(index);}
  
  }
  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await fetchCompanies(); // Call the API service function
        const data = response.data;

        const success = data.success;
        if (success) {
          setCompanies(data.company); // Store the company data in the state variable
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    getCompanies();
  }, []);
  
  const handleSubmit = async (e: any) => {
  
    e.preventDefault();
  
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    console.log("this is from error:",errors)
  console.log(Object.keys(validationErrors).length)
   // Check if there are any validation errors
     if (Object.keys(validationErrors).length <= 6) {
      try {
        //Call the updateUser API service function to update the user
       
        await updateUser(formData);
        console.log("submited:",formData)
        closeModal(); 
        const response = await getUsers(currentPage, itemsPerPage);
        setUsers(response.users);
      }catch (error) {
        setEditError("An error occurred while updating the user.");
      console.error('Error updating user:', error);
   
      }
  };
}

  const handleChange = (e: any, field: any) => {
    const updatedFormData = { ...formData, [field]: e };
    const validationErrors = validate(updatedFormData);
    setFormData(updatedFormData);
    setErrors(validationErrors);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser && selectedRowIndex !== null) {
      try {
        await deleteUser(selectedUser.email);
        setUsers((prevUsers) => prevUsers.filter((_, index) => index !== selectedRowIndex));
      } catch (error) {
        console.error('Unable to delete user:', error);
      }
    }
  
    setIsDeleteModalOpen(false);
  };

  // Function to cancel delete action
  const handleDeleteCancel = () => {
    // Close the delete confirmation modal
    setIsDeleteModalOpen(false);
  };
  const columns = [
    { header: 'Full Name', accessor: 'fullName' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      accessor: 'roles',
      Cell: ({ value }: { value: string[] }) => value.join(', '),
    },
    {
      header: 'Edit',
      accessor:'',
      Cell: (_: any, index: number) => (
        <button    className=" text-green-500 hover:text-green-700 text-2xl font-bold py-2 px-2 mr-2 " onClick={() => handleEdit(index)}>
          {/* <p className='text-green-500'>Edit</p> */}
          < BiEdit/>
        </button>
      ),
    },
    {
      header: 'Delete',
      accessor:'',
      Cell: (_: any, index: number) => (
        <button className=" text-red-500 hover:text-red-700 text-2xl font-bold py-2 px-2 mr-2 " onClick={() => handleDelete( index)} >
          {/* <p className='text-red-500'>Delete</p> */}
          <BiTrash />
        </button>
      ),
    },
  ];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const handleImport = async (file: File) => {

    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await importUser(file);
  
      const data =  response;
  
      console.log('Import successful', data);
  
    } catch (error) {
      console.error('Error importing data', error); 
    }
  
    console.log('whatFile to be uploaded:', file);
  
  };

  return (
    <div>
       <Table totalItems={totalItems}
       itemsPerPage={itemsPerPage}
       onImport={handleImport}  currentPage={currentPage} 
       onPageChange={handlePageChange} data={users} columns={columns} enableRowClick={true} onRowClick={handleRowClick}/>
       <DeleteConfirmationModal
        show={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={() => handleDeleteConfirm()}
      />



       <Modal
           isOpen={isModalOpen}
           onRequestClose={closeModal}
           overlayClassName="bg-black bg-opacity-50 absolute top-0 bottom-0 left-0 right-0 fixed sm:h-full w-[648px] md:w-[1440px] lg:w-[1440px] xl:w-full xl:h-full  z-50 flex justify-center items-center overflow-hidden"
           className="bg-white p-20 mx-auto w-[370px] md:w-[560px] rounded-8 outline-none"
        >
       <div>
            <div>
              <h4 className="text-black text-5xl font-sans text-center mb-10">
                Edit your info
              </h4>
              <span className="text-xl text-center text-red-400">
                {EditError}
              </span>
            </div>
            <div className=" flex  flex-col justify-center item-center font-sans">
              <label
                htmlFor="first_name"
                className="block mt-2 text-md font-small text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <Input
                type={"text"}
                name={"newFirstName"}
                value={formData.newFirstName}
                isError={errors.newFirstName == ""}
                placeholder={"Enter your First name"}
                onchange={(event) => handleChange(event, "newFirstName")}
              />

              <CustomErrorViewer
                isShow={errors.newFirstName != ""}
                text={errors.newFirstName}
              />
              <label
                htmlFor="last_name"
                className="block mt-2 text-md font-sans text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <Input
                type={"text"}
                name={"newLastName"}
                value={formData.newLastName}
                isError={errors.newLastName == ""}
                placeholder={"Enter your Last name"}
                onchange={(event) => handleChange(event, "newLastName")}
              />

              <CustomErrorViewer
                isShow={errors.newLastName != ""}
                text={errors.newLastName}
              />
              <label
                htmlFor="email"
                className="block mt-2 text-md font-small text-gray-900 dark:text-white"
              >
                Email
              </label>
              <Input
                type={"newEmail"}
                name={"newEmail"}
                value={formData.newEmail}
                isError={errors.newEmail == ""}
                placeholder={"Enter your Email"}
                onchange={(event) => handleChange(event, "newEmail")}
              />

              <CustomErrorViewer
                isShow={errors.newEmail != ""}
                text={errors.newEmail}
              />
              <div className="relative">
                <label
                htmlFor="password"
                className="block mt-2 text-md font-small text-gray-900 dark:text-white"
              >
                Company
              </label>
           <select
             name="companyName"
            onChange={(event) => handleChange(event.target.value,  "compantType")}
          
            className={` w-full  h-[61px] rounded-[10px] pl-4  focus:outline-none bg-white border border-black/10"`}>

        {companies.map((company) => (
         <option key={company.code} value={company.name}>
          {company.name}
         </option>
        ))}
</select>
<div className="flex justify-center mt-6">
                <CustomButton onchange={handleSubmit} text={EDIT} />
              </div>
            </div>
          </div>
        </div>
</Modal>
    </div>
  );
};

export default Users;