import React from "react";

interface PROPS {
  onchange: (e: string) => void;
  text: any;
}

export const CustomButton = ({ onchange, text }: PROPS) => {
  return (
    <button
      onClick={(e: any) => onchange(e)}
      className="w-full lg:w-[433px] h-12 bg-blue-500 rounded-[10px] mt-6 border text-white border-blue-500"
    >
      {text}
    </button>
  );
};

























