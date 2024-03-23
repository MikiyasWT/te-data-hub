import api from "./api";


//api to update already registered user role
interface RoleItem {
    role: string;
    granted: boolean;
  }
  
  interface RolesPayload {
    email: string;
    newRoles: RoleItem[];
  }
  
//   const payload: RolesPayload = {
//     email: "hiwotzelalem3@gmail.com",
//     newRoles: [
//       { role: "sales", granted: false },
//       { role: "admin", granted: true },
//       { role: "sales", granted: false },
//     ],
//   };
  
  
  export async function updateUserRole(payload:RolesPayload){

    console.log(payload) 
    
    try {
       const sth = await api.put('/role/update', payload, { withCredentials: true});
      debugger;
      return sth
    } catch (error) {
      console.error('unable to update user role, check your internet and try again:', error);
      throw error;
    } 
  }
    export async function RoleList(){
      try {
      
        return  await api.get(`role/showR`)  
          
         // return role  
      } catch (error) { 
        console.error('Unable to get role list :', error);
        
        throw error;
      } 
  }
  export async function userRoleList(id: any){
    try {
    
      return  await api.get(`role/show?email=${id}`)  
        
       // return role  
    } catch (error) { 
      console.error('Unable to get role list :', error);
      
      throw error;
    } 
}





//get all roles and documents permissions

///role/showAll
export async function getRolesAndDocumentList(){
  try {
      return await api.get(`role/showAll`)
  } catch (error) {
    console.error('Unable to get role and document permission list :', error);
  }
}

  
  
  
  
  
  
  
  
  