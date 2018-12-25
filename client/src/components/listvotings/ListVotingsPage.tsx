import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";

import { BlockchainData, Category, Voting } from "../common/types";
import CategoryDropdown from "./CategoryDropdown";
import ListVotingsPanel from "./ListVotingsPanel";
import PrivacyButtons, { PrivacySetting } from "./PrivacyButtons";
import VotingInfoPanel from "./VotingInfoPanel";
import VotingList from "./VotingList";

interface IListVotingsPageProps {
  blockchainData: BlockchainData;
}

interface IListVotingsPageState {
  categories: Category[];
  chosenCategoryIndex: number;
  votings: Voting[];
  chosenVotingIndex: number;
  chosenPrivacySetting: PrivacySetting;
}

export default class ListVotingsPage extends Component<IListVotingsPageProps, IListVotingsPageState> {
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
      <Grid>
        <Row>
          <Col md={6} className="text-center">
            <h3>Active Votings</h3>
          </Col>
          <Col md={6} className="text-center">
            <h3>Finished Votings</h3>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <ListVotingsPanel blockchainData={this.props.blockchainData} />
          </Col>
          <Col md={6}>
            <ListVotingsPanel blockchainData={this.props.blockchainData} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
