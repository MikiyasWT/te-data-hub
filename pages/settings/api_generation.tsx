import Image from "next/image";
import arrowtoright from "../../public/icons/arrowtoright.svg";
import contentcopy from "../../public/icons/contentcopy.svg";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { apiGeneratorApi } from "../../services/settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decodeJwtToken } from "../../utils/decodetoken";
import { getTokenFromCookie } from "../../utils/cookie";
import api from "../../services/api";

interface User {
  fullName: string;
  email: string;
  roles: string[];
}


export async function getUser() {
  try {
    const response = await api.get(`/user/all`)
  

    
    const totalItems = response.data.pagination.total;

    // Extract the sales data from the response
    const users = response.data.users;

    return { users, totalItems };
  } catch (error) {
    console.error('Unable to get users data:', error);
    throw error;
  }
}


const Api_Generation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [apikey, setApiKey] = useState("");

  const handleCopyClick = () => {
    const textToCopy = apikey; // Replace with the text you want to copy

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
      });
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getUser();

        setUsers(response.users);
        console.log(response.users);
      } catch (error) {
        console.error("Unable to fetch Users:", error);
      }
    };

    fetchSales();
  }, []);

  async function generateApi(roles: any) {
    // apiGeneratorApi(roles);
    // const userdetail = { role: roles };
    console.log(roles);
    const decodedPayload = decodeJwtToken(getTokenFromCookie());
    const compantType = decodedPayload?.compantType;
    const userdetail: any = { roles: roles,companyType: compantType};

   

  

  console.log(roles);

    try {
      const response = await apiGeneratorApi(userdetail);
      const data = response.data;
      const success = data.success;
      const apikey = data.token;

      if (response.status >= 200 && response.status < 300 && success) {
        toast.success(
          "an api has been generated successfully, don't forget to Copy it"
        );
        setApiKey(apikey);
        await openModal();
      }
    } catch {
      toast.error("unable to generate API. Check your internet and try again");
    }
  }

  return (
    <div className="w-full h-full  mt-[26px]  mr-[2px] ">
      <ToastContainer
        position="top-right"
        autoClose={false}
        className="absolute  top-0 right-0 mt-20 p-4  w-[40px] max-w-sm"
      />
      <div>
        <h2 className="text-blue-500 text-base font-sans font-normal break-words">
          Api Generation
        </h2>
      </div>
      <div className="mt-[7px] w-full">
        <h2 className="text-black text-base font-sans font-normal break-words">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
          felis id massa efficitur, a ultricies felis tincidunt. Mauris in massa
          metus. Fusce ullamcorper leo eu congue lacinia.
        </h2>
      </div>
      <div className="mt-[17px] w-[164px] h-[33px]">
        <button
          onClick={generateApi}
          className="px-4 py-2 w-full rounded-md bg-blue-500 border border-blue-200 flex items-center"
        >
          <span className="text-white text-base font-sans font-medium mr-2">
            Generate API
          </span>
          <span className="h-full">
            <Image
              src={arrowtoright}
              width={11}
              height={6}
              alt="arrow right icon"
            />
          </span>
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          overlayClassName="bg-black bg-opacity-50 fixed h-screen w-screen top-0 bottom-0 left-0 right-0 h-[768px] w-[648px] md:w-[1440px] lg:w-[1440px] xl:w-full xl:h-full
            z-50 flex flex-row justify-center items-center overflow-hidden"
          className="bg-white   md:bg-white p-20 md:mx-auto h-[220px] w-[370px] md:w-[560px] rounded-8 outline-none "
        >
          <div className="text-center">
            {/* Add any additional content you need for the modal */}
            <div className="flex flex-row">
              <div className="text-center text-2xl font-bold mx-auto max-w-[300px] truncate">
                {apikey}
              </div>
              <Image
                onClick={handleCopyClick}
                src={contentcopy}
                width={24}
                height={24}
                alt="copy api key"
                className="cursor-pointer"
              />
            </div>
            <div className="w-full ml-[0px] mr-[20px] h-full text-center text-gray-500 text-base font-normal">
              generated API key
            </div>
            <div className="w-[69px] h-[19px] pt-5 pb-6 pl-15 pr-17 bg-blue-500 rounded-md overflow-hidden border border-solid border-blue-200 justify-center items-center inline-flex">
              <button
                onClick={handleCopyClick}
                className="text-white text-base font-medium cursor-pointer"
              >
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* api generation table */}
      <div className="w-screen mt-[50px] ">
        {users && users.length > 0 ? (
          <table className="table-fixed mr-10 md:w-1/2">
            <thead>
              <tr className="text-gray-600 text-base font-sans font-bold break-words pb-2 border-b border-gray-300">
                <th className="py-2 w-20 items-start text-left">Label</th>
                <th className="py-2 w-20 text-left">Created</th>
                <th className="py-2 w-20 text-left">Role</th>
                <th className="py-2 w-10 text-left"></th>
              </tr>
            </thead>

            <tbody className="mb-4">
              {users.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 w-60">{item?.fullName}</td>
                  <td className="py-2 w-20">{Date().substr(4, 11)}</td>
                  <td className="py-2 w-40">{item?.roles.join(', ')}</td>
                  
                  <td className="py-2 w-40">
                    <button
                      onClickCapture={() => generateApi(item?.roles)}
                      className="hover:bg-blue-600 hover:text-white bg-white text-blue-600 font-semibold py-2 px-4 rounded"
                    >
                      Generate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <tr>
            <td>No users found.</td>
          </tr>
        )}
      </div>
    </div>
  );
};

export default Api_Generation;
