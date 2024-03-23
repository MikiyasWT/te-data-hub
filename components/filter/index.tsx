import React, { Dispatch, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { SET_FILTER, clearFilters, setFilter } from "../../redux/action";
import { customersFilterDropdownData } from "../../services/filter";

type WoredaOption = {
  value: number;
  label: string;
};

type Ketena = {
  value: number;
  label: string;
};

type WoredaKetenas = {
  [subCity: string]: {
    [woreda: number]: Ketena[];
  };
};

type Props = {
  setOpenFilter: Dispatch<SetStateAction<boolean>>;
  setOpenMobileFilter: Dispatch<SetStateAction<boolean>>;
};

const CustomFilter = ({ setOpenFilter, setOpenMobileFilter }: Props) => {
  //birthdate comparision calculators
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");

  const minDate = "1940-01-01";
  const maxDate = `${currentYear}-${currentMonth}-${currentDay}`;

  const initialState = {
    subcity: "",
    woreda: undefined,
    ketena: undefined,
    minimumChildren: 0,
    maximumChildren: 0,
    fromAge:0,
    toAge: 90,
    frombirthdate: minDate,
    tobirthdate: maxDate,
    regionstate: "",
    gender: "",
  };


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


  const [subcity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState<number | string | undefined>("");
  const [ketena, setKetena] = useState<number | string | undefined>("");

  const [minimumChildren, setMinimumChildren] = useState(0);
  const [maximumChildren, setMaximumChildren] = useState(0);
  const [fromAge, setFromAge] = useState(0);
  const [toAge, setToAge] = useState(0);
  const [frombirthdate, setFromBirthdate] = useState("");
  const [tobirthdate, setToBirthdate] = useState("");

  const [regionstate, setRegionstate] = useState("");
  const [gender, setGender] = useState("");


// this state is used to hide dropdown selects if the user selects a region 
//if the selected is addis ababa this will show subcit, woreda and ketena dropdowns
const [isRegionAddisAbaba,setIsRegionAddisAbaba] = useState<boolean>(false)
const [subcitites,setSubcitites] = useState<any[]>()
const [woredas,setWoredas] = useState<any[]>()
const [ketenas,setKetenas] = useState<any[]>()







  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filter);





//this is called whenever the region state dropdwon si selected and cchnaged.
const getAACitySubcities = async (selectedValue:string) => {
   let regionState = selectedValue;
  try {
      const response = await customersFilterDropdownData(regionState);
      if(response.data.success) {
        setSubcitites(response.data.subcity)
      }
  } catch (error) {
    console.error(`Unable to filter ${regionState} information :`, error);
    throw error;
  }
}

//this is called whenever the subcity dropdwon is selected or changed.
const getAACitySubcitiesWoredas = async (selectedSubCity:string) => {
  let regionState = regionstate;
   let subcity = selectedSubCity;
   
  try {
      const response = await customersFilterDropdownData(regionState,subcity);
      
      if(response.data.success) {
        setWoredas(response.data.woreda)
      }
  } catch (error) {
    console.error(`Unable to filter ${subcity} woredas :`, error);
    throw error;
  }
}

//this returns ketenas of the selected woreda
const getSelectedWoredaKetenas = async (selectedValue:string) => {
  let regionState = regionstate;
  let woreda=  selectedValue
  try {
      const response = await customersFilterDropdownData(regionState,subcity,woreda);
      if(response.data.success) {
        setKetenas(response.data.ketena)
      }
  } catch (error) {
    console.error(`Unable to filter ${subcity} " ," ${woredas} list of ketenas :`, error);
    throw error;
  }
}



  const handleRegionStateOptionChange = (event: any) => {
     

    const selectedValue = event.target.value;
    if(selectedValue === 'addis ababa'){
      setRegionstate(selectedValue);
      setIsRegionAddisAbaba(true);
      getAACitySubcities(selectedValue);
    }
    setRegionstate(selectedValue);
  };

  const handleSubCityOptionChange = (event: any) => {
    const selectedSubCity = event.target.value;
    setSubCity(selectedSubCity);

    getAACitySubcitiesWoredas(selectedSubCity)

  };

  const handleWoredaOptionChange = (event: any) => {
    const selectedValue = event.target.value;
    setWoreda(selectedValue);
    getSelectedWoredaKetenas(selectedValue)

  };

  const handleKetenaOptionChange = (event: any) => {
    const selectedValue = event.target.value;
    setKetena(selectedValue);
  }; 

  const handleGenderOptionChange = (event: any) => {
    const selectedValue = event.target.value;
    setGender(selectedValue);
  };

  //children number calculator
  const handleMinimumChildrenChange = (event: any) => {
    const value = event.target.value;
    if (
      value === "" ||
      (parseInt(value) >= 0 &&
        parseInt(value) <= 12 &&
        parseInt(value) <= maximumChildren)
    ) {
      setMinimumChildren(parseInt(value));
    }
  };

  const handleMaximumChildrenChange = (event: any) => {
    const value = event.target.value;
    if (
      value === "" ||
      (parseInt(value) >= 0 &&
        parseInt(value) <= 12 &&
        parseInt(value) >= minimumChildren)
    ) {
      setMaximumChildren(parseInt(value));
    }
  };

  //age calculators

  const handleMinimumAgeChange = (event: any) => {
    const value = event.target.value;
    if (
      value === "" ||
      (parseInt(value) >= 0 &&
        parseInt(value) <= 96 &&
        parseInt(value) <= toAge)
    ) {
      setFromAge(parseInt(value));
    }
  };

  const handleMaximumAgeChange = (event: any) => {
    const value = event.target.value;
    if (
      value === "" ||
      (parseInt(value) >= 0 &&
        parseInt(value) <= 96 &&
        parseInt(value) >= fromAge)
    ) {
      setToAge(parseInt(value));
    }
  };

  const handleFromBirthdateChange = (e: any) => {
    const selectedDate = e.target.value;
    console.log(selectedDate);
    if (selectedDate <= tobirthdate && selectedDate >= minDate) {
      setFromBirthdate(selectedDate);
    } else if (tobirthdate == maxDate || tobirthdate == "") {
      setFromBirthdate(selectedDate);
    } else {
      // Handle invalid date selection
      return;
    }
  };

  const handleToBirthdateChange = (e: any) => {
    const selectedDate = e.target.value;
    if (selectedDate >= frombirthdate && selectedDate <= maxDate) {
      setToBirthdate(selectedDate);
    } else if (frombirthdate == minDate || tobirthdate == "") {
      setToBirthdate(selectedDate);
    } else {
      // Handle invalid date selection
    }
  };


  const subcityNamesOptions = subcitites?.map((subcity,index) => (
    <option key={index} value={subcity.subcity}>
      {subcity.subcity}
    </option>
  ));


  const woredaNamesOptions = woredas?.map((woreda,index) => (
    <option key={index} value={woreda.woreda}>
      {woreda.woreda}
    </option>
  ));

  const ketenaNamesOptions = ketenas?.map((ketena,index) => (
    <option key={index} value={ketena.ketena}>
      {ketena.ketena}
    </option>
  ));




  //this function is used to collect the values of maximu and minimum children and so on
  // this will be triggered when the set Prefereces button is clciked
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // Collect the values
    const data = {
      subcity,
      woreda,
      ketena,
      minimumChildren,
      maximumChildren,
      fromAge,
      toAge,
      frombirthdate,
      tobirthdate,
      regionstate,
      gender,
    };
    

    const transformedObject: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== "" && value !== 0) {
        transformedObject[key] = value;
      }
    }

    // Do something with the collected values
    if (Object.values(filters).length > 0) {
      await dispatch(clearFilters());
      await dispatch(setFilter(transformedObject));
      await handleClear();

      closeModal();
    } else {
      await dispatch(setFilter(transformedObject));
      await closeModal();
      await handleClear();
    }
  };

  const closeModal = () => {
    if (setOpenFilter) {
      return setOpenFilter((prev) => !prev);
    } else if (setOpenMobileFilter) {
      return setOpenMobileFilter((prev) => !prev);
    } else {
      return;
    }
  };

  const handleClear = () => {
    setSubCity(initialState.subcity);
    setKetena(initialState.ketena);
    setWoreda(initialState.woreda);
    setMinimumChildren(initialState.minimumChildren);
    setMaximumChildren(initialState.maximumChildren);
    setFromAge(initialState.fromAge);
    setToAge(initialState.toAge);
    setFromBirthdate(initialState.frombirthdate);
    setToBirthdate(initialState.tobirthdate);
    setRegionstate(initialState.regionstate);
    setGender(initialState.gender);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-[100%]  h-auto md:h-[100%]  md:mx-auto pb-[29px]"
    >
      <div className=" text-center  w-[100%] h-[100%]  mx-auto mt-[23px] ">
        <div className=" w-[100%] h-[100%]  flex flex-col md:flex md:flex-row gap-1 ">
          {/* first column */}
          <div className=" w-1/3 h-[100%] flex flex-col pl-[6px] ">
             
             {/* region state dropdown */}
          <div className="w-[284px] mt-[24px] h-[46px] px-[20px] mb-[40px] border border-gray-400 rounded-md">
             <div className="relative inline-block w-full">
                <select
                  className="block w-full  py-2 pl-3 pr-10 text-base leading-6 bg-white rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={regionstate}
                  onChange={handleRegionStateOptionChange}
                >
                  <option value="" disabled hidden>
                    {" "}
                    <span className="text-black text-base font-open-sans font-semibold break-words">
                      |
                    </span>
                    <span className="text-gray-500 text-base font-open-sans font-normal break-words">
                      Region ...
                    </span>
                  </option>
                  {regions.map((attribute) => (
                    <option key={attribute.value} value={attribute.value}>
                      {attribute.label}
                    </option>
                  ))}
                </select>
                <div className="absolute  h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
            </div>
            {/* end of region state dropdown */}

            {/* subcity dropdown */}
            <div className="w-[284px] h-[46px] px-[20px] mb-[40px] border border-gray-400 rounded-md">
              <div className="relative inline-block w-full">
                <select
                  className="block w-full  py-2 pl-3 pr-10 text-base leading-6 bg-white rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={subcity}
                  onChange={handleSubCityOptionChange}
                  disabled={!isRegionAddisAbaba}
                >
                  <option value="" disabled hidden>
            Choose Subcity
          </option>
          {subcityNamesOptions}
        </select>
                <div className="absolute  h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
            </div>
           {/* end of subcity dropdown */}
            <div className="w-[284px] h-[46px] px-[20px] mb-[40px] border border-gray-400 rounded-md">
              <div className="relative inline-block w-full">
                <select
                  className="block w-full  py-2 pl-3 pr-10 text-base leading-6 bg-white rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={woreda}
                  onChange={handleWoredaOptionChange}
                  disabled={!subcity}
                >
                    <option value="" disabled hidden>
            Choose Woreda
          </option>
          {woredaNamesOptions}
        </select>
                <div className="absolute  h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
            </div>
            <div className="w-[284px] h-[46px] px-[20px] mb-[57px] border border-gray-400 rounded-md">
              <div className="relative inline-block w-full">
                <select
                  className="block w-full  py-2 pl-3 pr-10 text-base leading-6 bg-white rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={ketena}
                  onChange={handleKetenaOptionChange}
                  disabled={!woreda}
                >
                    <option value="" disabled hidden>
            Choose Ketena
          </option>
          {ketenaNamesOptions}
        </select>
                <div className="absolute  h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
            </div>
          </div>
          {/* end of first column */}
          
          {/* second column */}
          <div className=" w-1/3 h-[100%]  flex flex-col pl-[6px] pt-2 ">
            <div className="text-left text-black px-[10px] h-[22px] text-opacity-60 text-base font-normal font-sans break-words ">
              No of Child
            </div>
            <div className="w-[284px] mt-[4px] h-[46px] px-[10px] mb-[20px] pointer-events-none opacity-50   rounded-md">
              <div className="w-full h-full flex items-center space-x-4 ">
                <div className="flex  items-center justify-center mt-1  w-[96px] py-[12px] h-[46px] mr-[60px] border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm overflow-hidden">
                  <span>
                    <span>|</span>min
                  </span>
                  <input
                    id="minimumChildren"
                    type="number"
                    min="0"
                    max="12"
                    value={minimumChildren}
                    onChange={handleMinimumChildrenChange}
                    className="w-full h-[46px] pl-1 text-right border-none outline-none appearance-none"
                  />
                </div>

                <div className="flex  items-center justify-center mt-1  w-[96px] py-[12px] h-[46px] mr-[60px] border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm overflow-hidden">
                  <span>
                    <span>|</span>max
                  </span>
                  <input
                    id="maximumChildren"
                    type="number"
                    min="0"
                    max="12"
                    value={maximumChildren}
                    onChange={handleMaximumChildrenChange}
                    className="w-full h-[46px] pl-1 text-right border-none outline-none appearance-none"
                  />
                </div>
              </div>
            </div>
            <div className="text-left text-black px-[10px]  h-[22px] text-opacity-60 text-base font-normal font-sans break-words">
              Age
            </div>
            <div className=" w-[284px] h-[46px] px-[10px] mb-[16px] ">
              <div className="w-full h-[46px] flex items-center space-x-4 ">
                <div className="flex  items-center justify-center mt-1  w-[96px]  py-[12px] h-[46px] mr-[60px] border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm overflow-hidden">
                  <span>
                    <span>|</span>min
                  </span>
                  <input
                    id="minimumAge"
                    type="number"
                    min="1"
                    max="96"
                    value={fromAge}
                    onChange={handleMinimumAgeChange}
                    className="w-full h-[46px] pl-1 text-right border-none outline-none appearance-none"
                  />
                </div>

                <div className="flex  items-center justify-center mt-1  w-[96px] py-[12px] h-[46px] mr-[60px] border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm overflow-hidden">
                  <span>
                    <span>|</span>max
                  </span>
                  <input
                    id="maximumAge"
                    type="number"
                    min="1"
                    max="96"
                    value={toAge}
                    onChange={handleMaximumAgeChange}
                    className="w-full h-[46px] pl-1 text-right border-none outline-none appearance-none"
                  />
                </div>
              </div>
            </div>
            <div className="text-left text-black px-[10px]  h-[22px] text-opacity-60 text-base font-normal font-sans break-words">
              Birth Date
            </div>
            <div className="w-[284px] h-[82px] px-[10px] mb-[57px]  flex justify-between">
              <div className="flex flex-col h-[70px] ">
                <div className="  w-[100px]  h-[46px] flex  items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
                  <input
                    id="frombirthdate"
                    type="date"
                    min={minDate}
                    max={tobirthdate || maxDate}
                    value={frombirthdate}
                    onChange={handleFromBirthdateChange}
                    className="h-full text-gray-400  focus:border-white"
                  />
                </div>
                <div className="flex justify-start">
                  <span>|min</span>
                </div>
              </div>

              <div className="flex flex-col h-[70px] ">
                <div className="  w-[100px]  h-[46px] flex  items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
                  <input
                    id="tobirthdate"
                    type="date"
                    min={
                      frombirthdate && frombirthdate <= maxDate
                        ? frombirthdate
                        : minDate
                    }
                    max={maxDate}
                    value={tobirthdate}
                    onChange={handleToBirthdateChange}
                    className="h-[46px] pl-1 text-gray-400   focus:border-white"
                  />
                </div>
                <div className="flex justify-start">
                  <span>|max</span>
                </div>
              </div>
            </div>
          </div>
          {/* end of second column */}

          {/* third column */}
          <div className=" w-1/3  h-[100%]  flex flex-col pl-[6px]  ">
             {/* third column first dropdown */}
            <div className="w-[284px] md:mt-[24px] h-[46px] px-[10px] mb-[40px]  border border-gray-400 rounded-md">
            <div className="relative inline-block w-full">
                <select
                  className="block w-full  py-2 pl-3 pr-10 text-base leading-6 bg-white rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={gender}
                  onChange={handleGenderOptionChange}
                >
                  <option value="" disabled hidden>
                    {" "}
                    <span className="text-black text-base font-open-sans font-semibold break-words">
                      |
                    </span>
                    <span className="text-gray-500 text-base font-open-sans font-normal break-words">
                      Gender ...
                    </span>
                  </option>
                  {genders.map((attribute) => (
                    <option key={attribute.value} value={attribute.value}>
                      {attribute.label}
                    </option>
                  ))}
                </select>
                <div className="absolute  h-[46px] inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
            </div>
             {/* end of third column first dropdown */}




            {/* clear and submit buttons */}
            <div className="w-[284px]  h-[46px] px-[20px] mb-[20px]  flex ">
              <button
                onClick={handleClear}
                className="text-black h-full w-[92px] px-[24px] mr-[24px] text-sm bg-white border border-slate-300 rounded-md"
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                className="h-full w-[168px] items-center  pb-13 pl-2 pr-30 bg-blue-500 rounded-lg  flex  text-white text-base font-open-sans font-normal"
              >
                Set Preferences
              </button>
            </div>
            {/* end of clear and submit buttons */}

          </div>
          {/* end of third column */}
        </div>
      </div>
    </div>
  );
};

export default CustomFilter;



const regions = [
  { value: "addis ababa", label: "Addis Ababa" },
  { value: "dire dawa", label: "Dire Dawa" },
  { value: "tigray", label: "Tigray" },
  { value: "afar", label: "Afar" },
  { value: "amhara", label: "Amhara" },
  { value: "oromiya", label: "oromiya" },
  { value: "benishangul", label: "Beninshangul" },
  { value: "gambela", label: "Gambela" },
  { value: "harari", label: "Harari" },
  { value: "south", label: "Southern Ethiopia" },
  { value: "somali", label: "Somali " },
];

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },

];


interface Woreda {
  value: number;
  label: string;
}

interface SubCityWoredasMap {
  [subCity: string]: Woreda[];
}

const subCityWoredas: SubCityWoredasMap = {
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

const woredaKetenas: WoredaKetenas = {
  "lemi kura": {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    9: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    10: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    11: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
  bole: {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    9: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    10: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    11: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    12: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
  "nifas Silk": {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
  yeka: {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    9: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    10: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
  "akaki kality": {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "salo " },
      { value: 2, label: "chefee " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "babur tabiya " },
      { value: 2, label: "Gebriel " },
      { value: 3, label: "Cheri " },
      { value: 4, label: "Sefera " },
      { value: 5, label: "meno" },
      { value: 6, label: "berta " },
      { value: 7, label: "genet " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    9: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    10: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
  kolfe: {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena x " },
      { value: 2, label: "ketena y " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
  },

  arada: {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
  kirkos: {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
  },
  gulele: {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
  },
  lideta: {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
  "addis ketema": {
    1: [{ value: 1, label: "Ketena 1 " }],
    2: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
    ],
    3: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
    4: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
    ],
    5: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
    ],
    6: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
    ],
    7: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
      { value: 4, label: "Ketena 4 " },
      { value: 5, label: "ketena 5 " },
      { value: 6, label: "ketena 6 " },
      { value: 7, label: "ketena 7 " },
    ],
    8: [
      { value: 1, label: "Ketena 1 " },
      { value: 2, label: "ketena 2 " },
      { value: 3, label: "ketena 3 " },
    ],
  },
};
