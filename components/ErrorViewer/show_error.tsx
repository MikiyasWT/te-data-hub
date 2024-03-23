
import React from "react";

interface PROPS {
    isShow: Boolean;
    text:String
  }

export const CustomErrorViewer= ({isShow,text}:PROPS) => {
    return (
        isShow &&
        <p className="text-red-500 mt-1 text-sm">{text}</p>
    ) 
}