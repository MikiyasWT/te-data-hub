import { Tab } from "../../components/Tab";
import React from "react";
import Customer from "./customer";
import UserTable from "./userTable";
import { useRouter } from "next/router";

const Customers = ({ query }: any) => {
  const router = useRouter();
  const tabs = ["credit-customer","cash-customer" ];
  return (
    <div className=" w-screen h-full">
      <Tab initialTab={query}>
        <div id={tabs[0]}>
          <Customer />
        </div>

        {/* tab content */}
        <div id={tabs[1]}>
          <UserTable />
        </div>
      </Tab>
    </div>
  );
};

export default Customers;

Customers.getInitialProps = ({ query }: any) => {
  return { query };
};