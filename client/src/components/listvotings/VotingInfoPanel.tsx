import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import { BlockchainData, Voting, VotingInfo } from "../common/types";
interface IVotingInfoPanelProps {
  blockchainData: BlockchainData;
  voting: Voting;
}

export default class VotingInfoPanel extends Component<IVotingInfoPanelProps> {
  constructor(props) {
    super(props);
    this.state = {
      isVotingInfoDownloaded: false,
      votingInfo: null,
    };
  }

  public render() {
    return (
      <Panel>
        <h1>{this.props.voting.info.question}</h1>
        <h2>Options:</h2>
        <ul>
          {this.props.voting.info.answers.map((ans) => {
            return <li key={ans}>{ans}</li>;
          })}
        </ul>
        <h2>{this.props.voting.info.isPrivate ? "Private" : "Public"}</h2>
      </Panel>
    );
  }
}
