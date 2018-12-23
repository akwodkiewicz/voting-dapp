import React, { Component } from "react";
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
        <div>
          <h1>Operation cancelled!</h1>
          <p>You did not submit your contract. Press the button below to fill the form again.</p>
          <button onClick={this.props.onClick}>Return</button>
        </div>
      );
    }
  }
}
