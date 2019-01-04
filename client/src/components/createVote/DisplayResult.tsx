import React, { Component } from "react";
import { Alert, Button } from "react-bootstrap";
import { ResultStatus } from "./CreateVotePage";

interface IDisplayResultProps {
  status: ResultStatus;
  onClick: () => void;
}

export default class DisplayResult extends Component<IDisplayResultProps> {
  public render() {
    if (this.props.status === ResultStatus.Success) {
      return <h1>Congrats m8</h1>;
    } else {
      return (
        <Alert bsStyle="danger">
          <h4>Oh snap! You got an error!</h4>
          <p>You did not submit your contract. Press the button below to fill the form again.</p>
          <p>
            <Button onClick={this.props.onClick}>Return to form</Button>
          </p>
        </Alert>
      );
    }
  }
}
