import api from "./api";

interface FilterParameters {
  frombirthdate?: string;
  tobirthdate?: string;
  fromAge?: number;
  toAge?: number;
  subcity?: string;
  woreda?: number;
  ketena?: number;
  regionstate?: string;
  gender?: string;
}

//used to retrieve location details to be populated into customers filter dropdown select options
export async function customersFilterDropdownData(regionstate?:string,subcity?:string,woreda?:string,ketena?:string){

  try {
    let url = "/filter/customerT?";
   
    if (regionstate) {
      url += `regionstate=${regionstate}&`;
    }
    if (subcity) {
      url += `subcity=${subcity}&`;
    }
    if (woreda) {
      url += `woreda=${woreda}&`;
    }
    if (ketena) {
      url += `ketena=${ketena}&`;
    }

    return await api.get(url)
  } catch (error) {
    console.error(`Unable to filter ${regionstate} information for ${subcity} information data:`, error);
    throw error;
  }
}

export async function filterCustomersApi(filters: FilterParameters,page:number,itemsPerPage:number) {
  try {
    let url = "/filter/customer?";

    // Build the URL dynamically based on the provided parameters
    if (filters.frombirthdate) {
      url += `frombirthdate=${filters.frombirthdate}&`;
    }
    if (filters.tobirthdate) {
      url += `tobirthdate=${filters.tobirthdate}&`;
    }
    if (filters.fromAge) {
      url += `fromAge=${filters.fromAge}&`;
    }
    if (filters.toAge) {
      url += `toAge=${filters.toAge}&`;
    }
    if (filters.subcity) {
      url += `subcity=${filters.subcity}&`;
    }
    if (filters.woreda) {
      url += `woreda=${filters.woreda}&`;
    }
    if (filters.ketena) {
      url += `ketena=${filters.ketena}&`;
    }
    if (filters.regionstate) {
      url += `regionstate=${filters.regionstate}&`;
    }
    if (filters.gender) {
      url += `gender=${filters.gender}&`;
    }

    const response = await api.get(url, {
      params: {
        page: page,
        limit:itemsPerPage
      },
    });

    const totalItems = response.data.pagination.total;
    const customers = response.data.customers;
    const success = response.data.success;

    return {totalItems,success,customers}
  } catch (error) {
    console.error("Unable filter customers information:", error);
    throw error;
  }
}

//branch filters
type BranchPayload = {
  branch_name?: string;
  branch_number?: number;
  subcity?: string;
  woreda?: number;
  house_number?: string;
  email?: string | null;
  phone_number?: string;
};

export async function filterBranch(payload: BranchPayload) {
  try {
    let url = "/filter/branch?";

    if (payload.branch_name) {
      url += `branch_name=${encodeURIComponent(payload.branch_name)}&`;
    }
    if (payload.branch_number) {
      url += `branch_number=${encodeURIComponent(
        payload.branch_number.toString()
      )}&`;
    }
    if (payload.subcity) {
      url += `subcity=${encodeURIComponent(payload.subcity)}&`;
    }
    if (payload.woreda) {
      url += `woreda=${encodeURIComponent(payload.woreda.toString())}&`;
    }
    if (payload.house_number) {
      url += `house_number=${encodeURIComponent(payload.house_number)}&`;
    }
    if (payload.email) {
      url += `email=${encodeURIComponent(payload.email)}&`;
    }
    if (payload.phone_number) {
      url += `phone_number=${encodeURIComponent(payload.phone_number)}&`;
    }

    // Remove trailing '&' if any
    if (url.endsWith("&")) {
      url = url.slice(0, -1);
    }

    return await api.get(url);
  } catch (error) {
    console.error("Unable to filter branch data:", error);
    throw error;
  }
}

export async function getAllBranchData(page: number, itemsPerPage: number) {
  try {
    const response = await api.get(`/branch/all`, {
      params: {
        page: page,
        limit: itemsPerPage,
      },
    });

    const totalItems = response.data.pagination.total;

    // Extract the sales data from the response
    const branchs = response.data.branchs;

    return { branchs, totalItems };
  } catch (error) {
    console.error("Unable to get sales data:", error);
    throw error;
  }
}



// used to retrieve branch and category related information inside product filter dropdowns once category and branch is selected
export async function productCategoryInfoInsideBranch( kenema_pharmacy_drug_shop_number?: string, pharmacological_category?: string,description?: string,unit?: string,brand?: string,Manufacturer?: string) {
  try {
    let url = "/filter/productT?";

    if (kenema_pharmacy_drug_shop_number) {
      url += `kenema_pharmacy_drug_shop_number=${kenema_pharmacy_drug_shop_number}&`;
    }
    if (description) {
      url += `description=${description}&`;
    }
    if (unit) {
      url += `unit=${unit}&`;
    }
    if (brand) {
      url += `brand=${brand}&`;
    }
    if (pharmacological_category) {
      url += `pharmacological_category=${pharmacological_category}&`;
    }
    if (Manufacturer) {
      url += `Manufacturer=${Manufacturer}&`;
    }

    return await api.get(url)
  } catch (error) {
    console.error(`Unable to filter ${pharmacological_category} information inside ${kenema_pharmacy_drug_shop_number} information data:`, error);
    throw error;
  }
}

interface ProductPayload {
  kenema_pharmacy_drug_shop_number?: string;
  description?: string;
  unit?: string;
  brand?: string;
  pharmacological_category?: string;
  Manufacturer?: string;
}


//when product filtering cases are passed to it this will returned a paginated response of the the product selelcted with filter
export async function filterProductsApi(filters: ProductPayload,page:number,itemsPerPage:number) {
  
  try {
    let url = "/filter/product?";

    if (filters.kenema_pharmacy_drug_shop_number) {
      url += `kenema_pharmacy_drug_shop_number=${filters.kenema_pharmacy_drug_shop_number}&`;
    }
    if (filters.description) {
      url += `description=${filters.description}&`;
    }
    if (filters.unit) {
      url += `unit=${filters.unit}&`;
    }
    if (filters.brand) {
      url += `brand=${filters.brand}&`;
    }
    if (filters.pharmacological_category) {
      url += `pharmacological_category=${filters.pharmacological_category}&`;
    }
    if (filters.Manufacturer) {
      url += `Manufacturer=${filters.Manufacturer}&`;
    }

    const response = await api.get(url, {
      params: {
        page: page,
        limit:itemsPerPage
      },
    });

    

    const totalItems = response.data.pagination.total;
    const products = response.data.products;
    const success = response.data.success;

    return { products, totalItems, success };

  } catch (error) {
    console.error("Unable filter customers information:", error);
    throw error;
  }
}
