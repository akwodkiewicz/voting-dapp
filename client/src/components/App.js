import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Web3 from "web3";

import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import CreateVotePage from "./createVote/CreateVotePage";
//import ListOfVotesPage from './listvotes/ListOfVotesPage';
import Header from "./common/Header";
import BlockchainData from "./common/BlockchainData";
import ManagerContract from "../build/contracts/ManagerContract.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /** @type {BlockchainData} */
      blockchainData: null,
      waitingForAccess: true,
      noMetamask: false,
    };
  }
  componentDidMount = async () => {
    if (!window.ethereum) {
      this.setState({
        noMetamask: true,
      });
      return;
    }

    try {
      const accounts = await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const instance = new web3.eth.Contract(ManagerContract.abi, "0x457D31982A783280F42e05e22493e47f8592358D");
      instance.setProvider(web3.currentProvider);
      instance.options.from = accounts[0];
      this.setState({
        blockchainData: new BlockchainData(instance, accounts, web3),
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({
        waitingForAccess: false,
      });
    }
  };

  render() {
    if (this.state.noMetamask) {
      return (
        <div>
          <div className="jumbotron">
            <h1>Decentralized voting platform</h1>
          </div>
          <div>
            <h1>No MetaMask detected</h1>
            <p>This application needs MetaMask browser extension to work properly</p>
            <p>
              <a href="https://metamask.io/">Install it now</a>, create your first wallet and come back later.
            </p>
          </div>
        </div>
      );
    }
    if (this.state.waitingForAccess) {
      return (
        <div>
          <div className="jumbotron">
            <h1>Decentralized voting platform</h1>
          </div>
          <div>
            <h1>Waiting for access...</h1>
          </div>
        </div>
      );
    } else if (!this.state.blockchainData) {
      return (
        <Router>
          <div>
            <div className="jumbotron">
              <h1>Decentralized voting platform</h1>
            </div>
            <div>
              <h1>Access request rejected</h1>
              <p>This decentralized application needs access to your Metamask data.</p>
              <p>Refresh page and grant access when the Metamask pop-up window appears.</p>
            </div>
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div>
            <div className="jumbotron">
              <h1>Decentralized voting platform</h1>
              <Header />
            </div>
            <div>
              <Route exact path="/" component={HomePage} />
              <Route path="/createvote" render={() => <CreateVotePage blockchainData={this.state.blockchainData} />} />
              {/* <Route path="/listvotes" component={ListOfVotesPage}/> */}
              <Route path="/about" component={AboutPage} />
            </div>
          </div>
        </Router>
      );
    }
  }
}

export default App;
