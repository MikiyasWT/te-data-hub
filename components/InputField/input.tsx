import React from "react";


interface PROPS {
    OnChange: any;
    isError:Boolean;
    value?: string;
    name:any;
    type:any;
    label:String;
    placeholder:string;

}

export const Input = ({OnChange,isError,value,name,type,label,placeholder}:PROPS) => {

    return(
      <>
<div className="flex flex-col my-2 py-2 px-2 ">
        <label className="whitespace-pre-wrap left-[7px] font-['Open_Sans'] text-lg leading-[normal] text-left text-black">{label}</label>
        <input
          onChange={OnChange}
          value={value}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-[583px] h-[61px]  rounded-[10px] bg-white border border-black/10 whitespace-pre-wrap top-[49px] left-[30px] font-['Open_Sans'] text-lg leading-[normal] text-left text-[#8e8e8e] ${isError ? "border-red-500" : ""}`}
                    style={{
                      boxShadow: "1px 1px 1px 0 rgba(0,0,0,0.06)",
                    }}          
          
          >
</input>
       
</div> 



</>
    );
}

