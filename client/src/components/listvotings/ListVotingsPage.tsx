import React, { Component } from "react";
import { Col, Grid, ListGroup, ListGroupItem, Row } from "react-bootstrap";

import { BlockchainData, Category } from "../common/types";
import CategoryList from "./CategoryList";

const votings = [
  ["Is this question rendering properly?", "How about this one?"],
  ["These questions are totally different!", "See?", "I guess it's technically not even a question?"],
];

interface IListVotingsPageProps {
  blockchainData: BlockchainData;
}

interface IListVotingsPageState {
  categories: Category[];
  chosenCategoryIndex: number;
  chosenVoting: string;
}

export default class ListVotingsPage extends Component<IListVotingsPageProps, IListVotingsPageState> {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      chosenCategoryIndex: null,
      chosenVoting: null,
    };
  }

  public setCategories = (categoriesFromChild) => {
    this.setState({ categories: categoriesFromChild });
  };

  public handleCategoryClick = (categoryIndexFromChild) => {
    this.setState({ chosenCategoryIndex: categoryIndexFromChild });
  };

  public handleVotingClick = (event) => {
    console.log(event.target.innerText);
    this.setState({
      chosenVoting: event.target.innerText,
    });
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

          {this.state.chosenCategoryIndex != null ? (
            <Col sm={5}>
              <h2>Votings inside {this.state.categories[this.state.chosenCategoryIndex].name}</h2>
              {votings[this.state.chosenCategoryIndex].length > 0 ? (
                <ListGroup>
                  {votings[this.state.chosenCategoryIndex].map((name) => {
                    return <ListGroupItem onClick={this.handleVotingClick}>{name}</ListGroupItem>;
                  })}
                </ListGroup>
              ) : (
                <h4>No votings in this category... Weird, huh?</h4>
              )}
            </Col>
          ) : null}

          {this.state.chosenVoting ? (
            <Col sm={4}>
              <h3>{this.state.chosenVoting}</h3>
            </Col>
          ) : null}
        </Row>
      </Grid>
    );
  }
}
