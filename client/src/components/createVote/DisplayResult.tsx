import React, { Component } from "react";
import { Alert, Button } from "react-bootstrap";
import { ResultStatus } from "../../utils/enums";
import { ContractAddress, VotingCreatedEventData } from "../../utils/types";

interface IDisplayResultProps {
  status: ResultStatus;
  softReset: () => void;
  hardReset: () => void;
  txHash: ContractAddress;
  votingCreatedEventData: VotingCreatedEventData;
}

export default class DisplayResult extends Component<IDisplayResultProps> {
  private ulStyle = { marginTop: "10px" };
  private liStyle = { margin: "5px 0px 8px -25px" };
  public render() {
    if (this.props.status === ResultStatus.Success) {
      return (
        <Alert bsStyle="success">
          <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Voting created</h1>
          <h4 style={{ textAlign: "center" }}>
            Share this address with your friends and let them know about your voting!
          </h4>

          <br />
          <h4 style={{ textAlign: "center" }}>
            <strong>{this.props.votingCreatedEventData ? this.props.votingCreatedEventData.votingAddress : ""}</strong>
          </h4>
          <br />
          <p>
            What's next? You can:
            <ul style={this.ulStyle}>
              <li style={this.liStyle}>
                lookup the transaction information on Etherscan using this TxHash: <strong>{this.props.txHash}</strong>
              </li>
              <li style={this.liStyle}>paste the voting address into the searchbar on homepage</li>
              <li style={this.liStyle}>
                see all the votings on <strong>List Votings</strong> subpage
              </li>
              <li style={this.liStyle}>
                <Button bsSize="small" onClick={this.props.hardReset}>
                  Create a new voting
                </Button>
              </li>
            </ul>
          </p>
        </Alert>
      );
    } else {
      return (
        <Alert bsStyle="danger">
          <h4>Oh snap! You got an error!</h4>
          <p>Your contract was not submitted. Press the button below to fill the form again.</p>
          <p>
            <Button onClick={this.props.softReset}>Return to form</Button>
          </p>
        </Alert>
      );
    }
  }
}
