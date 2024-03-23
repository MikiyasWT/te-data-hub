import api from './api';

//getUsers
export interface getUsersPayload {
    firstName:string;
    lastName:string;
    email:string;
    password:string;
   
  }
  export interface EditPayload{



    email: string,
    newEmail: string,
    newFirstName:string,
    newLastName: string,
    newType:string
  }
  
  export async function getUsers(page:number,
    itemsPerPage:number) {
    try {
      const response = await api.get(`/user/all`, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
      });
  
      
      const totalItems = response.data.pagination.total;
  
      // Extract the sales data from the response
      const users = response.data.users;
  
      return { users, totalItems };
    } catch (error) {
      console.error('Unable to get users data:', error);
      throw error;
    }
  }

  export async function getUsersActivity(page:number,
    itemsPerPage:number){

    try {
      const response= await api.get('/user-activity', {
        params: {
          page: page,
          limit: itemsPerPage,
        },
      });
      const totalItems = response.data.pagination.total;
  
      // Extract the sales data from the response
      const activity = response.data.activity;
  
      return { activity, totalItems };
    } catch (error) {
      console.error('unable to get users activity error:', error);
      throw error;
    }
  }
  
  export async function getEachUsersActivity(id: any){
    try {
      return  await api.get(`/show?email=${id}`);

    } catch (error) {
      console.error('unable to get users activity error:', error);
      throw error;
    }
  }

//  update user role
export interface updateUserRolePayload {

}

export async function updateRole() {
    try {
        return await api.put('/users/updateRole',)
    } catch (error) {
      console.error('update role error:', error);
      throw error;
    }
}


//delete user
export interface deleteUserPayload {

}

export async function deleteUser(userEmail: string) {
    try {
        return await api.delete('/user/delete', { data: { email: userEmail } });      
    } catch (error) {
      console.error('delete user error :', error);
      throw error;
    }
}

export const updateUser = async (payload:EditPayload) => {
  try {
    console.log("this is api payload",payload)
    const response = await api.put('/user/update', payload, { withCredentials: true}); 
    console.log("response",response.data)
    console.log("this is last payload",payload)
    return response.data.user;
  } catch (error) {
    // Handle the error appropriately
    throw new Error('Unable to update user');
  }
};

//update profile
export interface updateProfilePayload {

}

export async function updateProfile(){
    try {
        return await api.put('/users/me')       
    } catch (error) {
      console.error('update profile error :', error);
      throw error;
    }
}


//show profile
export interface showProfilePayload {

}

export async function showProfile(email: any) {
    try {
        return await api.get(`user/show?&email=${email}`)       
    } catch (error) {
      console.error('show profile error :', error);
      throw error;
    } 
}
export async function importUser(formData:any){
  try {
      const response=await api.post('/user/import',formData) 
return response
  } catch (error) {
    console.error('Unable to import user information :', error);
    throw error;
  } 
}