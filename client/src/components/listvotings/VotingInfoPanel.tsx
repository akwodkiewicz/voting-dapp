import React, { Component } from "react";
import { Panel } from "react-bootstrap";
import { downloadVotingInfo } from "../../utils/eth";
import { BlockchainData, Voting, VotingInfo } from "../common/types";
interface IVotingInfoPanelProps {
  blockchainData: BlockchainData;
  voting: Voting;
}

interface IVotingInfoPanelState {
  votingInfo: VotingInfo;
  isVotingInfoDownloaded: boolean;
}

export default class VotingInfoPanel extends Component<IVotingInfoPanelProps, IVotingInfoPanelState> {
  constructor(props) {
    super(props);
    this.state = {
      isVotingInfoDownloaded: false,
      votingInfo: null,
    };
  }

  public componentDidMount = async () => {
    this.setState({
      isVotingInfoDownloaded: true,
      votingInfo: await downloadVotingInfo(this.props.blockchainData, this.props.voting.contract),
    });
  };

  public componentDidUpdate = async (prevProps: IVotingInfoPanelProps) => {
    if (prevProps.voting !== this.props.voting) {
      this.setState({ isVotingInfoDownloaded: false });
    }
    if (!this.state.isVotingInfoDownloaded) {
      this.setState({
        isVotingInfoDownloaded: true,
        votingInfo: await downloadVotingInfo(this.props.blockchainData, this.props.voting.contract),
      });
    }
  };

  public render() {
    if (!this.state.isVotingInfoDownloaded) {
      return <h1>Fetching data from blockchain...</h1>;
    } else {
      return (
        <Panel>
          <h1>{this.state.votingInfo.question}</h1>
          <h2>Options:</h2>
          <ul>
            {this.state.votingInfo.answers.map((ans) => {
              return <li key={ans}>{ans}</li>;
            })}
          </ul>
          <h2>{this.state.votingInfo.isPrivate ? "Private" : "Public"}</h2>
        </Panel>
      );
    }
  }
}
