import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import EncryptedStorage from 'react-native-encrypted-storage';

import rootReducers from './../store/reducers'; // where reducers is a object of reducers

const config = {
  key: 'root',
  storage: EncryptedStorage,
  blacklist: ['loadingReducer'],
  debug: true, //to get useful logging
};

const reducers = persistCombineReducers(config, rootReducers);
const store = createStore(reducers, undefined);
const persistor = persistStore(store);
const configureStore = () => {
  return { persistor, store };
};

export default configureStore;
