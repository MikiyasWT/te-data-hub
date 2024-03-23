import React from "react";

interface PROPS {
  onchange: (e: string) => void;
  isError: Boolean;
  value: string;
  name: any;
  type: any;
  placeholder: any;
}

export const Input = ({
  onchange,
  isError,
  name,
  value,
  type,
  placeholder,
}: PROPS) => {
  return (
    <input
      type={type}
      onChange={(event) => onchange(event.target.value)}
      className={` w-full  h-[61px] rounded-[10px] pl-4  focus:outline-none bg-white border border-black/10"
                ${isError ? "border-red-500" : ""}`}
      value={value}
      name={name}
      placeholder={placeholder}
    />
  );
};
