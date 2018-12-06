import React, { Component } from "react";
import {ControlLabel, FormControl, FormGroup, Grid, Row, Col, ListGroupItem, ListGroup, Button }from 'react-bootstrap';

class AnswersList extends Component {
  constructor(props) {
    super(props);

    this.deleteListItem = this.deleteListItem.bind(this);
    this.getAnswersHandler = this.getAnswersHandler.bind(this);
  }

  deleteListItem(e) {
    let allAnswers = this.props.answers;
    let index = allAnswers.indexOf(e.target.innerText);
    if(index > -1) {
      allAnswers.splice(index, 1);
    }
    this.getAnswersHandler(allAnswers);
  }

  getAnswersHandler(answers) {
    this.props.getAnswers(answers);
  }

  render() {
    return (
      <ListGroup key={"answers"}>
      { 
        this.props.answers.map((answer) => (
          <ListGroupItem key={answer} onClick={this.deleteListItem} >{answer}</ListGroupItem>            
        ))
      }
      </ListGroup>                         
    );
  }
}

export default AnswersList;