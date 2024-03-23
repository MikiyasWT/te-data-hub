import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import Cookies from "js-cookie";
import searchicon from "../../../public/icons/searchicon.png";
import Image from "next/image";
import randomuser from "../../../public/images/random-user.jpg";
//import uparrow from "../../../public/icons/uparrow.png"
import downarrow from "../../../public/icons/downarrow.png";
import uparrow from "../../../public/icons/uparrow.svg";
import checked from "../../../public/icons/checked.svg";
import { open } from "fs/promises";
import hamburgurmenu from "../../../public/icons/hamburgermenu.svg";
import debounce from "lodash.debounce";
import { useDebounce } from "../../CustomHook/useDebounce";
import Icon from "../../Icons/Icon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducer";
import { logoutApi } from "../../../services/auth";
import { useRouter } from "next/router";
import api from "../../../services/api";
//import { showCustomer } from "../../../services/customer";
import axios from "axios";
import { notificationsData } from "../../../utils/data";
import {
  setUnreadMessages,
  setQuery,
  setNotificationMessage,
  displayUserInfo,
  displayNotification,
} from "../../../redux/action";
import Modal from "react-modal";
import CustomFilter from "../../filter";
import { getAuthToken, removeAuthToken } from "../../../utils/storage";
import { decodeJwtToken } from "../../../utils/decodetoken";
import { getTokenFromCookie } from "../../../utils/cookie";
import { getAllNotifcations } from "../../../services/notifcation";
import Link from "next/link";
import { generateRandomColor } from "../../../utils/randomColor";
import ProductFilter from "../../../pages/product/productFilter";
import { CombinedAppState } from "../../../redux/types";
import { ITEMS_PER_PAGE } from "../../../constants/config";

interface PROPS {
  children: React.ComponentType;
  sidebarStatus: boolean;
  currentPage: string;
  setSidebarStatus: any;
  isHamburgerMenuClicked: boolean;
  setIsHamburgerMenuClicked: Dispatch<SetStateAction<boolean>>;
  RandomColor:string;
}
type Notification = {
  id: number;
  title: string;
  body: string;
  email: string;
  isRead: boolean;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
};
type NotificationArray = Notification[];

export interface MessageState {
  message: NotificationArray;
}

const Maincanvas = ({
  children,
  sidebarStatus,
  setSidebarStatus,
  isHamburgerMenuClicked,
  setIsHamburgerMenuClicked,
  currentPage,RandomColor
}: PROPS) => {
  const [filterOptions, setFilterOptions] = useState([]);
  const messages = useSelector((state: RootState) => state.notificationMessage);
  const unreadMessages = useSelector((state: CombinedAppState) => state.unreadMessages);
  
  const [currentNotification, setCurrentNotification] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState();
  const notificationsPerPage = 20; 

 
  
  const router = useRouter();
  const dispatch = useDispatch();

 
  const [orderedNotifications, setOrderedNotifications] = useState();

  const OrderedNotifications = messages.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (dateA > dateB) {
      return -1; // a comes before b
    } else if (dateA < dateB) {
      return 1; // b comes before a
    } else {
      return 0; // a and b are equal
    }
  });

  const [notifications, setNotifications] =
    useState<NotificationArray>(OrderedNotifications);

  const [newUpdatedNotification, setNewUpdatedNotification] =
    useState<NotificationArray>(notifications);

    const NumberOfUnreadMessages = useSelector(
      (state: RootState) => state.unreadMessages
    );


    const fetchMessages = async (currentNotification:number,notificationsPerPage:number) => {
     
      try {
        //currentNotification, totalNotifications, notificationsPerPage
        const response = await getAllNotifcations(currentNotification,notificationsPerPage);
        if (response.success) {
          setTotalNotifications(response.totalNotifications)
          dispatch(setUnreadMessages(response.totalNotifications));
          dispatch(setNotificationMessage(response.notification));
        }
      } catch (error) {
        console.log("Unable to pull down notifications");
      }
    };
  useEffect(() => {


    fetchMessages(currentNotification,notificationsPerPage);
    // console.log()
  }, [dispatch,currentNotification]);



  useEffect(() => {
    setNotifications(messages);
    setNewUpdatedNotification(notifications);
  }, [messages, notifications]);

  // setNotifications(messages);
  // setNewUpdatedNotification(notifications)



  const handleFilterChange = (newFilterOptions: any) => {
    // Perform your filter logic here
    console.log("Filter options:", newFilterOptions);
  };

  //const debouncedSearch = useDebounce(handleSearch, 0); // 300ms debounce delay, adjust as needed
  const debouncedFilterChange = useDebounce(handleFilterChange, 3000); // 300ms debounce delay, adjust as needed

  const handleSearchInputChange = (event: any) => {
    const { value } = event.target;
    dispatch(setQuery(value));
    //setSearchTerm(value);
    //debouncedSearch(value);
  };

  const handleFilterOptionChange = (newOptions: any) => {
    setFilterOptions(newOptions);
    debouncedFilterChange(newOptions);
  };

  const notificationHandler = (id: number) => {
    const updatedNotifications = notifications?.map((notif) => {
      if (notif.id === id) {
        return {
          ...notif,
          isSelected: !notif.isSelected,
          isRead: true,
        };
      }

      return notif;
    });
    dispatch(setUnreadMessages(NumberOfUnreadMessages-1));
    dispatch(setNotificationMessage(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications?.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    dispatch(setNotificationMessage(updatedNotifications));
    dispatch(setUnreadMessages(0));
    // setNotifications(updatedNotifications);
    // setNewUpdatedNotification(updatedNotifications);
  };

  const displaySelected = async (choice: number) => {
    if (choice >= 1) {
      const filteredNotifications = await notifications?.filter(
        (notification) => !notification.isRead
      );

      dispatch(setNotificationMessage(filteredNotifications));
    } else {
      const filteredNotifications = await notifications?.filter(
        (notification) => notification.isRead
      );
      dispatch(setNotificationMessage(filteredNotifications));
    }
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [openMobileFilter, setOpenMobileFilter] = useState(false);
  const handleFilter = () => {
    setOpenFilter((prev: boolean) => !prev);
  };

  const handleMobileFilter = () => {
    setOpenMobileFilter((prev: boolean) => !prev);
  };

  const handleBurgerMenu = () => {
    return setIsHamburgerMenuClicked((prev) => !prev);
  };

  const signOutHandler = async () => {
    try {
      const isCookieRemoved = Cookies.remove("token");
      await removeAuthToken();
      console.log(isCookieRemoved);
      if (isCookieRemoved === undefined || getAuthToken() === null) {
        //window.location.href = '/';
        router.push("/");
      }
    } catch (error: any) {
      console.log("unable to signout user");
    }
  };

  const notification = useSelector((state: RootState) => state.notification);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const query = useSelector((state: RootState) => state.query);
  

  const token = getTokenFromCookie();
  const decodedPayload = token ? decodeJwtToken(token) : null;
  const userRoles = decodedPayload?.roles

  // const decodedPayload = decodeJwtToken(getTokenFromCookie());
  // const userRoles = decodedPayload?.roles.join(", ");

  const userName = decodedPayload?.firstName;
  const userEmail = decodedPayload?.email;
  // console.log("this is user info :",userName)
  //  console.log("this is user info :",decodedPayload)



  //thes codes below are tightly coupled with filter modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const { pathname } = router;
  const [url, setUrl] = useState(pathname);

  useLayoutEffect(() => {
    const userRole = userRoles;
    const hasPermission = checkRoutePermission();
    console.log(hasPermission);

    if (!hasPermission) {
      router.push("/dashboard"); // Redirect to the desired page if permission is not granted
    }
  }, []);

  const checkRoutePermission = () => {
    const test = Array.isArray(userRoles);

    if (userRoles?.includes("admin")) {
      return true; // Always return true if "admin" role is present
    }

    return userRoles?.some((role) => role === pathname); // Check if current pathname matches any role
  };



  const userNameInitials = () => {
    const decodedPayload = decodeJwtToken(getTokenFromCookie());
   
    const userName=decodedPayload?.firstName;
    const words = userName?.split(' ');
  
    // Retrieve the first character of each word and convert it to uppercase
    const initials = words?.map((word: string) => word.charAt(0).toUpperCase());
  
    const fullNameInitials = initials?.join('');
     
    return fullNameInitials
  }
  
  const [randomColor, setRandomColor] = useState("");

 useLayoutEffect(()=>{
 
   setRandomColor(RandomColor)
 },[currentNotification]) 

 const checkOpenedModals = () => {
    if(openFilter){
      setOpenFilter(!openFilter);
    }
    else if(userInfo){
      dispatch(displayUserInfo());
    }
 }



 const handleOpenedModals = (e:any) => {
  e.stopPropagation();
  if(openFilter){
    setOpenFilter(!openFilter)
  }
   else if(userInfo){
    dispatch(displayUserInfo());
   }
   else if(notification){
    dispatch(displayNotification());
   }
}




const handleNextNotification = async () => {
  
  if(totalNotifications){
    if (currentNotification < totalNotifications && ((totalNotifications/notificationsPerPage)> currentNotification)) {
      await fetchMessages(currentNotification+1,notificationsPerPage);
      await  setCurrentNotification((prev)=>prev + 1);
    
  }
  }
};

const handlePreviousNotification = async () => {
  if (currentNotification > 1) {
    await fetchMessages(currentNotification - 1, notificationsPerPage);
    await setCurrentNotification((prev) => prev - 1);
  }
};

  return (
    <div
      onClick={handleOpenedModals}
      className={`  fixed overflow-x-scroll  top-[96px]  ${
        sidebarStatus
          ? "left-[20px] md:left-[60px] "
          : "left-0 md:left-[260px]  bg-white "
      }  right-0 left-0   h-full pb-20 pl-4 overflow-x-auto hideScrollbar   `}
    >
      {/* global search fillter sort div */}
      <div className="hidden  md:block lg:block xl:block">
        <div
          className={`flex flex-col ml-[24px] mr-[24px] md:mr-[177px]  h-[40px] w-full  px-[2px] border-none `}
        >
          <div className={` flex w-[100px] md:w-[790px] h-[40px]  `}>
            {/* <Image
                src={searchicon}
                alt="Image Description"
                width={16}
                height={2}
            /> */}

            <div
              className={`${
                router.pathname === "/customers" ||
                  router.pathname === "/branch" ||
                  router.pathname === "/product" ||
                  router.pathname === "/sales" ||
                  router.pathname === "/user" 
                  ? "block"
                  : "hidden"
              }`}
            >
              <Icon w="5" h="4" color="blue-500" radius="2" path="search" />
            </div>

            <div className={`  flex ml-[31px] px-1 items-center `}>
              <input
                type="text"
                placeholder={"Search"}
                value={query}
                onChange={handleSearchInputChange}
                className={` text-gray-400 ${
                  sidebarStatus ? "w-[890px]" : "w-[734px]"
                }  h-[36px] px-2   border border-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${
                  router.pathname === "/customers" ||
                  router.pathname === "/branch" ||
                  router.pathname === "/product" ||
                  router.pathname === "/sales" ||
                  router.pathname === "/user" 
                    ? "block"
                    : "hidden"
                } `}
              />
              {/* FILTER AND SORT */}

              {/* notification */}

              <div
                className={` ${
                  sidebarStatus ? "w-[280px]" : "w-[189px]"
                } h-[40px] flex items-center  `}
              >
                {/* user infomation */}
                {/* user infomation */}
                {userInfo && (
                  <div onClick={(e)=>e.stopPropagation()} className="fixed z-10 top-24 w-[300px] h-[260px] border  right-5 bg-white shadow-xl text-black pb-4 rounded-xl">
                    <div className=" shadow-md w-full h-full md:w-auto">
                      <div className=" flex flex-col gap-4">
                        <div className=" flex flex-col ">
                          <div className="w-full bg-gray-100 flex gap-6">
                            <div>
                            <div className="relative px-auto">
                                  
                                  <div  style={{ background: randomColor }} className="rounded-full w-16 h-16 flex items-center justify-center cursor">
    <h1 className="text-white ">{userName}</h1>
  </div>
                                  </div>
                            </div>
                            <div>
                              {" "}
                              <h3 className="text-center text-black font-semibold text-md">
                                {userName}
                              </h3>
                              {/* <div className="w-full border border-gray-400"></div> */}
                              <div className="w-full ">
                                <h5 className="text-center text-black text-md">
                                  {userRoles}
                                </h5>
                              </div>
                              <div className="w-full ">
                                <h5 className="text-center text-black text-md">
                                  {userEmail}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white border"></div>
                        </div>
                        <div>
                          <ul className="flex flex-col items-left space-y-4">
                            <li className="hover:bg-gray-100 ">
                              <Icon
                                w="5"
                                h="4"
                                color="gray-500"
                                radius="2"
                                path="user"
                              />
                              <a
                                href="#"
                                className="text-black hover:text-gray-500 hover:text-xl"
                              >
                                Your Profile
                              </a>
                            </li>
                            <li className="hover:bg-gray-100 ">
                              <Icon
                                w="5"
                                h="4"
                                color="gray-500"
                                radius="2"
                                path="setting"
                              />
                              <a
                                href="#"
                                className="text-black hover:text-gray-500 hover:text-xl"
                              >
                                Settings &amp; Privacy
                              </a>
                            </li>
                            <li
                              className="hover:bg-gray-100 "
                              onClick={signOutHandler}
                            >
                              <Icon
                                w="5"
                                h="4"
                                color="gray-500"
                                radius="2"
                                path="signout"
                              />
                              <a
                                href="#"
                                className="text-black hover:text-gray-500 hover:text-xl"
                              >
                                Sign Out
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* end of user information */}
                {/* end of user information */}

                {/* filter */}
                {/* // testing for filters */}
                <div
                  className={`${
                    sidebarStatus ? "w-[130px]" : "w-[70px]"
                  } relative  h-[36px] flex`}
                >
                  <div
                    onClick={handleFilter}
                    className={`flex gap-0 h-[30px] ml-1 ${
                      router.pathname === "/customers" ||
                      router.pathname === "/product" ||
                      router.pathname === "/sales" 
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    <h2 className="font-bold">Filter </h2>
                    <div>
                      <Image
                        src={uparrow}
                        alt="down arrow icon"
                        height={9}
                        width={9}
                        className="my-2 mx-3"
                      />
                    </div>
                  </div>
                  {openFilter && (
                    <Modal
                    isOpen={true}
                    onRequestClose={closeModal}
                    overlayClassName=" bg-black bg-opacity-50 md:fixed top-0 bottom-0 left-0 right-0 h-full w-full md:w-[648px] lg:w-[1440px] xl:w-full z-50 flex justify-center items-center"
                    className="hidden sm:block bg-white w-full md:w-[992px] h-[361px] ml-[240px] mr-[183px] mt-[256px] mb-[407px] rounded-8 outline-none "
                  
                    >
                      {router.pathname === '/product' && <ProductFilter 
                                              setOpenFilter={setOpenFilter}
                                              setOpenMobileFilter={() => {}}/>}
                      {router.pathname === '/customers' &&  <CustomFilter
                        setOpenFilter={setOpenFilter}
                        setOpenMobileFilter={() => {}}
                      /> }
                    </Modal>
                  )}
                </div>

                {/* testing for filters ends here */}
                {/* sort */}
                {/* testing div for filter */}
                {/* end of sort */}
              </div>

              {/* FILTER AND SORT ENDS HERE */}
            </div>
          </div>

          {/* notification */}
          {notification && newUpdatedNotification.length > 0 && (
            <div onClick={(e)=>e.stopPropagation()}
              className={` ${
                sidebarStatus
                  ? "w-[624px] right-[150px]"
                  : "w-[424px] right-[80px]"
              } absolute z-10 top-0  h-[405px]  bg-white  overflow-y-auto hideScrollbar border border-slate-200  shadow-xl rounded-md `}
            >
              <div
                className={`fixed h-[70px]  ${
                  sidebarStatus ? "w-[624px]" : "w-[424px]"
                } bg-white border border-white rounded-sm  hideScrollbar  `}
              >
                <div className="w-full h-full bg-white  flex flex-col px-4 py-2">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <div className="text-gray-700 text-xl font-normal font-open-sans break-words">
                        Notifications
                      </div>
                      <div className="flex gap-1">
                        {/* <div onClick={()=>displaySelected(0)} className="text-gray-400 text-sm font-normal font-open-sans break-words cursor-pointer">
                              Read
                            </div> */}
                        <div
                          onClick={() => displaySelected(2)}
                          className="text-gray-400 text-sm font-normal font-open-sans break-words cursor-pointer"
                        >
                          Unread
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={markAllAsRead}
                      className="text-gray-600 text-base font-normal font-open-sans break-words cursor-pointer"
                    >
                      Mark all as read
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="notifcationList h-full mt-18 overflow-x-hidden overflow-y-auto hideScrollbar ">
                {newUpdatedNotification.map((notifcation, index) => (
                  <div
                    onClick={() => notificationHandler(notifcation.id)}
                    key={index}
                    className={` h-1/6 mt-1 cursor-pointer ${
                      sidebarStatus ? "w-[624px]" : "w-[424px]"
                    } border border-white rounded-sm  flex ${
                      !notifcation.isSelected && !notifcation.isRead
                        ? "bg-[#c5c1c166]"
                        : ""
                    } ${notifcation.isSelected ? " h-[120px] " : ""}`}
                  >
                    <div
                      className={` w-1/6 h-full flex  ${
                        notifcation.isSelected
                          ? " h-[140px] items-start justify-center"
                          : "items-center justify-center"
                      }    `}
                    >
                     
                     <svg width="24" height="24" stroke-width="2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7V9" stroke="red" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 13.01L12.01 12.9989" stroke="red" stroke-linecap="round" stroke-linejoin="round"/> <path d="M3 20.2895V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H7.96125C7.35368 17 6.77906 17.2762 6.39951 17.7506L4.06852 20.6643C3.71421 21.1072 3 20.8567 3 20.2895Z" stroke="green" stroke-width="1.5"/> </svg>

                    </div>
                    <div className={`w-full  h-[100px]  flex flex-col  `}>
                      <div className="w-full text-gray-700 text-sm font-bold font-open-sans break-words">
                        {notifcation.title}
                      </div>
                      <div
                        className={`w-full text-gray-500 text-xs font-normal font-open-sans break-words mt-2  `}
                      >
                        {notifcation.createdAt.substring(0, 10)}
                      </div>
                      {notifcation.isSelected && (
                        <div
                          className={`w-full text-gray-500 text-xs font-normal font-open-sans break-words mt-2  overflow-y-hidden shadow-xl`}
                        >
                          {notifcation.body}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
<div className=" flex justify-center items-center">
  <button  onClick={handlePreviousNotification} className="text-blue-500 mr-2 cursor-pointer ">Prev</button>
  <span>{currentNotification} of {(totalNotifications?Math.round(totalNotifications/notificationsPerPage):0)}</span>
  <button onClick={handleNextNotification} className="text-blue-500 cursor-pointer px-1">Next</button>
</div>
              </div>
              
            </div>
          )}
          {/* end of notification */}
        </div>
      </div>

      {/* for mobile users */}
      <div className="md:hidden bg-white">
        <div className="w-full flex flex-col h-[40px] px-[2px]  border-b-1 border-blue-400">
          <div className="flex w-[90%]  h-[40px] mx-[30px] ">
            <Image
              onClick={handleBurgerMenu}
              src={hamburgurmenu}
              alt="a huamburger menu"
              width={24}
              height={24}
              className="cursor-pointer"
            />

            <div className={` flex ml-[31px] px-1 items-center  w-full `}>
              <input
                type="text"
                value={query}
                onChange={handleSearchInputChange}
                placeholder={"Search"}
                className={` text-gray-600 ${
                  router.pathname === "/customers" ||
                  router.pathname === "/branch" ||
                  router.pathname === "/product" ||
                  router.pathname === "/sales" ||
                  router.pathname === "/user" 
                    ? "block"
                    : "hidden"
                } ${
                  sidebarStatus ? "w-[90%]" : "w-[70%]"
                }  h-[36px] px-2   border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 `}
              />
              {/* FILTER AND SORT */}
              <div
                className={` ${
                  sidebarStatus ? "w-[280px]" : "w-[30%]"
                } h-[40px] flex items-center`}
              >
                {/* filter */}
                {/* // testing for filters */}
                <div
                  className={`  ${
                    notification
                      ? "w-full relative  py-1 h-full "
                      : "w-[70px] relative ml-1 py-1 h-[36px]"
                  } `}
                >
                  <div
                    onClick={handleMobileFilter}
                    className={` flex gap-0 h-[30px]`}
                  >
                    <h2
                      className={`${
                        router.pathname === "/customers" ||
                        router.pathname === "/product" ||
                        router.pathname === "/sales" ||
                        router.pathname === "/user" 
                          ? "block"
                          : "hidden"
                      } font-bold`}
                    >
                      Filter
                    </h2>
                    <div
                      className={`${
                        router.pathname === "/customers" ||
                        router.pathname === "/product" ||
                        router.pathname === "/sales" ||
                        router.pathname === "/user" 
                          ? "block"
                          : "hidden"
                      } `}
                    >
                      <Image
                        src={downarrow}
                        alt="down arrow icon"
                        height={9}
                        width={9}
                        className="my-2 mx-3"
                      />
                    </div>
                    {/* user infomation */}
                    {userInfo && (
                      <div onClick={(e)=>{e.stopPropagation()}} className="fixed z-10 top-24 w-1/2 h-[260px] bg-white border  right-1 shadow-xl text-black pb-4 rounded-xl">
                        <div className=" shadow-md w-full h-full md:w-auto">
                          <div className=" flex flex-col gap-4">
                            <div className=" flex flex-col ">
                              <div className="w-full  flex gap-6">
                                <div className="relative px-auto">
                                  
                                <div  style={{ background: randomColor }} className="rounded-full w-16 h-16 flex items-center justify-center cursor">
  <h1 className="text-white ">{userNameInitials()}</h1>
</div>
                                </div>
                                <div>
                                  {" "}
                                  <h3 className="text-center text-black font-semibold text-md">
                                    {userName}
                                  </h3>
                                  {/* <div className="w-full border border-gray-400"></div> */}
                                  <div className="w-full ">
                                    <h5 className="text-center text-black text-md">
                                      {userRoles}
                                    </h5>
                                  </div>
                                  <div className="w-full ">
                                    <h5 className="text-center text-black text-md">
                                      {userEmail}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white border"></div>
                            </div>
                            <div>
                              <ul className="flex flex-col items-left space-y-4">
                                <li className="hover:bg-gray-100 ">
                                  <Icon
                                    w="5"
                                    h="4"
                                    color="gray-500"
                                    radius="2"
                                    path="user"
                                  />
                                  <a
                                    href="#"
                                    className="text-black hover:text-gray-500 hover:text-xl"
                                  >
                                    Your Profile
                                  </a>
                                </li>
                                <li className="hover:bg-gray-100 ">
                                  <Icon
                                    w="5"
                                    h="4"
                                    color="gray-500"
                                    radius="2"
                                    path="setting"
                                  />
                                  <a
                                    href="#"
                                    className="text-black hover:text-gray-500 hover:text-xl"
                                  >
                                    Settings &amp; Privacy
                                  </a>
                                </li>
                                <li
                                  className="hover:bg-gray-100 "
                                  onClick={signOutHandler}
                                >
                                  <Icon
                                    w="5"
                                    h="4"
                                    color="gray-500"
                                    radius="2"
                                    path="signout"
                                  />
                                  <a
                                    href="#"
                                    className="text-black hover:text-gray-500 hover:text-xl"
                                  >
                                    Sign Out
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* end of user information */}
                    {openMobileFilter && (
                      <Modal
                        isOpen={true}
                        onRequestClose={closeModal}
                        overlayClassName="md:hidden bg-black bg-opacity-50 fixed top-0 bottom-0 left-0 right-0 h-full  w-full z-50 "
                        className="  bg-white w-full h-full ml-[200px] mr-[13px] mt-[0px] mb-[40px] rounded-8 outline-none overflow-y-scroll hideScrollbar"
                      >
                      {router.pathname === '/product' && <ProductFilter 
                                              setOpenFilter={setOpenFilter}
                                              setOpenMobileFilter={() => {}}/>}
                      {router.pathname === '/customers' &&  <CustomFilter
                        setOpenFilter={setOpenFilter}
                        setOpenMobileFilter={() => {}}
                      />}
                      </Modal>
                    )}
                  </div>
                </div>

                {/* testing for filters ends here */}

                {/* sort */}
                {/* testing div for filter */}

                {/* end of sort */}
              </div>

              {/* FILTER AND SORT ENDS HERE */}
            </div>
          </div>

          {/* notifcation */}
          <div>
            {/* notification */}
            {notification && (
              <div className="fixed  z-50 top-0 bottom-0 left-0 right-0 px-2 w-full h-screen bg-white   border border-slate-200  shadow-xl rounded-md">

<div className="fixed bottom-0 bg-white h-[30px] left-0 right-0 mx-2 px-2 flex justify-center items-center  border border-slate-200  shadow-xl rounded-md">
  <button  onClick={handlePreviousNotification} className="text-blue-500 mr-2 cursor-pointer ">Prev</button>
  <span>{currentNotification} of {(totalNotifications?Math.round(totalNotifications/notificationsPerPage):0)}</span>
  <button onClick={handleNextNotification} className="text-blue-500 cursor-pointer px-1">Next</button>
</div>


                
                <div className="h-[10%] w-full border border-white rounded-sm">
                  <div className="w-full   flex flex-col px-4 py-2">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <div className="text-gray-700 text-xl font-normal font-open-sans break-words">
                          Notifications
                        </div>
                        <div className="flex gap-1">
                          {/* <div onClick={()=>displaySelected(0)} className="text-gray-400 text-sm font-normal font-open-sans break-words cursor-pointer">
                              Read
                            </div> */}
                          <div
                            onClick={() => displaySelected(2)}
                            className="text-gray-400 text-sm font-normal font-open-sans break-words cursor-pointer"
                          >
                            Unread
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={markAllAsRead}
                        className="text-gray-600 text-base font-normal font-open-sans break-words cursor-pointer"
                      >
                        Mark all as read
                      </div>
                    </div>
                    <div></div>
                  </div>


 
                </div>
            

                <div className="notifcationList  h-screen overflow-x-hidden overflow-y-auto hideScrollbar bg-white">
                  <div className="fixed w-full border border-white bg-white rounded-sm">
                    <div className="w-full   flex flex-col px-4 py-2">
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <div className="text-gray-700 text-xl font-normal font-open-sans break-words">
                            Notifications
                          </div>
                          <div className="flex gap-1">
                            {/* <div onClick={()=>displaySelected(0)} className="text-gray-400 text-sm font-normal font-open-sans break-words cursor-pointer">
                              Read
                            </div> */}
                            <div
                              onClick={() => displaySelected(2)}
                              className="text-gray-400 text-sm font-normal font-open-sans break-words cursor-pointer"
                            >
                              Unread
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={markAllAsRead}
                          className="text-gray-600 text-base font-normal font-open-sans break-words cursor-pointer"
                        >
                          Mark all as read
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <div className="mt-16"></div>
                  {newUpdatedNotification.map((notifcation, index) => (
                    <div
                      onClick={() => notificationHandler(notifcation.id)}
                      key={index}
                      className={` h-1/6 mt-1 w-full border border-white rounded-sm flex cursor-pointer  ${
                        !notifcation.isSelected && !notifcation.isRead
                          ? "bg-[#c5c1c166]"
                          : ""
                      } ${notifcation.isSelected ? " h-[120px] " : ""}`}
                    >
                      <div
                        className={` w-1/6 h-full flex  ${
                          notifcation.isSelected
                            ? " h-[140px] items-start justify-center"
                            : "items-center justify-center"
                        }    `}
                      >
                        

                        <svg width="24" height="24" stroke-width="2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7V9" stroke="red" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 13.01L12.01 12.9989" stroke="red" stroke-linecap="round" stroke-linejoin="round"/> <path d="M3 20.2895V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H7.96125C7.35368 17 6.77906 17.2762 6.39951 17.7506L4.06852 20.6643C3.71421 21.1072 3 20.8567 3 20.2895Z" stroke="green" stroke-width="1.5"/> </svg>

                      </div>
                      <div className="w-full h-[200px] flex flex-col items-baseline mt-6">
                        <div className="w-full text-gray-700 text-sm font-bold font-open-sans break-words">
                          {notifcation.title}
                        </div>
                        <div className="w-full text-gray-500 text-xs font-normal font-open-sans break-words mt-4">
                          {notifcation.createdAt.substring(0, 10)}
                        </div>
                        {notifcation.isSelected && (
                          <div className="w-full text-gray-500 text-xs font-normal font-open-sans break-words mt-2 overflow-y-hidden shadow-xl">
                            {notifcation.body}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
               
                </div>
                </div>
              )
            
            }


            {/* end of notification */}
          </div>
          {/* notifcation */}
        </div>
      </div>
      {/* global search fillter sort div ends here */}
      {children}
    </div>
  );
};

export default Maincanvas;
