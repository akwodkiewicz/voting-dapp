import React, { Component } from "react";
import { ListGroupItem, ListGroup } from "react-bootstrap";

class AnswersList extends Component {
  constructor(props) {
    super(props);
  }

  deleteListItem = (e) => {
    const allAnswers = this.props.answers;
    const index = allAnswers.indexOf(e.target.innerText);
    if (index > -1) {
      allAnswers.splice(index, 1);
    }
    this.setAnswersHandler(allAnswers);
  };

  setAnswersHandler = (answers) => {
    this.props.setAnswers(answers);
  };

  render() {
    return (
      <ListGroup key={"answers"}>
        {this.props.answers.map((answer) => (
          <ListGroupItem key={answer} onClick={this.deleteListItem}>
            {answer}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

export default AnswersList;
