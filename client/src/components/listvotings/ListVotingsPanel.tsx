import moment from "moment";
import React, { Component, Fragment } from "react";
import { ButtonToolbar, Col, Row } from "react-bootstrap";

import { BlockchainData, Category, ContractAddress, Voting } from "../../utils/types";
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
  isDataRefreshRequested: boolean;
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
      isDataRefreshRequested: false,
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

  public handleVotingClick = (votingAddressFromChild: ContractAddress) => {
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
        this.setState({
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
      <Fragment>
        <Row className="text-center">
          <h3>{this.props.title}</h3>
        </Row>
        <Row>
          {/* https://github.com/react-bootstrap/react-bootstrap/issues/1928#issuecomment-331509515 */}
          <ButtonToolbar style={{ display: "flex", justifyContent: "center" }}>
            <CategoryDropdown
              blockchainData={this.props.blockchainData}
              categories={this.state.categories}
              chosenCategoryIndex={this.state.chosenCategoryIndex}
              setCategoriesInParent={this.setCategories}
              setChosenCategoryInParent={this.handleCategoryClick}
            />
            <PrivacyButtons
              chosenPrivacySetting={this.state.chosenPrivacySetting}
              setchosenPrivacySettingInParent={this.setPrivacySetting}
            />
          </ButtonToolbar>
        </Row>
        <Row>
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
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {this.state.chosenVotingAddress != null && this.state.showVoteModal && (
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
            )}
          </Col>
          <Col md={12}>
            {this.state.chosenVotingAddress != null && this.state.showResultsModal && (
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
            )}
          </Col>
        </Row>
      </Fragment>
    );
  }
}
