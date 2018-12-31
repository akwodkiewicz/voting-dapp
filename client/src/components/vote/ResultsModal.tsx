import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Voting } from "../../utils/types";

interface IResultsModalProps {
  results: string[];
  show: boolean;
  voting: Voting;
  handleOnHide: () => void;
}

export default class ResultsModal extends Component<IResultsModalProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleOnHide}>
        <Modal.Header>
          <Modal.Title>{this.props.voting.info.question}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{this.props.results}</Modal.Body>
      </Modal>
    );
  }
}
