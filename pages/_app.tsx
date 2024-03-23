import "../styles/globals.css";
import { AppProps } from "next/app";
import { StrictMode, useEffect, useLayoutEffect, useState } from "react";
import Layout from "../components/layout/layout";
import { Provider, useDispatch, useSelector } from "react-redux";
import configureStore from "../redux/store";
import { getAuthToken, removeAuthToken } from "../utils/storage";
import { useRouter } from "next/router";
import Link from "next/link";
import { getExpiryDate, getTokenFromCookie } from "../utils/cookie";
import Cookies from "js-cookie";
import { decodeJwtToken } from "../utils/decodetoken";

const jwt = require("jsonwebtoken");

export default function MyApp({ Component, pageProps }: AppProps) {
  //this can be the presence of a token stored in the browser local storage
  const token = getAuthToken();
  const store = configureStore();
  const router = useRouter();
  const [isSSR, setIsSSR] = useState(true);
  const [cookies, setCookies] = useState(Cookies.get("token"));
  const [notification,setNotification] = useState()
  
  const allowedComponents = [
    "/auth/signup",
    "/auth/signin",
    "/auth/forgotPassword",
    "/auth/verify",
    "/auth/resetPassword/[resetToken]",
  ];

  useEffect(() => {
    setIsSSR(false);
  }, []);

  
 



  useEffect(() => {
    if (!allowedComponents.includes(router.pathname)) {
      if (cookies === undefined || !token) {
        //router.push("/auth/signin");
        window.location.href = "/auth/signin";
      }
    }
    // if (cookies && isTokenExpired(cookies)) {
      // const isCookieRemoved = Cookies.remove("token");
      // removeAuthToken();
      // window.location.href = "/auth/signin";
    // }
  }, [cookies, token]);

  const expirydate = getExpiryDate(cookies);
  const decodedcookies = decodeJwtToken(getTokenFromCookie());

  function isTokenExpired(cookies: any) {
    const decodedToken = jwt.decode(cookies);
    const expiryDate = new Date(decodedToken?.exp * 1000);

    const currentDate = new Date();
    //if expiry date is greater than now thats good and sholuld return true
    const isCookieExpired = expiryDate > currentDate;

    return isCookieExpired;
  }

  useEffect(() => {
    if (router.isFallback) return; // Skip during Next.js fallback phase

    if (!token && !allowedComponents.includes(router.pathname)) {
      //router.replace('/404'); // Redirect to custom 404 page
      <Custom404 />;
    }
  }, [token, cookies, router.pathname]);

  if (
    token &&
    cookies != undefined &&
    !isSSR &&
    !allowedComponents.includes(router.pathname)
  ) {
    const decodedPayload = decodeJwtToken(getTokenFromCookie());
    const roles = decodedPayload?.roles;

    console.log(isTokenExpired(token));
    if(!isTokenExpired(cookies)){
      const isCookieRemoved = Cookies.remove("token");
      removeAuthToken();
      window.location.href = "/auth/signin";
    }
    return (
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }

  // Render only specific components for non-authenticated users

  if (allowedComponents.includes(router.pathname)) {
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }

  return null; // or render a loading spinner or a message indicating that authentication is required
}

export const Custom404 = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Go back to the homepage</Link>
    </div>
  );
};

function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
