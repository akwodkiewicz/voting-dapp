import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

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
