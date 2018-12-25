import React, { Component, Fragment } from "react";
import { ButtonToolbar, Col, Grid, Row } from "react-bootstrap";

import { BlockchainData, Category, Voting } from "../common/types";
import CategoryDropdown from "./CategoryDropdown";
import PrivacyButtons, { PrivacySetting } from "./PrivacyButtons";
import VotingInfoPanel from "./VotingInfoPanel";
import VotingList from "./VotingList";

interface IListVotingsPanelProps {
  blockchainData: BlockchainData;
}

interface IListVotingsPanelState {
  categories: Category[];
  chosenCategoryIndex: number;
  votings: Voting[];
  chosenVotingIndex: number;
  chosenPrivacySetting: PrivacySetting;
}

export default class ListVotingsPanel extends Component<IListVotingsPanelProps, IListVotingsPanelState> {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      chosenCategoryIndex: null,
      chosenPrivacySetting: PrivacySetting.All,
      chosenVotingIndex: null,
      votings: [],
    };
  }

  public setCategories = (categoriesFromChild: Category[]) => {
    this.setState({ categories: categoriesFromChild });
  };

  public setPrivacySetting = (privacySettingFromChild: PrivacySetting) => {
    this.setState({ chosenPrivacySetting: privacySettingFromChild });
  };

  public setVotings = (votingsFromChild: Voting[]) => {
    this.setState({ votings: votingsFromChild });
  };

  public handleCategoryClick = (categoryIndexFromChild: number) => {
    this.setState({ chosenCategoryIndex: categoryIndexFromChild, chosenVotingIndex: null });
  };

  public handleVotingClick = (votingIndexFromChild: number) => {
    this.setState({ chosenVotingIndex: votingIndexFromChild });
  };

  public render() {
    return (
      <Fragment>
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
                chosenVotingIndex={this.state.chosenVotingIndex}
                setVotingsInParent={this.setVotings}
                setChosenVotingIndexInParent={this.handleVotingClick}
                blockchainData={this.props.blockchainData}
                privacySetting={this.state.chosenPrivacySetting}
              />
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {this.state.chosenVotingIndex != null ? (
              <VotingInfoPanel
                voting={this.state.votings[this.state.chosenVotingIndex]}
                blockchainData={this.props.blockchainData}
              />
            ) : null}
          </Col>
        </Row>
      </Fragment>
    );
  }
}
