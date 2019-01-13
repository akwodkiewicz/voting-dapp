import React, { Component } from "react";
import { Modal, Panel } from "react-bootstrap";

interface INotFoundModalProps {
  show: boolean;
  handleOnHide: () => void;
}

export default class NotFoundModal extends Component<INotFoundModalProps> {
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
              <p>You might have done a spelling error in the provided address.</p>
              <h4>Voting has expired</h4>
              <p>
                Every voting has an expiration date. When it passes, it is impossible to check the results of the voting
                via our application. However, because transactions on the blockchain are permanent, you can still
                examine the voting contract's state using Etherscan:
                <ul>
                  <li>
                    <a href="https://etherscan.io/">Mainnet (Official Ethereum Network)</a>
                  </li>
                  <li>
                    <a href="https://ropsten.etherscan.io/">Ropsten (Test Network)</a>
                  </li>
                  <li>
                    <a href="https://kovan.etherscan.io/">Kovan (Test Network)</a>
                  </li>
                  <li>
                    <a href="https://rinkeby.etherscan.io/">Rinkeby (Test Network)</a>
                  </li>
                </ul>
              </p>
            </Panel.Body>
          </Panel>
        </Modal.Body>
      </Modal>
    );
  }
}
