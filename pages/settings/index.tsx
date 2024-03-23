import { Tab } from "../../components/Tab";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Api_Generation from "./api_generation";
import api from "../../services/api";
import Role_management from "./role_managemnet";

const Settings = ({ query }: any) => {
  const router = useRouter();
  const tabs = ["Role-management", "Api-generation"];

  async function fetchUsers() {
    try {
      const response = await api.get("/users");
      console.log("Users:", response.data);
      // Handle the fetched users
    } catch (error) {
      console.error("Request error:", error);
      // Handle the request error, such as displaying an error message
    }
  }

  useEffect(() => {
    const data = fetchUsers();
    console.log(data);
  }, []);
  return (
    <div className=" w-full h-full">
      <Tab initialTab={query}>
      <div key={1} id={tabs[0]}>
          <Role_management />
        </div>


        {/* tab content */}

        <div key={2} id={tabs[1]}>
          <Api_Generation />
        </div>
      </Tab>
    </div>
  );
};

export default Settings;

Settings.getInitialProps = ({ query }: any) => {
  return { query };
};
