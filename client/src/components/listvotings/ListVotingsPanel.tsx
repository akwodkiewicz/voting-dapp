import React, { Component, Fragment } from "react";
import { ButtonToolbar, Col, Row } from "react-bootstrap";

import { BlockchainData, Category, ContractAddress, Voting } from "../../utils/types";
import CategoryDropdown from "./CategoryDropdown";
import PrivacyButtons, { PrivacySetting } from "./PrivacyButtons";
import VotingInfoPanel from "./VotingInfoPanel";
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
}

export default class ListVotingsPanel extends Component<IListVotingsPanelProps, IListVotingsPanelState> {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      chosenCategoryIndex: null,
      chosenPrivacySetting: PrivacySetting.All,
      chosenVotingAddress: null,
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
            {this.state.chosenCategoryIndex != null ? (
              <VotingList
                category={this.state.categories[this.state.chosenCategoryIndex]}
                votings={this.state.votings}
                chosenVotingAddress={this.state.chosenVotingAddress}
                setVotingsInParent={this.setVotings}
                setChosenVotingAddressInParent={this.handleVotingClick}
                blockchainData={this.props.blockchainData}
                privacySetting={this.state.chosenPrivacySetting}
                votingState={this.props.votingState}
              />
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {this.state.chosenVotingAddress != null ? (
              <VotingInfoPanel
                voting={this.state.votings.find(
                  (voting) => voting.contract._address === this.state.chosenVotingAddress
                )}
                blockchainData={this.props.blockchainData}
              />
            ) : null}
          </Col>
        </Row>
      </Fragment>
    );
  }
}
