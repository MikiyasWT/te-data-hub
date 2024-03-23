import { NextApiResponse } from "next";
import { serialize } from "cookie";
import Cookies from "js-cookie";
import { decodeJwtToken } from "./decodetoken";



// used to store/set cookies
export function setTokenCookie(token: string, expirationDate: Date | null): void {
    let cookieValue = `token=${encodeURIComponent(token)}; path=/; HttpOnly; Secure`;
  
    if (expirationDate) {
      cookieValue += `; expires=${expirationDate.toUTCString()}`;
    }
  
    document.cookie = cookieValue;
  }


  // used to retrieve cookie stored on browser

export function getTokenFromCookie(): string  {
   const cookies = Cookies.get("token");
   if(cookies){
    return cookies
   }
   return ''
  
  
}




//used to check whether on not the token has expired or not
// export function isTokenExpired(token:string) {
//   const expirationDate = new Date(token.expiry); // Assuming the token has an expiry property
//   const currentDate = new Date();
//   return expirationDate < currentDate;
// }


const cookies = decodeJwtToken(getTokenFromCookie());
export function getExpiryDate(cookies:any) {
  // Check if the token is a JSON object.
  if (typeof cookies !== "object" || cookies === null) {
    return null;
  }

  // Check if the cookies has an "exp" property.
  if (!cookies.hasOwnProperty("exp")) {
    return null;
  }

  // Get the expiry timestamp.
  const expiryTimestamp = cookies.exp;

  // Convert the expiry timestamp to a Date object.
  const expiryDate = new Date(expiryTimestamp * 1000);

  // Return the expiry date.
  return expiryDate;
}






