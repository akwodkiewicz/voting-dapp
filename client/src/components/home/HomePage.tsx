import moment from "moment";
import React, { Component } from "react";
import { Button, Col, ControlLabel, FormControl, Glyphicon, Grid, HelpBlock, InputGroup, Row } from "react-bootstrap";
import { fetchVoting } from "../../utils/eth";
import { BlockchainData, Voting } from "../../utils/types";
import VoteModal from "../vote/VoteModal";

interface IHomePageProps {
  blockchainData: BlockchainData;
}

interface IHomePageState {
  chosenAnswer: number;
  isDataRefreshRequested: boolean;
  searchActionCalled: boolean;
  showNotFoundModal: boolean;
  showResultsModal: boolean;
  showVoteModal: boolean;
  voting: Voting;
}

export default class HomePage extends Component<IHomePageProps, IHomePageState> {
  constructor(props) {
    super(props);
    this.state = {
      chosenAnswer: null,
      isDataRefreshRequested: false,
      searchActionCalled: false,
      showNotFoundModal: false,
      showResultsModal: false,
      showVoteModal: false,
      voting: null,
    };
  }

  public searchVoting = async () => {
    // TODO: simple address validation
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
        this.setState({
          showNotFoundModal: false,
          showResultsModal: true,
          showVoteModal: false,
        });
      } else {
        this.setState({
          showNotFoundModal: true,
          showResultsModal: false,
          showVoteModal: false,
        });
      }
    }
  };

  public handleAnswerClick = (answerIndexFromChild: number) => {
    this.setState({ chosenAnswer: answerIndexFromChild });
  };

  public render() {
    let modal;
    if (this.state.voting != null) {
      if (this.state.showVoteModal) {
        modal = (
          <VoteModal
            voting={this.state.voting}
            blockchainData={this.props.blockchainData}
            requestDataRefresh={() => this.setState({ isDataRefreshRequested: true })}
            show={this.state.showVoteModal}
            handleOnHide={() => this.setState({ showVoteModal: false })}
            chosenAnswer={this.state.chosenAnswer}
            setChosenAnswerInParent={this.handleAnswerClick}
          />
        );
      } else if (this.state.showResultsModal) {
        modal = <h1>Results modal soon</h1>;
      }
    } else if (this.state.searchActionCalled) {
      modal = <h1>There is no active voting under given address</h1>;
    }
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <ControlLabel>Search for the voting</ControlLabel>
            <HelpBlock>A valid address starts with '0x' and has 20 characters</HelpBlock>
            <InputGroup>
              <FormControl type="text" id="address" />
              <InputGroup.Button>
                <Button onClick={this.searchVoting}>
                  <Glyphicon glyph="search" />
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>{modal}</Col>
        </Row>
      </Grid>
    );
  }
}
//glyphicon glyphicon-search
