import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import HomePage from './home/HomePage';
import AboutPage from './about/AboutPage';
import Header from './common/Header';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">  
          <header className="App-header">
            <h1>Header name :D</h1>
            <Header />
          </header>      
          <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
          </div>          
        </div>  
      </Router>      
    );
  }
}

export default App;
