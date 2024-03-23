import { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "./private/private.navbar";
import Sidebar from "./private/private.sidebar";
import MainCanvas from "./private/private.maincanvas";
import { getAuthToken } from "../../utils/storage";
import { useRouter } from "next/router";
import {menuCombiner} from "../../utils/role"
import { getAllNotifcations } from "../../services/notifcation";
import {  setNotificationMessage, setUnreadMessages } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import { CombinedAppState } from "../../redux/types";
import { RootState } from "../../redux/reducer";
import { generateRandomColor } from "../../utils/randomColor";


interface PROPS {
  children: any;
 
}




export default function Layout({ children}: PROPS) {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isHamburgerMenuClicked, setIsHamburgerMenuClicked] = useState(false);
  const dispatch = useDispatch()

  const RandomColor = generateRandomColor();

  return (
    <div className={`${isHamburgerMenuClicked ? " " : ""}  `}>
      <Navbar
        setIsHamburgerMenuClicked={setIsHamburgerMenuClicked}
        currentPage={currentPage}
        sidebarStatus={sidebarStatus}
        setSidebarStatus={setSidebarStatus}
        RandomColor={RandomColor}
      />
      <Sidebar
        isHamburgerMenuClicked={isHamburgerMenuClicked}
        setIsHamburgerMenuClicked={setIsHamburgerMenuClicked}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarStatus={sidebarStatus}
        setSidebarStatus={setSidebarStatus}
        
      />
      <MainCanvas
        isHamburgerMenuClicked={isHamburgerMenuClicked}
        setIsHamburgerMenuClicked={setIsHamburgerMenuClicked}
        sidebarStatus={sidebarStatus}
        setSidebarStatus={setSidebarStatus}
        currentPage={currentPage}
        RandomColor={RandomColor}
      >
        {children}
      </MainCanvas>
    </div>
  );
}


function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
//sm:w-[640px] md:w-[768px] lg-[1024px] xl-[1440px]





