import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter} from 'react-router-dom';
import {appstore, persistor} from './Redux/StoreWC';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';


ReactDOM.render(
  <Provider store={appstore}>
    <PersistGate loading={null} persistor={persistor}>
     <BrowserRouter><App /></BrowserRouter>
     </PersistGate>
   </Provider>
 ,
   document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
