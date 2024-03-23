

import jwt from 'jsonwebtoken';

interface JwtPayload {
  roles: string[];
  firstName:string;
  email:string;
  compantType:string;
  // Other properties in your JWT payload
}

export function decodeJwtToken(token: string): JwtPayload | null {
  try {
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}



// takes a decoded token and then retun its exspiration date
export function getTokenExpiration(decodedToken: Record<string, any>): Date | null {
  if (decodedToken && decodedToken.exp) {
    const expirationTimestamp = decodedToken.exp;
    const expirationDate = new Date(expirationTimestamp * 1000); // Convert from seconds to milliseconds
    return expirationDate;
  }

  return null;
}