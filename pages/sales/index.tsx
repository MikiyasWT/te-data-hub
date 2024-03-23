import {Tab} from "../../components/Tab"
import React from "react";
import Customer from "./salestable";
import Chart from "../dashboard/bar";
import Line from "../dashboard/line";
import { useRouter } from "next/router";

const Customers = ({query}:any) => {
    const router = useRouter();
    const tabs = ["Table-View","Chart-View","Graph-View"]
    return(
        <div className=" w-full h-full">
          <Tab initialTab={query}>
            <div id={tabs[0]}>
                <Customer />
             </div>

            {/* tab content */}
            <div id={tabs[1]}>
            <div className="w-[900px]">
               <Line />
               </div>
               
            </div>
            <div id={tabs[2]}>
            <div className="w-full md:w-[900px]">
               <Chart />
               </div>
            </div>

        </Tab>
        </div>    
    );
}

export default Customers

Customers.getInitialProps = ({query}:any) => {
    return {query};
}