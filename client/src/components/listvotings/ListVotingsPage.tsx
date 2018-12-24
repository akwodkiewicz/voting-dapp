import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";

import { BlockchainData, Category, Voting } from "../common/types";
import CategoryList from "./CategoryList";
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
}

export default class ListVotingsPage extends Component<IListVotingsPageProps, IListVotingsPageState> {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      chosenCategoryIndex: null,
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
          <Col sm={3}>
            <CategoryList
              blockchainData={this.props.blockchainData}
              categories={this.state.categories}
              chosenCategoryIndex={this.state.chosenCategoryIndex}
              setCategoriesInParent={this.setCategories}
              setChosenCategoryInParent={this.handleCategoryClick}
            />
          </Col>

          <Col sm={5}>
            {this.state.chosenCategoryIndex != null ? (
              <VotingList
                category={this.state.categories[this.state.chosenCategoryIndex]}
                votings={this.state.votings}
                chosenVotingIndex={this.state.chosenVotingIndex}
                setVotingsInParent={this.setVotings}
                setChosenVotingIndexInParent={this.handleVotingClick}
                blockchainData={this.props.blockchainData}
              />
            ) : null}
          </Col>

          <Col sm={4}>
            {this.state.chosenVotingIndex != null ? (
              <VotingInfoPanel
                voting={this.state.votings[this.state.chosenVotingIndex]}
                blockchainData={this.props.blockchainData}
              />
            ) : null}
          </Col>
        </Row>
      </Grid>
    );
  }
}
