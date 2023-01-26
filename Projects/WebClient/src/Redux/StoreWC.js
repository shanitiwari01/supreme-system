import {createStore, combineReducers} from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import CommonReducerWC from './Reducers/CommonReducerWC';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    blacklist:['common','clinician', 'user' ]
  }

  // for user Reducer
const authPersistConfig = {
    key: 'auth',
    storage: storage,
    whitelist: ['orgId']
  };
  let reducer =combineReducers({   
    common: CommonReducerWC,
});
const persistedReducer = persistReducer(persistConfig, reducer)

 export const appstore = createStore(persistedReducer);
export const persistor = persistStore(appstore);