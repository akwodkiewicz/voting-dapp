import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Web3 from "web3";
import * as AppConfig from "../config.json";
import ManagerAbi from "../contracts/ManagerContract.json";
import { ManagerContract } from "../typed-contracts/ManagerContract";
import { BlockchainData } from "../utils/types.js";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import CreateVotePage from "./createVote/CreateVotePage";
import HomePage from "./home/HomePage";
import NoAccessPage from "./home/NoAccessPage";
import ListVotingsPage from "./listvotings/ListVotingsPage";

interface IAppState {
  blockchainData: BlockchainData;
  noMetamask: boolean;
  waitingForAccess: boolean;
  wrongNetwork: boolean;
  connectedNetworkType: string;
}

export default class App extends Component<any, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      blockchainData: null,
      connectedNetworkType: "",
      noMetamask: false,
      waitingForAccess: true,
      wrongNetwork: false,
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
    let wrongNetwork = false;
    let networkType = "";
    try {
      const accounts = await window["ethereum"].enable();
      const web3 = new Web3(window["ethereum"]);
      networkType = await (web3.eth.net as any).getNetworkType();
      if (networkType !== AppConfig.network) {
        wrongNetwork = true;
        throw new Error("Metamask is connected to other network than the one defined in application");
      }
      const instance = new web3.eth.Contract(ManagerAbi.abi, AppConfig.managerContractAddress) as ManagerContract;
      instance.setProvider(web3.currentProvider);
      instance.options.from = accounts[0];
      this.setState({
        blockchainData: { manager: instance, accounts, web3 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({
        connectedNetworkType: networkType,
        waitingForAccess: false,
        wrongNetwork,
      });
    }
  };
  // tslint:enable:no-string-literal
  public lol = () => {
    this.forceUpdate();
  };
  public render() {
    if (this.state.noMetamask) {
      const title = "No MetaMask detected";
      const firstParagraph = "This application needs MetaMask browser extension to work properly.";
      const secondParagraph = (
        <span>
          <a href="https://metamask.io/">Install it now</a> create your first wallet and come back later.
        </span>
      );
      return (
        <div>
          <Header block={3} />
          <NoAccessPage title={title} firstParagraph={firstParagraph} secondParagraph={secondParagraph} imgChoice={1} />
        </div>
      );
    }
    if (this.state.waitingForAccess) {
      return (
        <div>
          <Header block={4} />
          <Grid>
            <Row className="text-center">
              <div
                style={{
                  marginTop: "10vh",
                }}
              >
                <Loader style={{ marginTop: "20vh" }} type="Grid" color="#00BFFF" height="30%" width="30%" />
              </div>
            </Row>
            <Row className="text-center">
              <Col sm={12}>
                <h1
                  style={{
                    fontFamily: "Roboto",
                    marginBottom: "5vh",
                    marginTop: "5vh",
                    textAlign: "center",
                  }}
                >
                  Waiting for access
                </h1>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else if (!this.state.blockchainData && this.state.wrongNetwork) {
      const title = "Wrong network";
      const firstParagraph =
        "This distributed application is defined to work with '" +
        AppConfig.network +
        "' network. You are currently connected to '" +
        this.state.connectedNetworkType +
        "'";
      const secondParagraph = "Change the network you are connecting to in your Metamask extension.";
      return (
        <div>
          <Header block={3} />
          <NoAccessPage title={title} firstParagraph={firstParagraph} secondParagraph={secondParagraph} imgChoice={1} />
        </div>
      );
    } else if (!this.state.blockchainData) {
      const title = "Access request rejected";
      const firstParagraph = "This distributed application needs access to your Metamask data.";
      const secondParagraph = "Refresh page and grant access when the Metamask pop-up window appears.";
      return (
        <div>
          <Header block={3} />
          <NoAccessPage title={title} firstParagraph={firstParagraph} secondParagraph={secondParagraph} imgChoice={2} />
        </div>
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
