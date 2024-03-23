import { Reducer } from "redux";
import { ActiveTabActionTypes,SetProductFilterAction,ClearProductFilterAction,SetFilterAction,ClearFiltersAction, DisplayNotificationAction, SetUserInfoAction, SetUnreadMessagesAction, SetQueryAction, SetNotificationMessageAction, SET_NOTIFICATION_MESSAGE, UPDATE_NOTIFICATION, UpdateNotificationAction, initialProductFilterState } from "../action";
import { initialActiveTabState, initialNotificationState, initialUserInfoState,initialQueryState,initialFilterState,initialNotificationMessageState } from "../action/index";
import { NotificationActions } from "../types";

export const actionTabReducer: Reducer<string, ActiveTabActionTypes> = (
  state = initialActiveTabState,
  action
) => {
  switch (action.type) {
    case "SET_ACTION_TAB":
      return action.payload;
    default:
      return state;
  }
};

type DynamicObject = {
  [key: string]: any;
};
export const filterReducer: Reducer<DynamicObject,SetFilterAction| ClearFiltersAction> = (
 state = initialFilterState,
 action
) => {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        ...action.payload,
      };
    case "CLEAR_FILTER":
        return {};  
    default:
      return state;
  }
}


interface ProductFilterType {
  kenema_pharmacy_drug_shop_number?: string;
  description?: string;
  unit?: string;
  brand?: string;
  pharmacological_category?: string;
  Manufacturer?: string;
}
export const productFilterReducer:Reducer<ProductFilterType,SetProductFilterAction | ClearProductFilterAction> = (
  state = initialProductFilterState,
  action
) => {
  switch (action.type) {
    case "SET_PRODUCT_FILTER":
      return {
        ...state,
        ...action.payload,
      };
    case "CLEAR_PRODUCT_FILTER":
        return {};  
    default:
      return state;
  }
}


//notification messages reducer 
type Notification = {
  id: number;
  title: string;
  body: string;
  email: string;
  isRead: boolean;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
};


export const notificationMessagesReducer:Reducer<Notification[],SetNotificationMessageAction | UpdateNotificationAction> = (
state = [],
action
) => {
  switch (action.type) {
    case SET_NOTIFICATION_MESSAGE:
      return action.payload;
    case UPDATE_NOTIFICATION:
      return state.map((notification) =>
        notification.id === action.payload.id ? action.payload : notification
      );
    default:
      return state;
  }
}


//update notiifcation action creators
// export const notificationMessagesReducer: Reducer<Notification[], NotificationActions> = (
//   state = [],
//   action
// ) => {
//   switch (action.type) {
//     case SET_NOTIFICATION_MESSAGE:
//       return action.payload;
//     case UPDATE_NOTIFICATION:
//       return state.map((notification) =>
//         notification.id === action.payload.id ? action.payload : notification
//       );
//     default:
//       return state;
//   }
// };


//end of notiifcation messages reducer







export const notificationReducer: Reducer<boolean, DisplayNotificationAction> = (
  state = initialNotificationState,
  action
) => {
  switch (action.type) {
    case "DISPLAY_NOTIFICATION":
      return !state;
    default:
      return state;
  }
};




export const userInfoReducer: Reducer<boolean, SetUserInfoAction> = (
  state = initialUserInfoState,
  action
) => {
  switch (action.type) {
    case "DISPLAY_USERINFO":
      return !state;
    default:
      return state;
  }
};








export const unreadMessagesReducer: Reducer<number, SetUnreadMessagesAction> = (
  state=0,
  action
) => {
  switch (action.type) {
    case "SET_UNREAD_MESSAGES":
      return action.payload;
    default:
      return state;
  }
};






//SEARCH INPUT QUERY 


export const queryReducer : Reducer<string, SetQueryAction> = (
  state = initialQueryState, action
) => {
  switch (action.type) {
    case 'SET_QUERY':
      return action.payload;
    default:
      return state;
  }
};



 




//SEARCH INPUT QUERY 


export type RootState = {
  activeTab: string;
  notification: boolean;
  userInfo: boolean;
  unreadMessages: number;
  query: string;
  filter:DynamicObject,
  productFilter:ProductFilterType,
  authorizationToken:string,
  notificationMessage:Notification[]
};