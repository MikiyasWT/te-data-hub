export const userNameInitials = () => {
    const decodedPayload = decodeJwtToken(getTokenFromCookie());
    const userName=decodedPayload?.fullName;
    const words = userName.split(' ');
  
    // Retrieve the first character of each word and convert it to uppercase
    const initials = words.map((word) => word.charAt(0).toUpperCase());
  
    const fullNameInitials = initials.join('');
  
    return fullNameInitials
  }