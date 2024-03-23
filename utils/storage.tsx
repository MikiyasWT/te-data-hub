export const setAuthToken = (token:string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  };
  
  export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  export const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };


  export const setResetToken = (resetToken:string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('resetToken', resetToken);
    }
  };

  export const getResetToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('resetToken');
    }
    return null;
  };