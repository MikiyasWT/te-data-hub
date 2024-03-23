
import React from "react";
import Icon from "../Icons/Icon";

export const ActivityIndicator = () => {
    return (
    <div role="status" >
        <Icon color="blue-600"   path="loading"/>
        <span className="sr-only">Loading...</span>
    </div>
    )   
}