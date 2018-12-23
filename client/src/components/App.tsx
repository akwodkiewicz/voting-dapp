import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import * as ManagerContract from "../contracts/ManagerContract.json";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import { BlockchainData } from "./common/types";
import CreateVotePage from "./createVote/CreateVotePage";
import HomePage from "./home/HomePage";
import ListVotingsPage from "./listvotings/ListVotingsPage";
import Web3 from "web3"; //tslint:disable-line

interface IAppState {
  blockchainData: BlockchainData;
  noMetamask: boolean;
  waitingForAccess: boolean;
}

export default class App extends Component<any, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      blockchainData: null,
      noMetamask: false,
      waitingForAccess: true,
    };
  }
  // tslint:disable:no-string-literal
  public componentDidMount = async () => {
    if (!window["ethereum"]) {
      this.setState({
        noMetamask: true,
      });
      return;
    }

    try {
      const accounts = await window["ethereum"].enable();
      const web3 = new Web3(window["ethereum"]);
      const instance = new web3.eth.Contract(ManagerContract.abi, "0x457D31982A783280F42e05e22493e47f8592358D");
      instance.setProvider(web3.currentProvider);
      instance.options.from = accounts[0];
      this.setState({
        blockchainData: { manager: instance, accounts, web3 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({
        waitingForAccess: false,
      });
    }
  };
  // tslint:enable:no-string-literal

  public render() {
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
              <Route
                path="/listvotings"
                render={() => <ListVotingsPage blockchainData={this.state.blockchainData} />}
              />
              <Route path="/about" component={AboutPage} />
            </div>
          </div>
        </Router>
      );
    }
  }
}
