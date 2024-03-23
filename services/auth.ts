import api from './api';

//signup
export interface SignUpPayload {
  firstName:string;
  lastName:string;
  email:string;
  password:string;
  compantType:string;
}

export async function signupApi(payload:SignUpPayload){

  try {
    return  await api.post('/auth/signup', payload, { withCredentials: true});
    
  } catch (error) {
    console.error('SignUp error:', error);
    throw error;
  }
}




//signIn
export interface SigninPayload {
  email:string;
  password:string;
}

export async function signInApi(payload:SigninPayload ){
  try {
    return await api.post('/auth/signin', payload, { withCredentials: true})
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
}


//forgotPassword
export interface forgotPasswordPayload {
  email:string;
}

export async function forgotPasswordApi(payload:forgotPasswordPayload) {
  try {
    return await api.post('/auth/forgot',payload)
  } catch (error) {
    console.error('forgot password error:', error);
    throw error;
  }
}


export async function fetchCompanies() {
  try {
      return await api.get('/company/all')       
  } catch (error) {
    console.error(error);
    throw error;
  } 
}



//reset password
export interface resetPasswordPayload {
  resetToken:null | string | string[] | undefined
  newPassword:string;
}

export async function resetPasswordApi(payload:resetPasswordPayload) {
  try {
    return  await api.post('/auth/reset',payload)
  } catch (error) {
    console.error('reset password error:', error);
    throw error;
  }
}


//confirm Email
export interface confirmEmailPayload {
  confirmationCode:string;
}

export async function confirmEmailApi(payload:confirmEmailPayload){
  try {
       return await api.post('/auth/confirm', payload, {withCredentials: true})
  } catch (error) {
    console.error('Email confirmation error:', error);
    throw error;
  }
}


//logout error
export interface logoutPayload {
  email:string;
}

export async function logoutApi(payload:logoutPayload){
  try {
       return await api.get('/auth/logout', { params: payload })
  } catch (error) {
    console.error('logout error:', error);
    throw error;
  }
}









