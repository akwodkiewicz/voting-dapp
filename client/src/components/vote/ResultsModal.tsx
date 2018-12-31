import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { Voting, VotingInfo } from "../../utils/types";

interface IResultsModalProps {
  results: string[];
  show: boolean;
  voting: Voting;
}

interface IResultsModalState {
  show: boolean;
  votingInfo: VotingInfo;
}

export default class ResultsModal extends Component<IResultsModalProps, IResultsModalState> {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      votingInfo: this.props.voting.info,
    };
  }

  public render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>{this.state.votingInfo.question}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{this.props.results}</Modal.Body>

        <Modal.Footer>
          <Button>Close</Button>
          <Button bsStyle="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
