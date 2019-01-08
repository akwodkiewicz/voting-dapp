import moment from "moment";
import React, { Component } from "react";
import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  Grid,
  HelpBlock,
  InputGroup,
  Row,
} from "react-bootstrap";
import { fetchResults, fetchVoting } from "../../utils/eth";
import { BlockchainData, Voting } from "../../utils/types";
import NotFoundModal from "../vote/NotFoundModal";
import ResultsModal from "../vote/ResultsModal";
import VoteModal from "../vote/VoteModal";

interface IHomePageProps {
  blockchainData: BlockchainData;
  displayHome: boolean;
}

interface IHomePageState {
  chosenAnswer: number;
  disableSearch: boolean;
  isDataRefreshRequested: boolean;
  searchActionCalled: boolean;
  searchBoxText: string;
  showNotFoundModal: boolean;
  showResultsModal: boolean;
  showVoteModal: boolean;
  voting: Voting;
  votingResults: string[];
}

export default class HomePage extends Component<IHomePageProps, IHomePageState> {
  constructor(props) {
    super(props);
    this.state = {
      chosenAnswer: null,
      disableSearch: false,
      isDataRefreshRequested: false,
      searchActionCalled: false,
      searchBoxText: "",
      showNotFoundModal: false,
      showResultsModal: false,
      showVoteModal: false,
      voting: null,
      votingResults: null,
    };
  }

  public searchVoting = async () => {
    if (this.getValidationState() !== "success") {
      return;
    }

    const address = (document.getElementById("address") as HTMLInputElement).value;
    const fetchedVoting = await fetchVoting(this.props.blockchainData, address);

    this.setState({
      searchActionCalled: true,
      voting: fetchedVoting,
    });

    if (fetchedVoting != null) {
      const now = moment().utc().unix(); // prettier-ignore
      if (now <= fetchedVoting.info.votingEndTime) {
        this.setState({
          showNotFoundModal: false,
          showResultsModal: false,
          showVoteModal: true,
        });
      } else if (now <= fetchedVoting.info.resultsEndTime) {
        const results = await fetchResults(this.state.voting);
        this.setState({
          showNotFoundModal: false,
          showResultsModal: true,
          showVoteModal: false,
          votingResults: results,
        });
      }
    } else {
      this.setState({
        showNotFoundModal: true,
        showResultsModal: false,
        showVoteModal: false,
      });
    }
  };

  public handleAnswerClick = (answerIndexFromChild: number) => {
    this.setState({ chosenAnswer: answerIndexFromChild });
  };

  public getValidationState = () => {
    const searchText = this.state.searchBoxText;
    if (searchText !== "") {
      return this.props.blockchainData.web3.utils.isAddress(searchText) ? "success" : "error";
    }
    return null;
  };

  public handleSearchBoxChange = (e) => {
    this.setState({
      searchBoxText: e.target.value,
    });
  };

  public render() {
    let modal;
    if (this.state.voting != null) {
      if (this.state.showVoteModal) {
        modal = (
          <VoteModal
            voting={this.state.voting}
            blockchainData={this.props.blockchainData}
            requestDataRefresh={this.searchVoting}
            show={this.state.showVoteModal}
            handleOnHide={() => this.setState({ showVoteModal: false })}
            chosenAnswer={this.state.chosenAnswer}
            setChosenAnswerInParent={this.handleAnswerClick}
          />
        );
      } else if (this.state.showResultsModal) {
        modal = (
          <ResultsModal
            show={this.state.showResultsModal}
            handleOnHide={() => this.setState({ showResultsModal: false })}
            voting={this.state.voting}
            results={this.state.votingResults}
          />
        );
      }
    } else if (this.state.searchActionCalled) {
      modal = (
        <NotFoundModal
          show={this.state.showNotFoundModal}
          handleOnHide={() => this.setState({ showNotFoundModal: false })}
        />
      );
    }

    return this.props.displayHome ? (
      <Grid>
        <Row>
          <div style={{ marginBottom: "8em" }}>
            <h1 style={{ fontSize: "5em", fontFamily: "Roboto", textAlign: "center", marginTop: "1em" }}>
              Distributed Voting Platform
            </h1>
            <h3 style={{ fontFamily: "Roboto", textAlign: "center" }}>
              Fully anonymous and transparent voting platform powered by Ethereum blockchain.
            </h3>
          </div>
        </Row>
        <Row />
        <Row>
          <Col md={12}>
            <FormGroup bsSize="large" controlId="address" validationState={this.getValidationState()}>
              <ControlLabel style={{ fontSize: "2em" }}>Search for the voting</ControlLabel>
              <HelpBlock>
                Enter a valid keccak256 Ethereum address. Use all upper- or lowercase characters to ignore{" "}
                <a href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md">checksum validation</a>.
              </HelpBlock>
              <InputGroup>
                <FormGroup bsSize="large" controlId="address" validationState={this.getValidationState()}>
                  <FormControl type="text" value={this.state.searchBoxText} onChange={this.handleSearchBoxChange} />
                  <FormControl.Feedback />
                </FormGroup>
                <InputGroup.Button>
                  <Button bsSize="large" onClick={this.searchVoting}>
                    <Glyphicon glyph="search" />
                  </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>{modal}</Col>
        </Row>
      </Grid>
    ) : (
      <h1>xd</h1>
    );
  }
}
