import { useState, useEffect, Key, useContext } from "react";
import { useRouter } from "next/router";
import { slugify } from "../../utils/slugify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { setActiveTab } from "../../redux/action/";

const Tab = ({ children, initialTab }: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.activeTab);

  const handleTabClick = (e: any, tab: string) => {
    e.preventDefault();
    //console.log(activeTab)
    dispatch(setActiveTab(tab));
  };

  useEffect(() => {
    if (initialTab && initialTab.tab) {
      dispatch(setActiveTab(initialTab.tab));
    } else if (children && children.length > 0) {
      const defaultTab = children[0].props.id;
      dispatch(setActiveTab(defaultTab));
    }
  }, []);

  return (
    <div
      className="flex flex-col h-[5.3%] md:h-[5.3%]  w-full xl:w-full ml-1 items-baseline align-bottom"
      key={activeTab}
    >
      <div className="h-full w-full">
        <ul className="flex flex-row h-full w-full bg-white border-b border-blue-500 my-2 pl-4">
          {children.map((tab: any, index: Key) => (
            <li
              key={index}
              className={`${
                activeTab === tab.props.id
                  ? "relative bg-white text-blue-400 px-4 pt-[4px] pb-[34px] mb-[2px] border-b-0 border border-t-2 border-blue-500 rounded-t-md"
                  : "py-[12px] px-4 pt-[6px] pb-[26px]   border-blue-500 rounded-t-md"
              }`}
            >
              <a href="#" onClick={(e) => handleTabClick(e, tab.props.id)}>
                {tab.props.id}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        {/* tab content */}
        {children.map((tab: any, index: Key) => {
          if (tab.props.id == activeTab) {
            return <div key={index}>{tab.props.children}</div>;
          }
        })}
      </div>
    </div>
  );
};

export { Tab };
