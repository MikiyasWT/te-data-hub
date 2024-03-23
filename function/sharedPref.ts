import { ACCESS_TOKEN } from "../util/constants";

export const setToken = (token:string) =>{
    localStorage.setItem(ACCESS_TOKEN, token);
}

export const getToken = () =>{
    const result = typeof window !== 'undefined'? localStorage.getItem(ACCESS_TOKEN) : "";
    return result
}

