import api from './api';

//api generation pages/settings/api_generation
export interface ApiGeneratorPayload {
  roles:any;
}

export async function apiGeneratorApi(payload:ApiGeneratorPayload ){

  
  try {

    console.log(payload);
    
    return  await api.post('/generate-token', payload, { withCredentials: true});
    
  } catch (error) {
    console.error('Unable to generate API error:', error);
    throw error;
  }
}





//use to set document access permissions and roles associated with it
interface Permission {
  permission: string;
  granted: boolean;
}

interface DocumentPermissionspayload {
  Document?: string;
  Role: string;
  permissions: Permission[];
}


export async function setDocumentPermission(payload:DocumentPermissionspayload){
  try {
    return  await api.post('/rp/set', payload, { withCredentials: true});
  } catch (error) {
    console.error('Unable to set documents permissions for this role:', error);
    throw error;
  }
}



