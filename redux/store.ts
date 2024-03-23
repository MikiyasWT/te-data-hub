import { createStore, Store, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { actionTabReducer, notificationReducer, userInfoReducer, unreadMessagesReducer,queryReducer, filterReducer, notificationMessagesReducer, productFilterReducer } from "./reducer";
import { CombinedAppState } from "./types";

export type AppState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  activeTab: actionTabReducer,
  notification: notificationReducer,
  userInfo: userInfoReducer,
  unreadMessages: unreadMessagesReducer,
  query:queryReducer,
  filter:filterReducer,
  productFilter:productFilterReducer,
  notificationMessage:notificationMessagesReducer
});

const configureStore = (): Store<CombinedAppState> => {
  const store: Store<CombinedAppState> = createStore(
    rootReducer,
    composeWithDevTools()
  );

  return store;
};

export default configureStore;