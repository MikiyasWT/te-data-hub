import Image from "next/image";

import randomuser from "../../public/images/random-user.jpg";
import Icon from "../../components/Icons/Icon";
import Link from "next/link";
import { SetStateAction, useEffect, useState, Dispatch } from "react";
import Medicine from "../../components/medicine";
import { useRouter } from "next/router";
import { showProfile } from "../../services/user";

import { RoleList, updateUserRole, userRoleList } from "../../services/role";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsersLog from "./eachuserlog";
//import RoleDropdown from "./roledropdow";
//import RoleDropdown from './RoleDropdown';


const rolesList = [
  "guest",
  "user",
  "sales",
  "branch",
  "organ",
  "customer",
  "product",
  "admin"
];

const userProfile = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState<any>([]);

  //const [roles, setRoles] = useState<string[]>([]);
const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const response = await userRoleList(customerId); 
        setSelectedRoles(response.data.roles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setLoading(false);
      }
    };
  
    fetchUserRoles();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RoleList(); 
        setRoles(response.data.roles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setLoading(false);
      }
    };
  
    fetchRoles();
  }, []);

  const [activeTab, setActiveTab] = useState("roles");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const router = useRouter();
  const { query } = router;
  const customerId = query.userCode;


  const [customer, setCustomer] = useState<any>([]);
  
//const [selectedRoles, setSelectedRoles] = useState<any>([]);

const handleRoleChange = (event:any) => {
  const selectedRole = event.target.value;
  if (selectedRoles.includes(selectedRole)) {
    setSelectedRoles(selectedRoles.filter((role:any) => role !== selectedRole));
  } else {
    setSelectedRoles([...selectedRoles, selectedRole]);
  }
};



  // get customer id from query params

 // const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [updateRole, setUpdateRole] = useState(false);

  // const handleRoleChange = (role: string) => {
  //   if (selectedRoles.includes(role)) {
  //     setSelectedRoles(selectedRoles.filter((r) => r !== role));
  //   } else {
  //     setSelectedRoles([...selectedRoles, role]);
  //   }
  // };

  //  const handleSubmit = async () => {

  //   const roleObjects: RoleItem[] = selectedRoles.map((role: string) => {
  //     return {
  //       role,
  //       granted: true,
  //     };
  //   });

  //   //console.log(roleObjects);

  //   const roleToBeUpdated: RolesPayload = {
  //     email: customerId,
  //     newRoles: roleObjects,
  //   };

  //   console.log(roleToBeUpdated);

  //   try {
  //     const response = await updateUserRole(roleToBeUpdated);
      
  //     const data = response.data;
  //     const success = data.success;


  //     if (response.status >= 200 && response.status < 300) {
  //       toast.success("user role updated successfully");
  //       setUpdateRole((prev: boolean) => !prev);
  //     }
  //   } catch {
  //     toast.error("unable to update user role");
  //     setUpdateRole((prev: boolean) => !prev);
  //   }
  // };
  const handleSubmit = async () => {
    // Create an array of all roles with granted set to false
    const allRolesWithGrantedFalse = roles.map((role:any) => ({
      role: role.role,
      granted: false,
    }));
  
    // Update roles that are selected to have granted set to true
    const updatedRoles = allRolesWithGrantedFalse.map((role) => {
      if (selectedRoles.includes(role.role)) {
        return {
          ...role,
          granted: true,
        };
      }
      return role;
    });
  
    // Prepare the payload for updating user roles
    const roleToBeUpdated: RolesPayload = {
      email: customerId,
      newRoles: updatedRoles,
    };
  
    try {
      const response = await updateUserRole(roleToBeUpdated);
  
      const data = response.data;
      const success = data.success;
  
      if (response.status >= 200 && response.status < 300) {
        toast.success("user role updated successfully");
        setUpdateRole((prev: boolean) => !prev);
      }
    } catch {
      toast.error("unable to update user role");
      setUpdateRole((prev: boolean) => !prev);
    }
  };
  

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        console.log(customerId, "this is customer id");
        const response = await showProfile(customerId);

        setCustomer(response.data.user);
        console.log("customer profile", response.data.user);
      } catch (error) {
        
        console.error("Unable to fetch customers:", error);
      }
    };


    fetchCustomer();
  }, [customerId]);

  // const handleSubmit = async (event:any) => {
  //   event.preventDefault();
  //   try {
  //     // Update user roles using the API endpoint
  //     await updateUserRole({ customerId, roles: selectedRoles });
  //     console.log("User roles updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating user roles:", error);
  //   }
  // };
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
            <div className="">{customer?.fullName}</div>
            <div className="text-sm text-normal font-normal">
              {customer?.code}{" "}
            </div>
          </span>
        </div>
        <div className="flex items-center space-x-1 font-medium text-gray-900 py-4 ">

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
            <span className="">(251)941221232</span>
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
            <span className="">{customer?.regionstate}</span>
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
              <Link className="text-blue-500" href="mailto:jane@example.com">

                {customer?.email}

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
            <span className="">Yeka</span>
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
              {customer?.birth_date}
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
            <span className="">{customer?.woreda}</span>
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
            <span className="">{customer?.gender}</span>
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
            <span className="">{customer?.kebele}</span>
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
            <span className="">{customer?.code}</span>
          </div>


          
        </div>
      </div>
      {/* activity and role */}
      <div className="py-4 flex space-x-4">
        <button
          className={`${
            activeTab === "roles" ? "border-b border-blue-500 text-blue-500" : ""
          } px-4 py-2 rounded cursor-pointer`}
          onClick={() => handleTabChange("roles")}
        >
          Roles
        </button>
        <button
          className={`${
            activeTab === "activityLog" ? "border-b border-blue-500 text-blue-500" : ""
          } px-4 py-2 rounded cursor-pointer`}
          onClick={() => handleTabChange("activityLog")}
        >
          Activity Log
        </button>
      </div>
      {activeTab === "roles" && (
        <div className="my-">
          {/* Your role tab content */}
          <ul>
               
               {selectedRoles.map((role:any, index:any) => (
                 <li key={index}>{role}</li>
               ))}
                     
             </ul>
       
      <div className="px-2 flex items-start justify-start space-x-2 font-medium text-gray-900  py-2">

            <span
              className=" pr-2 pl-12 text-black
text-base
font-normal
leading-tight"
            >

              
              
              <div className="flex flex-col">
              {!updateRole && (
                <button
                  onClick={() => setUpdateRole((prev: boolean) => !prev)}
                  className="bg-blue-400 text-white px-2 w-[200px] mb-10 rounded-lg"

                >
                  Change role
                </button>
              )}

              {updateRole && (
                <>

                  {/* <RoleDropdown
                    setUpdateRole={setUpdateRole}
                    email={customer?.email}
                  /> */}
                   
          <label>
            Select Roles:
            {roles.map((role:any, index:number) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={role.role}
                  onChange={handleRoleChange}
                  checked={selectedRoles.includes(role.role)}
                  className="mr-2"
                />
                {role.role}
              </div>
            ))}
          </label>
          <button className="bg-blue-400 text-white p-2 m-4 rounded-lg" onClick={handleSubmit}>Update Roles</button>
        
                </>
              )}
            </div>
            </span>
            {/* <span className="">{customer?.roles[0]}</span> */}
           
          </div>
      
        </div>
      )}

      {activeTab === "activityLog" && (
        <div className="mt-4">
          <UsersLog Id={customerId}/>
          {/* <ul>
        {activities.map((activity, index) => (
          <li key={index} className="mb-2">
            {activity.description} - {activity.timestamp}
          </li>
        ))}
      </ul> */}
        </div>
      )}



    </div>
  );
};
export default userProfile;


const roles = ["sales", "admin", "superadmin", "customer", "branch manager"];

interface RoleDropdownProps {
  setUpdateRole: Dispatch<SetStateAction<boolean>>;
  email: string;
}

interface RoleItem {
  role: string;
  granted: boolean;
}

interface RolesPayload {
  email: any;
  newRoles: RoleItem[];
}

export const RoleDropdown = ({ setUpdateRole, email }: RoleDropdownProps) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  const handleSubmit = async () => {
    const roleObjects: RoleItem[] = selectedRoles.map((role: string) => {
      return {
        role,
        granted: true,
      };
    });


    //console.log(roleObjects);

    const roleToBeUpdated: RolesPayload = {
      email: email,
      newRoles: roleObjects,
    };

    console.log(roleToBeUpdated);

    try {
      const response = await updateUserRole(roleToBeUpdated);
      const data = response.data;
      const success = data.success;

      if (response.status >= 200 && response.status < 300) {
        toast.success("user role updated successfully");
        setUpdateRole((prev: boolean) => !prev);
      }
    } catch {
      toast.error("unable to update user role");
      setUpdateRole((prev: boolean) => !prev);
    }
  };
  const handleRoleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedRoles(selectedOptions);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const filteredRoles = roles.filter((role) =>
    role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white flex flex-col ">
      <button
        onClick={handleSubmit}
        className="bg-red-400 text-white px-2 rounded-lg"
      >
        Update role
      </button>
      <input
        type="text"
        placeholder="Search roles"
        value={filter}
        onChange={handleFilterChange}
      />
      <select multiple onChange={handleRoleSelect} value={selectedRoles}>
        {filteredRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <div>Selected Roles: {selectedRoles.join(", ")}</div>
    </div>
  );

};
