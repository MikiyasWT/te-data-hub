import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import downarrow from "../../../public/icons/downarrow.png";
import uparrow from "../../../public/icons/uparrow.png";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducer";
import { setActiveTab } from "../../../redux/action";
import Icon from "../../Icons/Icon";
//import Icon from "../../icon";

interface Sub {
  name: string;
  location: string;
  icon?: StaticImport;
}

interface PROPS {
  sidebarStatus: boolean;
  setSidebarStatus: any;
  icon?: any;
  text: string;
  url: string;
  sub?: Array<{ text: string; location?: string; icon: StaticImport }>;
  currentPage: String;
  setCurrentPage: Dispatch<SetStateAction<string>>;
  onClickHandler: () => void;
  isActive: boolean;
}

export const SidebarMenu = ({
  icon,
  text,
  url,
  sub,
  sidebarStatus,
  setSidebarStatus,
  currentPage,
  setCurrentPage,
  onClickHandler,
  isActive,
}: PROPS) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.activeTab);
  //state to track if main menu is clicked
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleClick = async (event: any) => {
    if (sidebarStatus) {
      return;
    } else {
      await event.stopPropagation();
      setOpen(!open);
    }
  };

  const len = () => {
    let numberOfSubMenus = sub?.length;
    let x =
      "h-[" + (numberOfSubMenus ? (numberOfSubMenus + 0) * 56 : 56) + "px]";
    return '"' + x + '"';
  };

  const handleCollapse = (sidebarStatus: boolean) => {
    if (sidebarStatus) {
      setOpen(!open);
      return setSidebarStatus(!sidebarStatus);
    }
  };

  const handleMenuClick = async () => {
    const current = router.pathname;
  
    await setCurrentPage(text);
    await onClickHandler();
    //await router.push(url);
    
    let newUrl = "/"+url;
    window.location.replace(newUrl);
 
  };

  const handleSubMenuClick = async (e: any, location: any) => {
    e.stopPropagation();

    const currentUrl = router.asPath;
    await setCurrentPage(text);
    await onClickHandler();
    await dispatch(setActiveTab(location));
  };

  return (
    <div
      onClick={handleClick}
      className={` relative ${
        sidebarStatus ? " md:w-[60px]" : "w-[290px] md:w-[244px]"
      } ${
        open && isActive ? len() : "h-[42px]"
      }  my-[0px] px-0 flex flex-col gap-2 cursor-pointer `}
    >
      <div
        onClick={handleMenuClick}
        className={` ${
          open && isActive
            ? "bg-[#4C8BF5] text-white rounded-[10px] my-[2px]"
            : " text-[#4C8BF5] bg-white"
        } relative flex  ${
          sidebarStatus
            ? "bg-white  px-2 w-[40px]"
            : "w-[210px] pl-[5px] align-middle gap-2 ml-10  mx-[2px]"
        }  h-[42px]   py-[10px] `}
      >
        <div
          onClick={() => handleCollapse(sidebarStatus)}
          className={` flex flex-col h-[56px]  py-[4px] ${
            icon ? "" : "w-[16px] h-[32px]"
          } `}
        >
          
            {/* <Image
              src={icon}
              alt="Image Description"
              width={100}
              height={10}
              className={` w-[16px] h-[16px] ${
                isActive && sidebarStatus ? "bg-white text-white" : ""
              }`}
            />
          )} */}
          {icon && (
           <Icon w="5" h="5" color={isActive && sidebarStatus ?'white': "blue:500"} radius="2" path={icon }/>   
           )}    </div>
              
        {!sidebarStatus && (
          <>
            <div className={`text-baseline ${isActive ? "" : ""}`}>
              <h1 className={` w-[77px] h-[21px] pl-[7px]  text-center  `}>
                {text}
              </h1>
            </div>
            <div className={`pl-[48px]  py-[5px] ${icon ? "" : "w-[9.18px]"} `}>
              {icon && (
                <Image
                  src={open ? uparrow : downarrow}
                  alt="Image Description"
                  width={9.182}
                  height={14.122}
                />
              )}
            </div>
          </>
        )}
      </div>

      {open &&
        currentPage === text &&
        !sidebarStatus &&
        sub?.map((menu, index) => (
          <div
            onClick={(e) => handleSubMenuClick(e, menu.location)}
            key={index}
            className="my-0 flex align-middle gap-0 w-full h-[46px] ml-[20px] py-0 cursor-pointer"
          >
            {/* ... (sub menu content) ... */}
            <div className="flex align-baseline gap-4 w-full h-[56px] ml-10 py-4">
              <div className=" flex flex-col h-[56px] align-middle py-[0px]">
                <Image
                  src={menu.icon}
                  alt="Image Description"
                  width={10}
                  height={10}
                  className="w-[16px] h-[16px] "
                />
              </div>
              <div className="my-0 text-baseline">
                <h1 className={` w-full h-[21px] pl-[7px]  text-center  ${(router.pathname == location.toString()?'text-red-400':'text-[#4C8BF5]')} `}>
                  {menu.text}
                </h1>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};