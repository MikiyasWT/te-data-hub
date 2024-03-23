import {Tab} from "../../components/Tab"
import React from "react";
import Activitylog from "./userlog";
import UserTable from "./usertable";
import { useRouter } from "next/router";

const Customers = ({query}:any) => {
    const router = useRouter();
    const tabs = ["User-Information","Activity-Log"]
    return(
        <div className=" w-full h-full">
          <Tab initialTab={query}>
            <div id={tabs[0]}>
            <UserTable />
             </div>

            {/* tab content */}
            <div id={tabs[1]}>
               
               <Activitylog />
            </div>


        </Tab>
        </div>    
    );
}

export default Customers

Customers.getInitialProps = ({query}:any) => {
    return {query};
}