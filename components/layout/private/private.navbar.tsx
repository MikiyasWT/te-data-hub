import Image from "next/image";
import notificationbell from "../../../public/icons/notificationbell.svg";
import randomuser from "../../../public/images/random-user.jpg";
import downarrow from "../../../public/icons/downarrow.png";
import techethiologo from "../../../public/TechethioLogo.svg";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import searchicon from "../../../public/icons/searchicon.png";

import uparrow from "../../../public/icons/uparrow.png";

import checked from "../../../public/icons/checked.svg";
import { open } from "fs/promises";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducer";
import {
  displayNotification,
  displayUserInfo,
  setUnreadMessages,
} from "../../../redux/action";
import router from "next/router";
import { getAllNotifcations } from "../../../services/notifcation";
import { CombinedAppState } from "../../../redux/types";
import { decodeJwtToken } from "../../../utils/decodetoken";
import { getTokenFromCookie } from "../../../utils/cookie";
import {generateRandomColor} from '../../../utils/randomColor'
interface PROPS {
  sidebarStatus: boolean;
  setSidebarStatus: any;
  currentPage: String;
  setIsHamburgerMenuClicked: Dispatch<SetStateAction<boolean>>;
  RandomColor:string;
}

const Navbar = ({
  sidebarStatus,
  setSidebarStatus,
  currentPage,
  setIsHamburgerMenuClicked,RandomColor
}: PROPS) => {
  const [filtervalue, setFiltervalue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleImageClick = () => {
    setShowUserInfo(!showUserInfo);
  };
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.notification);
  const userInfo = useSelector((state: RootState) => state.userInfo);

 
  const unreadMessages = useSelector((state: CombinedAppState) => state.unreadMessages);

  const NumberOfUnreadMessages = useSelector(
    (state: RootState) => state.unreadMessages
  );

  // const unreadMessages = useSelector(
  //   (state: RootState) => state.unreadMessages
  // );

  const handleFilter = () => {
    setOpenFilter((prev: boolean) => !prev);
  };



  const openMenu = () => {
    setIsHamburgerMenuClicked((prev) => !prev);
  };

  const notificationHandler = (e:any) => {
    e.stopPropagation()
    //dispatch(displayUserInfo());
    if(userInfo){
       if(!notification){
        dispatch(displayNotification());
      }
      dispatch(displayUserInfo());
    }
    else if(notification){
      dispatch(displayNotification());
    }
    else if(!userInfo && !notification){
      dispatch(displayNotification());
    }
    else if(!notification){
      dispatch(displayNotification());
      //dispatch(displayUserInfo());
    }
    else if(notification){
      dispatch(displayNotification());
    }
    
  };

  const userInfoHandler = (e:any) => {
    e.stopPropagation()
    const isMobile = window.innerWidth <= 768


     if(notification){
      dispatch(displayNotification());
      dispatch(displayUserInfo());
     }
     else if(userInfo){
      dispatch(displayUserInfo());
     }
     else{
      dispatch(displayUserInfo());
     }
     

     
    
   
  };



  const [thispage,setThisPage] =  useState('')
  

  useLayoutEffect(()=>{

    if(router.pathname === "/dashboard"){
      setThisPage("Dashboard")
    }
    else if(router.pathname === "/customers"){
      setThisPage("Customers")
    }
    else if(router.pathname === "/branch"){
      setThisPage("Branch")
    }
    else if(router.pathname === "/product"){
      setThisPage("Product")
    }
    else if(router.pathname === "/sales"){
      setThisPage("Sales")
    }
    else if(router.pathname === "/user"){
      setThisPage("Users")
    }
    else if(router.pathname === "/settings"){
      setThisPage("Settings")
    }


  },[router.pathname])

  


 const userNameInitials = () => {
  const decodedPayload = decodeJwtToken(getTokenFromCookie());
  const userName=decodedPayload?.firstName;
  const words = userName?.split(' ');

  // Retrieve the first character of each word and convert it to uppercase
  const initials = words?.map((word: string) => word.charAt(0).toUpperCase());

  const fullNameInitials = initials?.join('');

  return fullNameInitials
}

const companies = () => {
  const decodedPayload = decodeJwtToken(getTokenFromCookie());
  const companyName = decodedPayload?.compantType;


  return companyName;
}




const [randomColor, setRandomColor] = useState("");

 useLayoutEffect(()=>{
  console.log(unreadMessages)
  setRandomColor(RandomColor)
 },[]) 

 const handleOpenedModals = (e:any) => {
    e.stopPropagation()
     if(userInfo){
      dispatch(displayUserInfo());
     }
     else if(notification){
      dispatch(displayNotification());
     }
 }

  
  return (
    <div onClick={handleOpenedModals}
      className={` fixed top-0 md:z-20 z-40 flex flex-col flex-grow w-full h-[90px] max-w-screen overflow-x-hidden bg-white  md:bg-white-400`}
    >
      <div className="flex flex-row flex-1 flex-grow-1 justify-between md:justify-between w-full h-[70px]  pl-[10px] md:px-[30px]">
        <div
          onClick={openMenu}
          className="md:hidden flex flex-row  justify-start w-[100px] h-full cursor-pointer"
        >
          <Image
            src={techethiologo}
            alt="Image Description"
            width={70}
            height={60}
            className="mt-4 px-1 "
          />
          <div
            className={` w-[200px] flex flex-col py-8 ${
              sidebarStatus ? "ml-[10px] md:ml-[50px]" : "sm:ml-1 md:ml-[250px]"
            }    w-[220px]  h-full `}
          >
            <h1 className="text-black text-3xl text-center">{thispage}</h1>
          </div>
        </div>

        <div className="hidden sm:block ">
          <div
            className={`w-[200px] flex flex-col  sm:hidden md:flex ${
              sidebarStatus ? "ml-[10px] md:ml-[50px]" : "sm:ml-1 md:ml-[250px]"
            }   py-6 w-[220px]  h-full `}
          >
            <h1 className="text-black text-3xl ">{thispage}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <div className={` relative  flex flex-col flex-grow items-center `}>
              <div className="relative mx-4 ">
                <div className="flex items-center text-base font-semibold leading-5 font-open-sans tracking-tighter break-words">
                  <select className="w-full appearance-none bg-white border  border-gray-200 rounded-md py-2 px-20 text-center  leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-blue-500">
                    <option className=" color: #4C8BF5;">{companies()}</option>

                   
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Image
                      src={downarrow}
                      alt="down arrow icon"
                      height={14.122}
                      width={9.182}
                      className='text-blue-500"'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
                
          {/* Notification Bell */}
          <div
            onClick={notificationHandler}
            className="flex items-center relative cursor-pointer"
          >
            <div className="rounded-full  bg-red-500 absolute top-[-15px]  right-[-4px] px-[5px]  ">
              <span className="text-white text-sm">
                {NumberOfUnreadMessages > 0 ? NumberOfUnreadMessages : ""}
              </span>
            </div>

            {/* notifaction display */}

            <Image
              src={notificationbell}
              alt="notification bell icon"
              width={24}
              height={24}
            />
          </div>
          {/* User Profile */}
          <div className="flex items-center space-x-2 cursor-pointer">
            {/* test */}
            <div className="relative">
            <div onClick={userInfoHandler} style={{ background: randomColor }} className=" rounded-full w-10 h-10 flex items-center justify-center cursor">
  <h1 className="text-white ">{userNameInitials()}</h1>
</div>
            </div>
            {/* end of test */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
