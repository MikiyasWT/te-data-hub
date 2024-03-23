import { getTokenFromCookie } from "./cookie";
import { decodeJwtToken } from "./decodetoken";
import downarrow from "../public/icons/downarrow.png";
import uparrow from "../public/icons/uparrow.png";
import techethiologo from "../public/TechethioLogo.svg";
import techethio from "../public/TechEthio.svg";
import vector from "../public/icons/Vector.png";
import customericon from "../public/icons/customericon.svg";
import branchicon from "../public/icons/branchicon.png";
import users from "../public/icons/users.png";
import producticon from "../public/icons/product.png";
import salesicon from "../public/icons/sales.png";
import settings from "../public/icons/settings.png";
import graphview from "../public/icons/graphview.png";
import tableview from "../public/icons/tableview.png";
import chartview from "../public/icons/chartview.png";
import funnelchartview from "../public/icons/funnelchartview.png";
import doublebackarrow from "../public/icons/doublebackarrow.svg"
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface MenuItem {
  icon?: any;
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
  icon?: any;
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

const admin: MenuItem[] = [
  {
    text: "Dashboard",
    url: "dashboard",
  },
  {
    icon: "user",
    text: "Customers",
    url: "customers",
    default: "credit-customer",
    sub: [
      {
        text: "Credit Customer",
        location: "credit-customer",
        icon: customericon,
      },
      {
        text: "Cash Customer",
        location: "cash-customer",
        icon: customericon,
      },
    ],
  },
  {
    icon: "branch",
    text: "Branch",
    url: "branch",
  },
  {
    icon: "product",
    text: "Product",
    url: "product",
    default: "medication"
  },
  {
    icon: "sales",
    text: "Sales",
    url: "sales",
    default: "chart",
    sub: [
      { text: "Table View", location: "Table-View", icon: tableview },
      { text: "Chart View", location: "Chart-View", icon: chartview },
      { text: "Graph View", location: "Graph-View", icon: graphview }
    ],
  },
  {
    icon: "users",
    text: "Users",
    url: "user",
    default: "user-information",
    sub: [
      {
        text: "User Information",
        location: "User-Information",
        icon: customericon,
      },
      { text: "Activity Log", location: "Activity-Log", icon: customericon },
    ],
  },
  {
    icon: "setting",
    text: "Settings",
    url: "settings",
    default: "Role-management",
    sub: [
      {
        text: "Role Management",
        location: "Role-management",
        icon: customericon,
      },
      {
        text: "API generation",
        location: "Api-generation",
        icon: customericon,
      },
    ],
  },
];

const sales: MenuItem[] = [
  {
    icon: "sales",
    text: "Sales",
    url: "sales",
    default: "chart",
    sub: [
      { text: "Table View", location: "Table-View", icon: tableview },
      { text: "Chart View", location: "Chart-View", icon: chartview },
      { text: "Graph View", location: "Graph-View", icon: graphview },
      {
        text: "Funnel Chart View",
        location: "Table-View",
      },
    ],
  },
];

const product: MenuItem[] = [
  {
    icon:"product",
    text: "Product",
    url: "product",
    default: "medication",
    
  },
];

const customer: MenuItem[] = [
  {
    icon: "user",
    text: "Customers",
    url: "customers",
    default: "credit-customer",
    sub: [
      {
        text: "Credit Customer",
        location: "credit-customer",
        icon: customericon,
      },
      { text: "Cash Customer", location: "cash-customer", icon: customericon },
    ],
  },
];

const organ: MenuItem[] = [];

const branch: MenuItem[] = [
  {  icon:"user", text: "Branch", url: "branch" },
];

const user: MenuItem[] = [
  {
    icon: "users",
    text: "Users",
    url: "user",
    default: "user-information",
    sub: [
      {
        text: "User Information",
        location: "User-Information",
        icon: customericon,
      },
      { text: "Activity Log", location: "Activity-Log", icon: customericon },
    ],
  },
];

const guest: MenuItem[] = [];

// Mapping between roles and arrays
const roleMapping: Record<string, MenuItem[]> = {
  admin,
  sales,
  product,
  customer,
  organ,
  branch,
  user,
  guest,
  // Add more mappings for other roles if needed
};

// Function that returns the roles
async function getRoles(): Promise<string[]> {
  const authToken = await getTokenFromCookie();
  const decodedPayload = decodeJwtToken(authToken);
  const roles = decodedPayload?.roles ?? []; // Use empty array as default value if roles is undefined
  return roles;
}

// Get the roles
const rolesPromise = getRoles();

export const menuCombiner = async (): Promise<MenuItem[]> => {
  const roles = await rolesPromise;

  // Check if "admin" role exists in the roles array
  if (roles.includes("admin")) {
    // If "admin" role exists, combinedArray will only contain the admin array
    const combinedArray = roleMapping.admin;
    console.log(combinedArray);
    return combinedArray;
  } else {
    // Combine arrays based on roles
    const combinedArray = roles?.reduce((result: MenuItem[], role: string) => {
      // Check if the role exists in the mapping
      if (roleMapping.hasOwnProperty(role)) {
        // Concatenate the current array with the role's array
        result = result.concat(roleMapping[role]);
      }
      return result;
    }, []);

    console.log(combinedArray);
    return combinedArray;
  }
};