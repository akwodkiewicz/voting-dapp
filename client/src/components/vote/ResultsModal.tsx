import React, { Component, Fragment } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { submitVote } from "../../utils/eth";
import { BlockchainData, Voting } from "../../utils/types";

interface IResultsModalProps {
  show: boolean;
}

interface IResultsModalState {
  show: boolean;
}

export default class ResultsModal extends Component<IResultsModalProps, IResultsModalState> {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  public render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>One fine body...</Modal.Body>

        <Modal.Footer>
          <Button>Close</Button>
          <Button bsStyle="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
