import api from "./api";


interface Notification {
    title: string;
    body: string;
    email: string;
  }
 
export async function createNotificationApi(payload:Notification){
    try {
        return await api.post('notification/create',payload)
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error; // Re-throw the error to propagate it to the caller or handle it further up the call stack
    }
}



//this is for a user with admin privileges
export async function getAllNotifcations(page:number,itemsPerPage:number){
    
    try {
         const response = await api.get('notification/all', {
            params: {
              page: page,
              limit:itemsPerPage
            },
          });
      
          const totalNotifications = response.data.pagination.total;
          const notification = response.data.notification;
          const success = response.data.success;
          
          return {totalNotifications,success,notification}
    } catch (error) {
        console.error('Error fetching  notification:', error);
        throw error; 
    }
}


//this one is for a user with no admin roles only return notications associated with him  or her
export async function getUserNotication(email:string){
    try {
        return await api.get(`notification/show?email=${email}`)
    } catch (error) {
        console.error('Error to fetch your notification  notification:', error);
        throw error; 
    }
}



interface updatedNotification{
  id:number;
  newTitle:string;
  newBody:string;

}
//edit notifcations only for user with admin privileges
export async function editNotifcation(payload:updatedNotification){
    try {
        return await api.put('notification/edit',payload)
    } catch (error) {
        console.error('Error unable to update notifcation:', error);
        throw error; 
    }
}


export async function deleteNotifcation(id:number){
    
    try {
        
        return await api.delete(`notification/delete/${id}`)
    } catch (error) {
        console.error('Error unable to delete Notification:', error);
        throw error; 
    }
}






