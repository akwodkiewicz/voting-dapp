import moment from "moment";
import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import { BlockchainData, Voting } from "../../utils/types";

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
        <h3>{this.props.voting.info.question}</h3>
        <h4>Options:</h4>
        <ul>
          {this.props.voting.info.answers.map((ans) => {
            return <li key={ans}>{ans}</li>;
          })}
        </ul>
        <h4>Vote ending on: {moment(this.props.voting.info.votingEndTime, "X").toLocaleString()}</h4>
        <h4>Disabled on: {moment(this.props.voting.info.resultsEndTime, "X").toLocaleString()}</h4>
        <h4>{this.props.voting.info.isPrivate ? "Private" : "Public"}</h4>
      </Panel>
    );
  }
}
