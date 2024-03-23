import api from "./api"


//share using email
export interface shareEmailPayload{
  email:string;
}

export async function shareEmail(payload:shareEmailPayload) {
    try {
        return await api.post('/sales/shareEmail',payload)       
    } catch (error) {
      console.error('Unable share using email :', error);
      throw error;
    }
    
}

//share using whatsapp
export interface shareWhatsappPayload{
    email:string;
}
  
export async function shareWhatsapp() {
      try {
          return await api.post('/sales/shareWhatsapp')       
      } catch (error) {
        console.error('Unable share using whatsapp :', error);
        throw error;
      }
      
  }

//check sharing link
export interface checkSharingLinkPayload{
    
}
  
export async function checkSharingLink() {
      try {
          return await api.post('/sales/shareWhatsapp')       
      } catch (error) {
        console.error('Unable share using whatsapp :', error);
        throw error;
      }
      
  }

//share using telegram
export interface shareTelegramPayload{
    
}
  
export async function shareTelegram() {
   try {
       return await api.post('/sales/shareWhatsapp')       
      } catch (error) {
        console.error('Unable share using telegram :', error);
        throw error;
      }
      
  }