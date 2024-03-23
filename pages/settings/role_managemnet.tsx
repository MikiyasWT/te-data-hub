import React, { useState, useEffect } from 'react';
import { getRolesAndDocumentList } from '../../services/role';
import { ToastContainer, toast } from 'react-toastify';
import { setDocumentPermission } from '../../services/settings';
import "react-toastify/dist/ReactToastify.css";
interface ServerPermission {
  permission: string;
  granted: boolean;
}

interface ServerRole {
  role: string;
  docType: string;
  permissions: ServerPermission[];
}

const Role_management: React.FC = () => {
  const [initials, setInitials] = useState<ServerRole[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<ServerPermission[]>([]);
  //const [permissions,setPermissions] = useState<ServerRole[]>()
  const [isLoading, setIsLoading] = useState(false);
  const fetchInitialDatas = async () => {
    try {
      const response = await getRolesAndDocumentList();
      const data = response?.data;
      const success = data.success;
      const roles = data.roles;

      if (success) {
        setInitials(roles);
      }
    } catch {
      console.log("Unable to fetch initial setting information. Check your internet and try again");
    }
  };

  useEffect(() => {
    fetchInitialDatas();
  }, []);

  const handleDocTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDocType = event.target.value;
    setSelectedDocType(newDocType);
    setSelectedPermissions(getPermissions(newDocType, selectedRoleType));
  };
  
  const handleRoleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoleType = event.target.value;
    setSelectedRoleType(newRoleType);
    setSelectedPermissions(getPermissions(selectedDocType, newRoleType));
  };

  const handlePermissionChange = (permission: ServerPermission) => {
    setSelectedPermissions((prevPermissions) => {
      const updatedPermissions = prevPermissions.map((perm) => {
        if (perm.permission === permission.permission) {
          return {
            ...perm,
            granted: !permission.granted, // Toggle the granted value
          };
        }
        return perm;
      });
      return updatedPermissions;
    });
  };

  const getPermissions = (docType: string, roleType: string) => {
    const role = initials.find((r) => r.docType === docType && r.role === roleType);
  
    if (role) {
      return role.permissions;
      
    } else {
      // Return default permissions list for the selected document and role type
      return getDefaultPermissions(docType, roleType);
    }
  };

  const getDefaultPermissions = (docType: string, roleType: string) => {
    // Create and return a default permissions list for the selected document and role type
    // You can modify this logic as per your requirements
    return [
      { permission: 'read', granted: false },
      { permission: 'write', granted: false },
      { permission: 'edit', granted: false },
      { permission: 'delete', granted: false },
      { permission: 'download', granted: false },
      { permission: 'import', granted: false },
    ];
  };

  const handleSubmit = async (e:any) => {

    e.preventDefault();
    setIsLoading(true);

    if (selectedDocType === "" || selectedRoleType === "") {
      toast.warning("Document type and Role must be selected ");
      return;
    }

    const collectedPermissions = {
      docType:selectedDocType,
      Role:selectedRoleType,
      "permissions":selectedPermissions
    }

    
    try {
      const response = await setDocumentPermission(collectedPermissions);
      const data = response.data;
      const success = data.success;

      if (success) {
              toast.success("permissions has been updated successfully");
              
              setSelectedDocType('');
              setSelectedRoleType('');
              setSelectedPermissions([]);
      }
    } catch (error) {
      toast.error(
        "there was an error while setting file permission. check your internet and try again"
      );
    }
    finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    setSelectedPermissions(getPermissions(selectedDocType, selectedRoleType));
    console.log(selectedPermissions)
  }, [selectedDocType, selectedRoleType]);
  
  return (
    <div className="  container h-auto mx-auto pt-4 flex flex-col  lg:flex lg:flex-row   border w-screen md:w-[1000px] lg:w-[1100px] xl:w-screen    ">
            <ToastContainer
        position="top-right"
        autoClose={false}
        className="absolute  top-0 right-0 mt-20 p-4  w-[40px] max-w-sm"
      />
      <div className='flex flex-row  w-full md:w-1/3  pl-[10px] md:pl-[32px]'>
          <div className="flex flex-row md:flex-col  mb-4  ">
            <label htmlFor="docTypeList" className="mr-0  my-2 m">
              Document Type:
            </label>
            <select
              id="docTypeList"
              value={selectedDocType}
              onChange={handleDocTypeChange}
              className="border border-gray-300 rounded px-2 py-1  "
            >
              <option value="">Select Document Type</option>
              {initials.map((role,index) => (
                <option key={index} value={role.docType}>
                  {role.docType}
                </option>
              ))}
            </select>
            <label className='my-2'>
              {selectedDocType}
            </label>
          </div>
      </div>


      <div className="w-screen  md:w-1/4  h-[63px] pl-[10px] md:pl-[37px] md:mb-10 ">
        <div className='flex flex-row  md:flex-col '>
        <label htmlFor="roleTypeList" className="mr-10 md:mr-2 my-2">
          Role Type:
        </label>
        
        <select
          id="roleTypeList"
          value={selectedRoleType}
          onChange={handleRoleTypeChange}
          className="border border-gray-300 rounded px-8  md:px-2 py-1"
        >
          <option value="">Select Role Type</option>
          {initials.map((role,index) => (
            <option key={index} value={role.role}>
              {role.role}
            </option>
          ))}
        </select>
        <label className='my-2 '>
          {selectedRoleType}
        </label>
        </div>

      </div>

      

      {/* Render the selected role type details */}
      {selectedDocType && selectedRoleType && (
        <div className=' w-full md:w-1/3 md:pl-[37px] pl-[10px] mt-4'>
          {/* ... */}
          <h4>Permissions:</h4>
          
          <div className='grid grid-cols-2 gap-4'>
            
            {selectedPermissions.map((permission) => (
              <div key={permission.permission} className="items-center">
                <input
                  type="checkbox"
                  
                  defaultChecked={permission.granted}
                  onChange={() => handlePermissionChange(permission)}
                />
                
                <label className="ml-2">{permission.permission}</label>
              </div>
            ))}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 my-4 rounded-lg" onClick={handleSubmit}
           
          >
        {
            isLoading ? (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            ) : (
              "Submit"
            )
          }
          </button>
          <ToastContainer
                  position="top-right"
                  autoClose={4000}
                  className="absolute  top-0 right-0 mt-20 p-4  w-[40px] max-w-sm"
                />
        </div>
      )}

     
    </div>
  );
};

export default Role_management



