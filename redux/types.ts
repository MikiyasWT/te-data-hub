import { Reducer, CombinedState } from "redux";
import { AppState } from "./store";
import { UPDATE_NOTIFICATION } from "./action";

// Define the action types
export interface SetUserInfoAction {
  type: boolean;
  payload: boolean;
}

export interface UserInfoState {
  userInfo: boolean;
}


export interface SetAuthorizationToken {
  type: string;
  payload: string;
}


export interface RemoveAuthorizationToken {
  type: string;
  payload: string;
}

export interface AuthorizationTokenState {
  authorizationToken: string;
}


//query
export interface SetQueryAction {
  type: string;
  payload: string;
}

export interface QueryState {
  query:string
}



export interface SetActiveTabAction {
  type: string;
  payload: string;
}

export interface ActionTabState {
  activeTab: string;
}

export interface DisplayNotificationAction {
  type: boolean;
  payload: boolean;
}

export interface NotificationState {
  notification: boolean;
}


export interface SetUnreadMessagesAction {
  type: number;
  payload: number;
}




// filter object
type DynamicObject = {
  [key: string]: any;
};

export interface SetFilterAction {
  type :DynamicObject
}

export interface FilterState {
  filter:DynamicObject
}

export interface ClearFiltersAction {
  type :DynamicObject
}


//product filter
interface ProductFilterType {
  kenema_pharmacy_drug_shop_number?: string;
  description?: string;
  unit?: string;
  brand?: string;
  pharmacological_category?: string;
  Manufacturer?: string;
}

export interface SetProductFilterAction {
  type :ProductFilterType
}

export interface productFilterState {
  productFilter:ProductFilterType
}

export interface ClearProductFilterAction {
  type :ProductFilterType
}



//notification message
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
   type:Notification[];

}

export interface UpdateNotificationAction {
  type: typeof UPDATE_NOTIFICATION;
  payload: Notification;
}

export interface NotificationMessageState {
  notificationMessage:Notification[]
}

//update notiifcation


export type NotificationActions =
  | SetNotificationMessageAction
  | UpdateNotificationAction;


//end of notiification message

// Define the reducer types


export type ActionTabReducer = Reducer<ActionTabState, SetActiveTabAction>;
export type NotificationReducer = Reducer<NotificationState, DisplayNotificationAction>;
export type UserInfoReducer = Reducer<UserInfoState, SetUserInfoAction>;

export type QueryReducer = Reducer<QueryState,SetQueryAction>
export type UnreadMessagesReducer = Reducer<number, SetUnreadMessagesAction>;
export type FilterReducer = Reducer<FilterState,SetFilterAction | ClearFiltersAction>;
export type productFilter = Reducer<productFilterState,SetProductFilterAction | ClearProductFilterAction>;
export type AuthorizationTokenReducer = Reducer<AuthorizationTokenState, SetAuthorizationToken | RemoveAuthorizationToken >;

export type NotificationMessageReducer = Reducer<NotificationMessageState ,SetNotificationMessageAction>

// Define the root state type
// Define the root state type
interface RootState {
  activeTab: ActionTabState;
  notification: NotificationState;
  userInfo: UserInfoState;
  query: QueryState;
  unreadMessages: number;
  filter:FilterState,
  productFilter:productFilterState,
  notificationMessage:NotificationMessageState 

}

// Define the combined state type
export type CombinedAppState = CombinedState<RootState>;