import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom'
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';

render((
    <BrowserRouter>
      <App />
    </BrowserRouter>
) ,document.getElementById('root')
);