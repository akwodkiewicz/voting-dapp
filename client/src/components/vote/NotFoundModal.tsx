import React, { Component } from "react";
import { Modal, Panel } from "react-bootstrap";

interface INotFoundModalProps {
  show: boolean;
  handleOnHide: () => void;
}

export default class NotFound extends Component<INotFoundModalProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleOnHide}>
        <Modal.Header>
          <Modal.Title className="text-center">Voting not found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h3">Possible reasons</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <h4>Invalid address</h4>
              <p>You might have done a spelling error in the address you provided. Please double check </p>
              <h4>Voting has expired</h4>
              <p>
                Every voting has an expiration date. When it passes, it is impossible to check the results of the voting
                via our application. On the other hand, you can check the voting via etherscan.
              </p>
            </Panel.Body>
          </Panel>
        </Modal.Body>
      </Modal>
    );
  }
}
