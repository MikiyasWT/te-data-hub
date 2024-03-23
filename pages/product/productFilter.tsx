import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import Modal from "react-modal";
import { getAllBranchData } from "../../services/branch";
import {productCategoryInfoInsideBranch } from "../../services/filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { setProductFilter,clearProductFilters } from "../../redux/action";


type Props = {
    setOpenFilter: Dispatch<SetStateAction<boolean>>;
    setOpenMobileFilter: Dispatch<SetStateAction<boolean>>;
  };
interface Product {
    kenema_pharmacy_drug_shop_number: string;
    description: string;
    item_code: string;
    unit: string;
    brand: string;
    pharmacological_category: string;
    manufacturer: string | null;
    batch_number: string;
    exp_date: string;
    vat: string;
    quantity: number;
    unit_selling_price: string;
    total_selling_price: string;
  }
const ProductFilter = ({ setOpenFilter, setOpenMobileFilter }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    
    const [branchs, setBranchs] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [units,setUnits] = useState<any[]>([])
    const [brands,setBrands] = useState<any[]>([])
    const [manufacturers,setManufacturers] = useState<any[]>([])

    

    const [selectedBranch, setSelectedBranch] = useState();
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [selectedProductName, setSelectedProductName] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');

    const itemsPerPage = 20;
    const [productsDetail, setProductsDetail] = useState<Product[]>([]);

    const dispatch = useDispatch();
    const productFilters = useSelector((state: RootState) => state.productFilter);

const getAllBranches = async (page:number) => {
      try {
        const response = await getAllBranchData(page, itemsPerPage);
        return response;
      } catch (error) {
        console.error('Unable to fetch branches:', error);
        throw error; // Rethrow the error to handle it in the component
      }
    };


const fetchBranches = async () => {
      let currentPage = 1;
      let allBranches: any[] = [];
  
      try {
        let response = await getAllBranches(currentPage);
        while (response.branchs.length > 0) {
          allBranches = [...allBranches, ...response.branchs];
          currentPage++;
          response = await getAllBranches(currentPage);
        }
        setBranchs(allBranches);
      } catch (error) {
        console.error('Error fetching branches:', error);
        // Handle the error as needed (e.g., show an error message to the user)
      }
    };
  
  useLayoutEffect(() => {
      fetchBranches();
    }, []); // Empty dependency array to run the effect only once

// this returns pharamcological categories that are found inside the selected branch
const getCategoreisListInsideBranch = async (selectedBranch:any) => {
    
      const kenema_pharmacy_drug_shop_number = selectedBranch
      try {
         const response = await productCategoryInfoInsideBranch(kenema_pharmacy_drug_shop_number);
       
         if(response.data.success){
          setCategories(response.data.category)
         }
       
      } catch (error) {
        
       console.error(`Unable to filter ${selectedProductCategory} information inside ${selectedBranch} information data:`, error);
        throw error;
      }
 }  
  
//this returns a list of products detail based on there branch and category    
const getProductCategoryDetailsInsideBranch = async () => {
  const kenema_pharmacy_drug_shop_number = selectedBranch;
  const pharmacological_category = selectedProductCategory;

     try {
      if(selectedBranch!== undefined && selectedProductCategory!== undefined && selectedProductCategory!==''){
        const response = await productCategoryInfoInsideBranch(kenema_pharmacy_drug_shop_number,pharmacological_category );
        if(response.data.success){
          setProducts(response.data.description)
        }
      }
     } catch (error) {
      console.error(`Unable to filter ${selectedProductCategory} information inside ${selectedBranch} information data:`, error);
       throw error;
     }
} 


//this returns the rest of the information we need about the product including its manufacturer, unit and brands
const getProductTotalInformation = async () => {
  const kenema_pharmacy_drug_shop_number = selectedBranch;
  const pharmacological_category = selectedProductCategory;
  const description = selectedProductName
     try {
      if(selectedBranch!== undefined && selectedProductCategory!== undefined && selectedProductCategory!==''){
        const response = await productCategoryInfoInsideBranch(kenema_pharmacy_drug_shop_number,pharmacological_category,description );
        if(response.data.success){
          setUnits(response.data.unit)
          setBrands(response.data.brand)
          setManufacturers(response.data.manufacturer)
        }
      }
     } catch (error) {
      console.error(`Unable to filter ${selectedProductCategory} information inside ${selectedBranch} information data:`, error);
       throw error;
     }
}




useEffect(() => {
  if(selectedBranch !== undefined && selectedBranch!== '' && selectedProductCategory!== undefined && selectedProductCategory!== ''){
      //fetchBranchDetail();
      console.log(getProductCategoryDetailsInsideBranch())
  }

  
},[selectedBranch,selectedProductCategory])    

const closeModal = () => {
        if (setOpenFilter) {
          return setOpenFilter((prev) => !prev);
        } else if (setOpenMobileFilter) {
          return setOpenMobileFilter((prev) => !prev);
        } else {
          return;
      }
  };

const openModal = () => {
    setIsModalOpen(true);
  };


const handleProductCategoryChange = (e:any) => {
        const subCityValue = e.target.value;
        setSelectedProductCategory(subCityValue);
        setSelectedProductName('');
      };
    
const handleProductNameChange = (e:any) => {
        const woredaValue = e.target.value;
        setSelectedProductName(woredaValue);
        getProductCategoryDetailsInsideBranch();
      };

const handleBranchChange = (e:any) => {
        setSelectedBranch(e.target.value);
        getCategoreisListInsideBranch(e.target.value)
      };


const handleUnitChange = (e:any) => {
        setSelectedUnit(e.target.value);
      };    
      
     
const handleBrandChange = (e:any) => {
        setSelectedBrand(e.target.value);
      }; 

const handleManufacturerChange = (e:any) => {
  setSelectedManufacturer(e.target.value);
      };       
    
const pharmacological_category = categories.map((category,index) => (
        <option key={index} value={category.pharmacological_category}>
          {category.pharmacological_category}
        </option>
      ));

const productNameOptions = products.map((product,index) => (
        <option key={index} value={product.description}>
          {product.description}
        </option>
      ));       

const unitNamesOptions = units.map((unit,index) => (
  <option key={index} value={unit.unit}>
    {unit.unit}
  </option>
));   


const brandNamesOptions = brands.map((brand,index) => (
  <option key={index} value={brand.brand}>
    {brand.brand}
  </option>
));

const manufacturerNamesOptions = manufacturers.map((manufacturer,index) => (
  <option key={index} value={manufacturer}>
    {manufacturer}
  </option>
));
//products
// const productNameOptions =
//       selectedProductCategory && productName[selectedProductCategory]
//           ? productName[selectedProductCategory].map((itemName) => (
//               <option key={itemName.value} value={itemName.value}>
//                 {itemName.label}
//               </option>
//             ))
//           : null;



 useEffect(() => {
     if(selectedProductName!==undefined && selectedProductName!==''){
        getProductTotalInformation()
     }
 },[selectedProductName])         
                    
        
const handleSubmit = async (event:any) => {
      event.preventDefault();

      const payload = {
        kenema_pharmacy_drug_shop_number: selectedBranch,
        pharmacological_category:selectedProductCategory,
        description:selectedProductName,  
        unit: selectedUnit,
        brand: selectedBrand,
        Manufacturer: selectedManufacturer
      }

    //console.log(payload)

    const transformedObject: any = {};

    for (const [key, value] of Object.entries(payload)) {
      if (value !== "" && value !== undefined) {
        transformedObject[key] = value;
      }
    }

    // Do something with the collected values
    if (Object.values(productFilters).length > 0) {
      console.log(transformedObject)
      
      await dispatch(clearProductFilters());
      await dispatch(setProductFilter(transformedObject));
      await handleClear();

      closeModal();
    } else {
      console.log(transformedObject)
      //debugger;
      await dispatch(setProductFilter(transformedObject));   
      await handleClear();
      await closeModal();
    }

     
}; 

const handleClear = () => {

      setSelectedBranch(undefined);
      setSelectedProductCategory("");
      setSelectedProductName("");  
      setSelectedUnit("");
      setSelectedBrand("");
      setSelectedManufacturer("");

};

        
return(
 <div  onClick={(e) => e.stopPropagation()} className="flex flex-col   md:flex-row  bg-white w-[100%]  h-full md:h-[100%]  md:mx-auto ">
   
   {/* first column */}
    <div className="bg-white  w-1/2 flex flex-col px-2 py-8 md:py-4 gap-12 md:gap-8">
        
        {/* first dropdown */}
        {/* branch */}
        <div className="relative inline-block w-full">

         {/* branch dropdown */}
      <select
        className="block w-full py-2 pl-3 pr-10 text-base leading-6 bg-white border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        value={selectedBranch || ""}
        onChange={handleBranchChange}
      >
        choose branch
        <option value="" disabled hidden>
          Choose Branch...
        </option>
        {branchs.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.branch_name}
          </option>
        ))}
      </select>
      <div className="absolute h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12.586l4.95-4.95a1 1 0 1 1 1.414 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L3.636 9.05a1 1 0 1 1 1.414-1.414L10 12.586z"
                clipRule="evenodd"
              />
            </svg>
          </div>

      {/* end of branch select dropdown */}
      
        </div>
        {/* end of first dropdown */}
        {/* end of branch dropdown */}
        
        
        
        
        
        
        {/* second dropdown */}
        {/* product category */}
        <div className="relative inline-block w-full ">
        <select
          className="block w-full py-2 pl-3 pr-10 text-base leading-6 border border-slate-300  rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={!selectedBranch}
          value={selectedProductCategory}
          onChange={handleProductCategoryChange}
        >
          <option value="" disabled hidden>
            Pharmacological Category...
          </option>
          {pharmacological_category}
        </select>
        <div className="absolute h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12.586l4.95-4.95a1 1 0 1 1 1.414 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L3.636 9.05a1 1 0 1 1 1.414-1.414L10 12.586z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* end of second dropdown */}

        {/* third dropdown */}
        {/* item description or drug name */}
        <div className="relative inline-block w-full">
        <select
          className={`block w-full py-2 pl-3 pr-10 text-base leading-6 border border-slate-300 bg-white rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            selectedProductCategory ? '' : 'cursor-not-allowed'
          }`}
          disabled={!selectedProductCategory}
          value={selectedProductName}
          onChange={handleProductNameChange}
        >
          <option value="" disabled hidden>
            Product Name
          </option>
          {productNameOptions}
        </select>
        <div className="absolute h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12.586l4.95-4.95a1 1 0 1 1 1.414 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L3.636 9.05a1 1 0 1 1 1.414-1.414L10 12.586z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* end of the third dropdown */}



    </div>
    {/* end of first column */}


    {/* second column */}
    <div className=" w-1/2 flex flex-col  px-2 py-8 md:py-4 gap-12 md:gap-8">
                {/* first dropdown */}
        {/* unit of measure */}
      <div className="relative inline-block w-full">
          <select
            value={selectedUnit}
            onChange={handleUnitChange}
            className="block w-full py-2 pl-3 pr-10 text-base leading-6 bg-white border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            <option value="" disabled hidden>
              
              <span className="text-gray-500 text-base font-open-sans font-normal break-words">
                Choose Unit ...
              </span>
            </option>
            {unitNamesOptions}
          </select>
          <div className="absolute h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12.586l4.95-4.95a1 1 0 1 1 1.414 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L3.636 9.05a1 1 0 1 1 1.414-1.414L10 12.586z"
                clipRule="evenodd"
              />
            </svg>
          </div>
      </div>
        {/* end of unit */}

        {/* second dropdown */}
        {/* brand dropdown */}
        <div className="relative inline-block w-full">
        <select
            value={selectedBrand}
            onChange={handleBrandChange}
            className="block w-full py-2 pl-3 pr-10 text-base leading-6 bg-white border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            <option value="" disabled hidden>
             
              <span className="text-gray-500 text-base font-open-sans font-normal break-words">
                Choose Brand ...
              </span>
            </option> 
            {brandNamesOptions}
          </select>
          <div className="absolute h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12.586l4.95-4.95a1 1 0 1 1 1.414 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L3.636 9.05a1 1 0 1 1 1.414-1.414L10 12.586z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* end of brand dropdown */}
        {/* end of thrid dropdown */}

        {/* third dropdown */}
        {/* manufacturer dropdown */}
        <div className="relative inline-block w-full">
        <select
            value={selectedManufacturer}
            onChange={handleManufacturerChange}
            className="block w-full py-2 pl-3 pr-10 text-base leading-6 bg-white border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            <option value="" disabled hidden>
              
              <span className="text-gray-500 text-base font-open-sans font-normal break-words">
                Choose Manufacturer ...
              </span>
            </option>
            {manufacturerNamesOptions}
          </select>
          <div className="absolute h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12.586l4.95-4.95a1 1 0 1 1 1.414 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L3.636 9.05a1 1 0 1 1 1.414-1.414L10 12.586z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* end of manufacturer dropdwon */}
        {/* end of thrid dropdown */}

    </div>
    {/* end of second column */}



    {/* third column */}
    <div className="bg-white w-1/3 flex flex-col md:justify-end py-8 md:py-4 gap-12 md:gap-8">
      {/* submit and clear buttons */}
      <div className=" w-full md:w-[284px]   h-[46px] px-[20px] mb-[20px]  flex ">
                <button
                  onClick={handleClear}
                  className="text-black h-full w-[92px] px-[24px] mr-[24px] text-sm bg-white border border-slate-300 rounded-md"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  className="h-full w-fit px-10  md:w-[168px] items-center  pb-13  pr-30 bg-blue-500 rounded-lg  flex  text-white text-base font-open-sans font-normal"
                >
                  Filter
                </button>
      </div>
      {/* end of submit and clear buttons */}
    </div>
    {/* end of third column */}


</div>
    )
}

export default ProductFilter;



interface Woreda {
    value: number;
    label: string;
  }
  
  interface SubCityWoredasMap {
    [subCity: string]: Woreda[];
  }
const productName: SubCityWoredasMap = {
    "lemi kura": [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
      { value: 9, label: "Woreda 9" },
      { value: 10, label: "Woreda 10" },
      { value: 11, label: "Woreda 11" },
    ],
    bole: [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
      { value: 9, label: "Woreda 9" },
      { value: 10, label: "Woreda 10" },
      { value: 11, label: "Woreda 11" },
      { value: 12, label: "Woreda 12" },
    ],
    "nifas Silk": [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
    ],
    yeka: [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
      { value: 9, label: "Woreda 9" },
      { value: 10, label: "Woreda 10" },
    ],
    "akaki kality": [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
      { value: 9, label: "Woreda 9" },
      { value: 10, label: "Woreda 10" },
    ],
    kolfe: [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
    ],
    arada: [
      { value: 1, label: "Woreda 1" },
      { value: 2, label: "Woreda 2" },
      { value: 3, label: "Woreda 3" },
      { value: 4, label: "Woreda 4" },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
    ],
    kirkos: [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
    ],
    gulele: [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
    ],
    lideta: [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
    ],
    "addis ketema": [
      { value: 1, label: "Woreda 1 " },
      { value: 2, label: "Woreda 2 " },
      { value: 3, label: "Woreda 3 " },
      { value: 4, label: "Woreda 4 " },
      { value: 5, label: "Woreda 5" },
      { value: 6, label: "Woreda 6" },
      { value: 7, label: "Woreda 7" },
      { value: 8, label: "Woreda 8" },
    ],
  };





 