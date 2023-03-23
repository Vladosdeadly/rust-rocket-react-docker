import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from 'react-router-dom';
import Main from './main';


ReactDOM.render(
  <BrowserRouter> 
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('App')
);

reportWebVitals();

