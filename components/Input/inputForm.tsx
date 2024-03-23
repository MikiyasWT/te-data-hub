import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

interface IInputProps {
  onChange: (event: string, index: any) => void;
  isError: boolean;
  value: string;
  name: string;
  type: string;
  placeholder: string;
  index: number;
  isEditing: boolean;
}

const InputForm: React.FC<IInputProps> = ({
  onChange,
  isError,
  name,
  value,
  type,
  placeholder,
  index,
  isEditing,
}) => {
  return (
    <div
      className={`flex flex-col w-full lg:w-1/3 xl:w-1/3 md:w-1/2 ${
        isEditing ? "py-2 mx-4" : "border-b border-gray-600 py-2 "
      }`}
    >
      <label htmlFor="inputText" className="text-normal mb-1">
        {name}
      </label>
      <div className="flex items-center flex-row">
        <div
          className={`"flex items-center border-gray-300" ${
            isEditing ? "border py-2" : ""
          }`}
        >
          <input
            type={type}
            onChange={(event) => onChange(event.target.value, index)}
            className={`border-none w-full outline-none bg-white flex-grow px-2  ${
              isError ? "border-red-600" : ""
            }`}
            value={value}
            name={name}
            placeholder={placeholder}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default InputForm;
