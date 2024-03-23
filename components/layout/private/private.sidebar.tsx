import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import downarrow from "../../../public/icons/downarrow.png";
import uparrow from "../../../public/icons/uparrow.png";
import { useRouter } from "next/router";
import techethiologo from "../../../public/TechethioLogo.svg";
import techethio from "../../../public/TechEthio.svg";
import vector from "../../../public/icons/Vector.png";
import customericon from "../../../public/icons/customericon.svg";
import branch from "../../../public/icons/branch.png";
import users from "../../../public/icons/users.png";
import product from "../../../public/icons/product.png";
import sales from "../../../public/icons/sales.png";
import settings from "../../../public/icons/settings.png";
import graphview from "../../../public/icons/graphview.png";
import tableview from "../../../public/icons/tableview.png";
import chartview from "../../../public/icons/chartview.png";
import doublebackarrow from "../../../public/icons/doublebackarrow.svg";
import funnelchartview from "../../../public/icons/funnelchartview.png";
import "./hideScrollbar.module.css";
import { SidebarMenu } from "./private.sidebarmenu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/reducer";
import { menuCombiner } from "../../../utils/role";
import { displayNotification, displayUserInfo } from "../../../redux/action";

interface PROPS {
  sidebarStatus: boolean;
  setSidebarStatus: any;
  isHamburgerMenuClicked: boolean;
  setIsHamburgerMenuClicked: Dispatch<SetStateAction<boolean>>;
  currentPage: String;
  setCurrentPage: Dispatch<SetStateAction<string>>;
}


const SideBar = ({
  sidebarStatus,
  setSidebarStatus,
  currentPage,
  setCurrentPage,
  isHamburgerMenuClicked,
  setIsHamburgerMenuClicked,
}: PROPS) => {
  //sidebarStatus

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const notification = useSelector((state: RootState) => state.notification);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const handleMenuClick = (index: number) => {
    setActiveItem(index);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSideBar = () => {
    return setSidebarStatus((prev: any) => !prev);
  };

  const handleHumBurgerMenu = () => {
    return setIsHamburgerMenuClicked((prev) => !prev);
  };



  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    try {
      // Fetch your data here
      const items: MenuItem[] = await menuCombiner();
      setMenuItems(items);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useLayoutEffect(() => {
    fetchData();
  }, [menuItems]);

  if (isLoading) {
    return <div className="w-screen h-full bg-red-400">Loading...</div>; // Render a loading indicator or a placeholder
  }

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
    <div onClick={handleOpenedModals} className="">
      {/* for mobile devices */}
      <div
        className={` md:hidden   ${
          isHamburgerMenuClicked ? "" : "hidden sm:block"
        }`}
      >
        <div
          onClick={handleHumBurgerMenu}
          className={`  ${
            isHamburgerMenuClicked
              ? "fixed  overflow-x-hidden  h-auto  w-full top-0 bottom-0 left-0 right-0  z-50 bg-[#33333366] "
              : ""
          } `}
        >
          {/* sidebar icon and techethop logo */}

          {/* if double angle bracket got clicked */}
          {/* sidebar icon and techethio logo  ends here */}

          {/* side bar menues */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="  w-[54%] h-full top-0 bottom-0 left-0 flex justify-start py-0 my-0"
          >
            <div
              className={`bg-white flex flex-col flex-grow  left-0  pb-2 h-auto py-0 my-0 `}
            >
              <div
                onClick={(event: any) => event.stopPropagation()}
                className="bg-white flex flex-col  pt-1  mx-auto  px-0 py-0 "
              >
                {/* dashboard */}

                {/* TechEthio Logo and Name */}
                <div className="w-full flex-shrink-0 ">
                  <div className=" flex items-baseline ">
                    <Image
                      src={techethiologo}
                      alt="Image Description"
                      width={100}
                      height={80}
                      className="pl-[4px] py-6 self-end"
                    />
                    <div className=" w-2/3 flex flex-col h-[64px] py-6 align-bottom ">
                      <div className="w-full text-center h-[20px] text-blue-500 text-lg font-bold font-open-sans break-words">
                        <h1 className="pl-[6px] text-primary-100 text-3xl font-bold font-serif">
                          TechEthio
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>

                <>
                  {menuItems.map((menuItem: any, index: number) => (
                    <SidebarMenu
                      key={index}
                      icon={menuItem.icon}
                      text={menuItem.text}
                      url={menuItem.url}
                      sub={menuItem.sub}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      sidebarStatus={sidebarStatus}
                      setSidebarStatus={setSidebarStatus}
                      isActive={activeItem === index}
                      onClickHandler={() => handleMenuClick(index)}
                    />
                  ))}
                </>

                {/* companies combo box        */}

                {/* companies combo box ends here */}
              </div>
            </div>
          </div>

          {/* end of sidebar menues     */}
        </div>
      </div>
      {/* end of for mobile devices */}

      {/* for devices other than mobile */}
      <div className="hidden sm:block ">
        <div
          className={`  md:bg-white   md:z-20 md:fixed md:flex md:flex-col md:flex-grow  md:top-0  ${
            sidebarStatus ? "md:w-[40px] " : "md:w-[260px] w-[460px]"
          } border-r-[1px] border-gray-300 h-screen bg-white  overflow-hidden overflow-y-auto scrollbar-hidden pb-8 hideScrollbar `}
        >
          {sidebarStatus && (
            <div
              onClick={handleSideBar}
              className={` ${
                sidebarStatus ? "px-2" : ""
              } relative top-[30px] w-[40px] h-[50px] `}
            >
              <Image
                src={doublebackarrow}
                alt="Image Description"
                width={19.1}
                height={7.61}
                className="rotate-180"
              />
            </div>
          )}
          {/* sidebar icon and techethop logo */}
          {!sidebarStatus && (
            <div className="w-260 h-1024 flex-shrink-0  bg-white">
              <div className="flex items-baseline w-full">
                <Image
                  src={techethiologo}
                  alt="Image Description"
                  width={76}
                  height={64}
                  className="pl-[30px] py-[10px] self-end"
                />
                <div className="flex flex-col h-[64px] py-6 align-bottom ">
                  <div className="flex ">
                    <div className="w-[144] h-[20px] text-blue-500 text-lg font-bold font-open-sans break-words">
                      <h2 className="pl-[6px] text-primary-100 font-open-sans text-20 font-semibold">
                        TechEthio
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="flex items-center w-[20px] h-[20px] ml-16">
                  <div>
                    <Image
                      src={doublebackarrow}
                      alt="Image Description"
                      width={19.1}
                      height={7.61}
                      onClick={handleSideBar}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* if double angle bracket got clicked */}
          {/* sidebar icon and techethio logo  ends here */}

          {/* side bar menues */}
          <div
            className={` flex flex-col flex-grow  mb-2 ${
              sidebarStatus ? "w-[40px] " : "w-[244px]"
            } h-[436px] top-[63px] left-[4px] gap-2 `}
          >
            <div
              onClick={(event: any) => event.stopPropagation()}
              className=" flex flex-col pt-2 pl-[2px]"
            >
              {/* dashboard */}

              <>
                {menuItems.map((menuItem: any, index: number) => (
                  <SidebarMenu
                    key={index}
                    icon={menuItem.icon}
                    text={menuItem.text}
                    url={menuItem.url}
                    sub={menuItem.sub}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    sidebarStatus={sidebarStatus}
                    setSidebarStatus={setSidebarStatus}
                    isActive={activeItem === index}
                    onClickHandler={() => handleMenuClick(index)}
                  />
                ))}
              </>

              {/* companies combo box        */}

              {/* companies combo box ends here */}
            </div>
          </div>

          {/* end of sidebar menues     */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
interface MenuItem {
  icon?: StaticImport;
  text: string;
  url: string;
  default?: string;
  sub?: SubMenuItem[];
}

interface SubMenuItem {
  text: string;
  location?: string;
  icon?: StaticImport;
}

interface MenuItem {
  icon?: StaticImport;
  text: string;
  url: string;
  default?: string;
  sub?: SubMenuItem[];
}

interface SubMenuItem {
  text: string;
  location?: string;
  icon?: StaticImport;
}
