import React from "react";

interface SelectedFiltersProps {
  filters: any
  onRemoveFilter: (key: string) => void;
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ filters, onRemoveFilter }) => {
   

  return (
    <div className="selected-filters mb-4 flex flex-row gap-4">
      {Object.entries(filters).map(([key, value]) => (
        <div key={key} className="bg-blue-200 rounded-md  py-1   w-[200px] mb-2 flex justify-center items-center">
          <span className="mr-2">{key}: {value}</span>
         
        </div>
      ))}
    </div>
  );
};

export default SelectedFilters;




export function removeObjectKey(obj: Record<string, any>, key: string): Record<string, any> {
    const { [key]: deletedKey, ...newObj } = obj;
    return newObj;
  }


  //const updatedX = removeObjectKey(filters,key);


