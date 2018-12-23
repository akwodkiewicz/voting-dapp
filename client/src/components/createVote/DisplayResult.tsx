import { Component } from "react";
import { ResultStatus } from "./CreateVotePage";

interface IDisplayResultProps {
  status: ResultStatus;
  onClick: () => void;
}

class DisplayResult extends Component<IDisplayResultProps> {
  public render() {
    if (this.props.status === ResultStatus.Success) {
      return <h1>Congrats m8</h1>;
    } else if (this.props.status === ResultStatus.Failure) {
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

export default DisplayResult;
