import moment from "moment";
import React, { Component, Fragment } from "react";
import { Checkbox, Col, FormControl, Grid, HelpBlock, Row } from "react-bootstrap";
import { fetchResults } from "../../utils/eth";
import { BlockchainData, Category, ContractAddress, Voting } from "../../utils/types";
import ResultsModal from "../vote/ResultsModal";
import VoteModal from "../vote/VoteModal";
import CategoryDropdown from "./CategoryDropdown";
import PrivacyButtons, { PrivacySetting } from "./PrivacyButtons";
import VotingList, { VotingState } from "./VotingList";
interface IListVotingsPanelProps {
  blockchainData: BlockchainData;
  votingState: VotingState;
  title: string;
}

interface IListVotingsPanelState {
  categories: Category[];
  chosenCategoryIndex: number;
  votings: Voting[];
  chosenVotingAddress: ContractAddress;
  chosenPrivacySetting: PrivacySetting;
  chosenAnswer: number;
  displayInacessibleVotings: boolean;
  isDataRefreshRequested: boolean;
  results: string[];
  showResultsModal: boolean;
  showVoteModal: boolean;
}

export default class ListVotingsPanel extends Component<IListVotingsPanelProps, IListVotingsPanelState> {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      chosenAnswer: null,
      chosenCategoryIndex: null,
      chosenPrivacySetting: PrivacySetting.All,
      chosenVotingAddress: null,
      displayInacessibleVotings: false,
      isDataRefreshRequested: false,
      results: [],
      showResultsModal: false,
      showVoteModal: false,
      votings: [],
    };
  }

  public setCategories = (categoriesFromChild: Category[]) => {
    this.setState({ categories: categoriesFromChild });
  };

  public setPrivacySetting = (privacySettingFromChild: PrivacySetting) => {
    this.setState({ chosenPrivacySetting: privacySettingFromChild, chosenVotingAddress: null });
  };

  public setVotings = (votingsFromChild: Voting[]) => {
    this.setState({ votings: votingsFromChild });
  };

  public handleCategoryClick = (categoryIndexFromChild: number) => {
    this.setState({ chosenCategoryIndex: categoryIndexFromChild, chosenVotingAddress: null });
  };

  public handleVotingClick = async (votingAddressFromChild: ContractAddress) => {
    this.setState({ chosenVotingAddress: votingAddressFromChild });
    if (votingAddressFromChild != null) {
      const now = moment().utc().unix(); // prettier-ignore
      const voting = this.state.votings.find((v) => v.contract._address === votingAddressFromChild);
      if (now <= voting.info.votingEndTime) {
        this.setState({
          showResultsModal: false,
          showVoteModal: true,
        });
      } else if (now <= voting.info.resultsEndTime) {
        const results = await fetchResults(voting);
        this.setState({
          results,
          showResultsModal: true,
          showVoteModal: false,
        });
      }
    }
  };

  public handleAnswerClick = (answerIndexFromChild: number) => {
    this.setState({ chosenAnswer: answerIndexFromChild });
  };

  public dataRefreshed = () => {
    this.setState({ isDataRefreshRequested: false });
  };

  public votingTime = () => {
    return true;
  };

  public render() {
    return (
      <Grid fluid>
        <Row style={{ textAlign: "center" }}>
          <Col md={12}>
            <h3 style={{ fontSize: "2.5em" }}>{this.props.title}</h3>
          </Col>
        </Row>
        <Row style={{ marginTop: "5vh" }}>
          {/* https://github.com/react-bootstrap/react-bootstrap/issues/1928#issuecomment-331509515 */}
          <Col md={6}>
            <CategoryDropdown
              blockchainData={this.props.blockchainData}
              categories={this.state.categories}
              chosenCategoryIndex={this.state.chosenCategoryIndex}
              setCategoriesInParent={this.setCategories}
              setChosenCategoryInParent={this.handleCategoryClick}
            />
          </Col>
          <Col md={6}>
            <PrivacyButtons
              chosenPrivacySetting={this.state.chosenPrivacySetting}
              setchosenPrivacySettingInParent={this.setPrivacySetting}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <HelpBlock>Filter the results.</HelpBlock>
            <FormControl type="input" />
          </Col>
          <Col md={6}>
            <HelpBlock>Display inaccessible votings</HelpBlock>
            <Checkbox checked={this.state.displayInacessibleVotings} onChange={this.handleCheck} />
          </Col>
        </Row>
        <Row style={{ marginTop: "3vh" }}>
          <Col md={12}>
            {this.state.chosenCategoryIndex != null && (
              <VotingList
                category={this.state.categories[this.state.chosenCategoryIndex]}
                votings={this.state.votings}
                chosenVotingAddress={this.state.chosenVotingAddress}
                setVotingsInParent={this.setVotings}
                setChosenVotingAddressInParent={this.handleVotingClick}
                blockchainData={this.props.blockchainData}
                privacySetting={this.state.chosenPrivacySetting}
                votingState={this.props.votingState}
                dataRefreshRequestHandled={this.dataRefreshed}
                isDataRefreshRequested={this.state.isDataRefreshRequested}
                displayInaccessibleVotings={this.state.displayInacessibleVotings}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {this.state.chosenVotingAddress != null && (
              <Fragment>
                <VoteModal
                  voting={this.state.votings.find(
                    (voting) => voting.contract._address === this.state.chosenVotingAddress
                  )}
                  blockchainData={this.props.blockchainData}
                  chosenAnswer={this.state.chosenAnswer}
                  setChosenAnswerInParent={this.handleAnswerClick}
                  requestDataRefresh={() => this.setState({ isDataRefreshRequested: true })}
                  show={this.state.showVoteModal}
                  handleOnHide={() => this.setState({ showVoteModal: false })}
                />
                <ResultsModal
                  handleOnHide={() => this.setState({ showResultsModal: false })}
                  voting={this.state.votings.find(
                    (voting) => voting.contract._address === this.state.chosenVotingAddress
                  )}
                  results={this.state.results}
                  show={this.state.showResultsModal}
                />
              </Fragment>
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
  private handleCheck = () => {
    this.setState({
      displayInacessibleVotings: !this.state.displayInacessibleVotings,
    });
  };
}
