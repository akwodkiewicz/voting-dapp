import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import HomePage from './home/HomePage';
import AboutPage from './about/AboutPage';
import CreateVotePage from './createVote/CreateVotePage';
import Header from './common/Header';

class App extends Component {
  render() {
    return (
      <Router>
        <div>  
          <div  className="jumbotron">
            <h1>Decentralized voting platform</h1>
            <Header />
          </div>
            
          <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/createvote" component={CreateVotePage}/>
          </div>          
        </div>  
      </Router>      
    );
  }
}

export default App;
