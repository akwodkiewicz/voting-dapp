import React, { Component, Fragment } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { BlockchainData, Voting } from "../../utils/types";

interface IResultsModalProps {
  blockchainData: BlockchainData;
  voting: Voting;
  show: boolean;
  requestDataRefresh: () => void;
  handleOnHide: () => void;
}

interface IResultsModalState {
  isWaitingForTxResponse: boolean;
  show: boolean;
}

export default class ResultsModal extends Component<IResultsModalProps, IResultsModalState> {
  constructor(props) {
    super(props);
    this.state = {
      isWaitingForTxResponse: false,
      show: false,
    };
  }

  public render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleOnHide}>
        <Modal.Header className="text-center" {...(this.state.isWaitingForTxResponse ? null : { closeButton: true })}>
          <Modal.Title>{this.props.voting.info.question}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.isWaitingForTxResponse ? (
            <Fragment>
              <Row className="text-center" style={{ marginTop: "-1em" }}>
                <Col sm={12}>
                  <h3>Please wait</h3>
                </Col>
              </Row>
              <Row className="text-center">
                <Col sm={12}>
                  <Loader type="Grid" color="#00BFFF" height="10%" width="10%" />
                </Col>
              </Row>
              <Row className="text-center">
                <Col sm={12}>
                  <h4>Your transaction is being processed</h4>
                </Col>
              </Row>
            </Fragment>
          ) : (
            <Fragment>
              {this.props.voting.info.answers.map((answer, index) => {
                return (
                  <Row>
                    <Col sm={10} style={{ paddingLeft: "60px" }}>
                      <h4>{answer}</h4>
                    </Col>
                    <Col sm={2} style={{ paddingRight: "30px" }}>
                      <Button className="pull-right" value={index}>
                        Pick answer #{index + 1}
                      </Button>
                    </Col>
                  </Row>
                );
              })}
            </Fragment>
          )}
        </Modal.Body>
        {this.state.isWaitingForTxResponse ? null : (
          <Modal.Footer>
            <Row>
              <Col sm={12} className="text-center">
                {this.props.voting.info.hasUserVoted ? (
                  <h4>You have already voted!</h4>
                ) : (
                  <Button
                    bsStyle="primary"
                    {...(this.props.voting.info.isPrivileged !== null && !this.props.voting.info.isPrivileged
                      ? { disabled: true }
                      : null)}
                    onClick={this.handleSubmit}
                  >
                    Submit your vote!
                  </Button>
                )}
              </Col>
            </Row>
          </Modal.Footer>
        )}
      </Modal>
    );
  }

  private handleSubmit = async () => {
    this.setState({ isWaitingForTxResponse: true });

    this.props.requestDataRefresh();
  };
}
