import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import App from './App';
import axios from 'axios';
import {store} from './redux/store';
import './index.css';

axios.defaults.baseURL = "http://localhost:5000";
axios.interceptors.request.use((config) => {
  store.dispatch({type:"changeLoding",data:true});
  return config;
})
axios.interceptors.response.use((response) => {
  store.dispatch({type:"changeLoding",data:false});
  return response;
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
);

