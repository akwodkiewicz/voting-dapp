import React, { Component } from "react";
import { ListGroupItem, ListGroup, Row, Col, Grid } from "react-bootstrap";

const votings = [
  ["Is this question rendering properly?", "How about this one?"],
  ["These questions are totally different!", "See?", "I guess it's technically not even a question?"],
];

class ListVotingsPage extends Component {
  constructor() {
    super();
    this.state = {
      chosenCategory: null,
      chosenVoting: null,
      categories: [
        {
          name: "First",
          active: false,
        },
        {
          name: "Second",
          active: false,
        },
      ],
    };
  }

  handleCategoryClick = (event) => {
    const chosenCategory = event.target.innerText;
    let newCategoriesArray = [...this.state.categories];
    let chosenCategoryIndex;
    for (let i = 0; i < newCategoriesArray.length; i++) {
      if (newCategoriesArray[i].name === chosenCategory) {
        newCategoriesArray[i].active = true;
        chosenCategoryIndex = i;
      } else {
        newCategoriesArray[i].active = false;
      }
    }
    this.setState({
      chosenCategory: { name: event.target.innerText, index: chosenCategoryIndex },
      categories: newCategoriesArray,
    });
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
            <h2>Categories</h2>
            <ListGroup>
              {this.state.categories.map((cat, index) => {
                return (
                  <ListGroupItem onClick={this.handleCategoryClick} className={cat.active ? "active" : null}>
                    {cat.name}
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Col>

          {this.state.chosenCategory ? (
            <Col sm={5}>
              <h2>Votings inside {this.state.chosenCategory.name}</h2>
              <ListGroup>
                {votings[this.state.chosenCategory.index].map((name, index) => {
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
