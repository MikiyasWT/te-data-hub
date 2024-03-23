export const SET_ACTIVE_TAB = "SET_ACTION_TAB";
export const DISPLAY_NOTIFICATION = "DISPLAY_NOTIFICATION";
export const DISPLAY_USERINFO = "DISPLAY_USERINFO";
export const SET_UNREAD_MESSAGES = "SET_UNREAD_MESSAGES"; // New action type
export const SET_QUERY = "SET_QUERY";
export const SET_FILTER = "SET_FILTER";
export const CLEAR_FILTER = "CLEAR_FILTER";

export const AUTH_TOKEN = "AUTH_TOKEN";
export const SET_NOTIFICATION_MESSAGE = "SET_NOTIFICATION_MESSAGE";
export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION";
export const SET_PRODUCT_FILTER = "SET_PRODUCT_FILTER";
export const CLEAR_PRODUCT_FILTER = "CLEAR_PRODUCT_FILTER";
type DynamicObject = {
  [key: string]: any;
};
//export interface initialFilterState
export interface SetFilterAction {
 type: typeof SET_FILTER,
 payload:DynamicObject
}

export const setFilter =(filters:DynamicObject):SetFilterAction => ({
  type: SET_FILTER,
  payload:filters
})

export interface ClearFiltersAction {
  type: typeof CLEAR_FILTER
}
export const clearFilters = ():ClearFiltersAction => ({
  type: CLEAR_FILTER,

})


//PRODUCT FILTER
interface ProductFilterType {
  kenema_pharmacy_drug_shop_number?: string;
  description?: string;
  unit?: string;
  brand?: string;
  pharmacological_category?: string;
  Manufacturer?: string;
}
export interface SetProductFilterAction {
  type: typeof SET_PRODUCT_FILTER,
  payload:ProductFilterType
}
export const setProductFilter = (filters:ProductFilterType): SetProductFilterAction =>({
 type:SET_PRODUCT_FILTER,
 payload:filters
})

export interface ClearProductFilterAction {
  type :typeof CLEAR_PRODUCT_FILTER
}
export const clearProductFilters = ():ClearProductFilterAction => ({
   type:CLEAR_PRODUCT_FILTER
})





//NOTIIFCATION MESSAGE
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

export interface SetNotificationMessageAction {
  type : typeof SET_NOTIFICATION_MESSAGE,
  payload:Notification[]
}

export const setNotificationMessage = (notifications:Notification[]):SetNotificationMessageAction =>({
  type : SET_NOTIFICATION_MESSAGE,
  payload:notifications
})



//to update an individual notiifcation
export interface UpdateNotificationAction {
  type: typeof UPDATE_NOTIFICATION;
  payload: Notification;
}

export const updateNotification = (notification: Notification): UpdateNotificationAction => ({
  type: UPDATE_NOTIFICATION,
  payload: notification,
});

//end of update notification

// end of notification message






export interface SetActiveTabAction {
  type: typeof SET_ACTIVE_TAB;
  payload: string;
}

export interface DisplayNotificationAction {
  type: typeof DISPLAY_NOTIFICATION;
  //payload: boolean;
}

export interface SetUserInfoAction {
  type: typeof DISPLAY_USERINFO;
  //payload: boolean;
}

export interface SetQueryAction {
  type: typeof SET_QUERY;
  payload: string;
}







export const setActiveTab = (newActiveTab: string): SetActiveTabAction => ({
  type: SET_ACTIVE_TAB,
  payload: newActiveTab,
});








export const setQuery = (newQuery: string): SetQueryAction => ({
  type: 'SET_QUERY',
  payload: newQuery,
})

export const displayNotification = (): DisplayNotificationAction => ({
  type: DISPLAY_NOTIFICATION,
  //payload: isClicked,
});

export const displayUserInfo = (): SetUserInfoAction => ({
  type: DISPLAY_USERINFO,
  //payload: isClicked,
});






export interface SetUnreadMessagesAction {
  type: typeof SET_UNREAD_MESSAGES;
  payload: number;
}

export const setUnreadMessages = (count: number): SetUnreadMessagesAction => ({
  type: SET_UNREAD_MESSAGES,
  payload: count,
});


export const initialUserInfoState: boolean = false;
export const initialNotificationState: boolean = false;
export const initialActiveTabState: string = "";
export const initialQueryState: string = "";
export const initialFilterState: DynamicObject = {};
export const initialProductFilterState:ProductFilterType = {}
export const initialNotificationMessageState:Notification[]= []
//export const initialUnreadMessages:Number | null = 0;

export type ActiveTabActionTypes =
  | SetActiveTabAction
  | DisplayNotificationAction
  | SetUserInfoAction
  | SetUnreadMessagesAction
  | SetQueryAction
  | SetFilterAction
  | ClearFiltersAction
  | SetProductFilterAction
  | ClearProductFilterAction   
  | SetNotificationMessageAction