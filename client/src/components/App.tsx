import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Web3 from "web3";
import ManagerAbi from "../contracts/ManagerContract.json";
import * as ManagerContractConfig from "../managerContract.config.json";
import { ManagerContract } from "../typed-contracts/ManagerContract";
import { BlockchainData } from "../utils/types.js";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import CreateVotePage from "./createVote/CreateVotePage";
import HomePage from "./home/HomePage";
import ListVotingsPage from "./listvotings/ListVotingsPage";

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
      const instance = new web3.eth.Contract(ManagerAbi.abi, ManagerContractConfig.address) as ManagerContract;
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
  public lol = () => {
    this.forceUpdate();
  };
  public render() {
    if (this.state.noMetamask) {
      return (
        <div>
          <Header block={3} />
          <div>
            <Route
              exact
              path="/"
              render={
                () => (
                  <div style={{ width: "100vw", height: "100vh" }}>
                    <h1
                      style={{
                        fontFamily: "Roboto",
                        fontSize: "4em",
                        textAlign: "center",
                        marginBottom: "5vh",
                        marginTop: "5vh",
                      }}
                    >
                      No MetaMask detected
                    </h1>
                    <img
                      style={{
                        display: "block",
                        height: "auto", // 2nd option: 50%
                        marginBottom: "5vh",
                        marginLeft: "auto",
                        marginRight: "auto",
                        maxHeight: "50%", // 2nd option: remove
                        maxWidth: "50%", // 2nd option: remove
                        width: "auto", // 2nd option: auto
                      }}
                      src={require("../images/no-metamask.png")}
                    />
                    <p style={{ fontSize: "2em", fontFamily: "Roboto", textAlign: "center" }}>
                      This application needs MetaMask browser extension to work properly
                    </p>
                    <p style={{ fontSize: "2em", fontFamily: "Roboto", textAlign: "center" }}>
                      <a href="https://metamask.io/">Install it now</a>, create your first wallet and come back later.
                    </p>
                  </div>
                ) /*<HomePage blockchainData={this.state.blockchainData} displayHome={false} />*/
              }
            />
            <Route exact path="/about" component={AboutPage} />

            <Redirect path="*" to="/" />
          </div>
        </div>
      );
    }
    if (this.state.waitingForAccess) {
      return (
        <div>
          <Header block={3} />
          <div>
            <h1>Waiting for access...</h1>
            <Redirect path="*" to="/" />
          </div>
        </div>
      );
    } else if (!this.state.blockchainData) {
      return (
        <Router>
          <div style={{ width: "100vw", height: "100vh" }}>
            <Header block={3} />
            <div>
              <h1
                style={{
                  fontFamily: "Roboto",
                  fontSize: "4em",
                  marginBottom: "5vh",
                  marginTop: "5vh",
                  textAlign: "center",
                }}
              >
                Access request rejected
              </h1>
              <img
                style={{
                  display: "block",
                  height: "auto", // 2nd option: 50%
                  marginBottom: "5vh",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxHeight: "50%", // 2nd option: remove
                  maxWidth: "50%", // 2nd option: remove
                  width: "auto", // 2nd option: auto
                }}
                src={require("../images/no-acceptance.png")}
              />
              <p style={{ fontSize: "2em", fontFamily: "Roboto", textAlign: "center" }}>
                This decentralized application needs access to your Metamask data.
              </p>
              <p style={{ fontSize: "2em", fontFamily: "Roboto", textAlign: "center" }}>
                Refresh page and grant access when the Metamask pop-up window appears.
              </p>
            </div>
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div>
            <Header block={0} />
            <div>
              <Route
                exact
                path="/"
                render={() => <HomePage blockchainData={this.state.blockchainData} displayHome={true} />}
              />
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
