import Image from "next/image";

import randomuser from "../../public/images/random-user.jpg";
import Icon from "../../components/Icons/Icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import Customer from "./customer";
import LineChart from "../dashboard/line";
import Medicine from "../../components/medicine";
import { useRouter } from "next/router";
import { showCustomerProfile } from "../../services/customer";
import DependentCustomer from "./dependentfamily";
interface Tab {
  id: number;
  label: string;
  component: React.ReactNode;
  // customerId: string;
}

const customerProfile = () => {
  const router = useRouter();
  const { query } = router;
  const customerId = query.customerCode;

  const tabsData: Tab[] = [

    { id: 1, label: 'Dependent', component: <DependentCustomer Id={customerId} />, },
    { id: 2, label: 'Medicine', component:  <Medicine Id={customerId} />  },
   
  ];  
    const [tabClicked,setTabclicked] =useState<Tab>(tabsData[0]);
    const handleTabClick = (tab: Tab) => {
        setTabclicked(tab);
      };
      //const router = useRouter();
      const [customer, setCustomer] = useState<any>([]);
      // get customer id from query params
     

      useEffect(() => {
        const fetchCustomer = async () => {
          try {
            console.log(customerId , "this is customer id")
            const response = await showCustomerProfile(customerId);
        setCustomer(response.data.customer);
        console.log("customer profile", response.data.customer);
      } catch (error) {
        console.error("Unable to fetch customers:", error);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="bg-white p-3 shadow-sm rounded-sm">
      <div className="grid md:grid-cols-2 text-sm">
        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
          <span className="text-blue-500 pr-6">
            <button onClick={handleGoBack}>
              <Icon w="6" h="5" color="blue-500" radius="2" path="back" />
            </button>
          </span>
          <span>
            <Image
              src={randomuser}
              alt="user photo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </span>
          <span className="flex items-start flex-col ">
            <div className="">{customer.full_name}</div>
            <div className="text-sm text-normal font-normal">
              {customer.code}{" "}
            </div>
          </span>
        </div>
        <div className="flex items-center space-x-1 font-medium text-gray-900 py-4 ">
          <span className="px-2 font-semibold">Total Price:</span>
          <span className=" ">ETB 23234</span>
        </div>
      </div>
      <div className="text-gray-700 ">
        <div className="grid md:grid-cols-2 text-sm items-center">
          <div className="flex items-center space-x-2 font-medium text-gray-900  pt-4 pb-2">
            <span
              className="pr-2 pl-10 text-blacktext-base
font-normal
leading-tight"
            >
              {" "}
              <span>
                <Icon w="5" h="4" color="blue-500" radius="2" path="phone" />
              </span>
              Phone:
            </span>
            <span className=""></span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span className="pr-2 pl-10 text-blacktext-basefont-normalleading-tight">
              {" "}
              <span>
                <Icon w="" h="4" color="blue-500" radius="2" path="hash" />
              </span>
              House No :
            </span>
            <span className="">####</span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-10 text-black
text-base
font-normal
leading-tight"
            >
              {" "}
              <span>
                <Icon w="5" h="4" color="blue-500" radius="2" path="location" />
              </span>
              Region :
            </span>
            <span className="">{customer.regionstate}</span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-10 text-black
text-base
font-normal
leading-tight"
            >
              {" "}
              <span>
                <Icon w="5" h="4" color="blue-500" radius="2" path="mail" />
              </span>
              <Link className="text-blue-500" href="mailto:{customer.birth_date}">
              {customer.email}
              </Link>
            </span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-10 text-black
text-base
font-normal
leading-tight"
            >
              {" "}
              <span>
                <Icon w="5" h="4" color="blue-500" radius="2" path="location" />
              </span>
              Subcity :
            </span>
            <span className="">{customer.subcity}</span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-10 text-black
text-base
font-normal
leading-tight"
            >
              {" "}
              <span>
                <Icon w="5" h="4" color="blue-500" radius="2" path="calendar" />
              </span>
              {customer.birth_date}
            </span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-10 text-black
text-base
font-normal
leading-tight"
            >
              {" "}
              <span>
                <Icon w="5" h="4" color="blue-500" radius="2" path="location" />
              </span>
              Woreda :
            </span>
            <span className="">{customer.woreda}</span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-12 text-black
text-base
font-normal
leading-tight"
            >
              Gender :
            </span>
            <span className="">{customer.gender}</span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-10 text-black
text-base
font-normal
leading-tight"
            >
              {" "}
              <span>
                <Icon w="5" h="4" color="blue-500" radius="2" path="location" />
              </span>
              Ketena :
            </span>
            <span className="">{customer.ketena}</span>
          </div>
          <div className="flex items-center space-x-2 font-medium text-gray-900  py-2">
            <span
              className="pr-2 pl-12 text-black
text-base
font-normal
leading-tight"
            >
              {" "}
              Child ID :
            </span>
            <span className="">{customer.code}</span>
          </div>
        </div>
      </div>
      <div>
        <nav className="mt-10">
          {tabsData.map((tab) => (
            <button
              key={tab.id}
              className={`text-neutral-500 text-xl font-normal mr-6   ${
                tabClicked.id === tab.id
                  ? " border-b-2 text-blue-500  border-blue-600"
                  : ""
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="mt-4">{tabClicked.component}</div>
      </div>
    </div>
  );
};
export default customerProfile;