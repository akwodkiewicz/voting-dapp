import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

interface IAnswersListProps {
  answers: string[];
  setAnswers: (arg: string[]) => void;
}

export default class AnswersList extends Component<IAnswersListProps> {
  constructor(props) {
    super(props);
  }

  public deleteListItem = (e: React.MouseEvent<ListGroupItem & HTMLInputElement>) => {
    const allAnswers = this.props.answers;
    const index = allAnswers.indexOf(e.currentTarget.innerText);
    if (index > -1) {
      allAnswers.splice(index, 1);
    }
    this.setAnswersHandler(allAnswers);
  };

  public setAnswersHandler = (answers) => {
    this.props.setAnswers(answers);
  };

  public render() {
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
