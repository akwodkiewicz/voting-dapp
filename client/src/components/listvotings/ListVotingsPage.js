import React, { Component } from "react";
import { ListGroupItem, ListGroup, Row, Col, Grid } from "react-bootstrap";

import CategoryList from "./CategoryList";

const votings = [
  ["Is this question rendering properly?", "How about this one?"],
  ["These questions are totally different!", "See?", "I guess it's technically not even a question?"],
];

class ListVotingsPage extends Component {
  constructor() {
    super();
    this.state = {
      chosenCategoryIndex: null,
      chosenVoting: null,
      categories: [],
    };
  }

  setCategories = (categoriesFromChild) => {
    this.setState({ categories: categoriesFromChild });
  };

  handleCategoryClick = (categoryIndexFromChild) => {
    this.setState({ chosenCategoryIndex: categoryIndexFromChild });
  };

  handleVotingClick = (event) => {
    console.log(event.target.innerText);
    this.setState({
      chosenVoting: event.target.innerText,
    });
  };

  render() {
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

          {this.state.chosenCategory ? (
            <Col sm={5}>
              <h2>Votings inside {this.state.chosenCategory.name}</h2>
              <ListGroup>
                {votings[this.state.chosenCategoryIndex].map((name, index) => {
                  return <ListGroupItem onClick={this.handleVotingClick}>{name}</ListGroupItem>;
                })}
              </ListGroup>
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

export default ListVotingsPage;
