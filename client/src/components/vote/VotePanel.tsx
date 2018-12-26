import React, { Component, Fragment } from "react";
import { Button, Col, Panel, Row } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { submitVote } from "../../utils/eth";
import { BlockchainData, Voting } from "../../utils/types";

interface IVotePanelProps {
  blockchainData: BlockchainData;
  chosenAnswer: number;
  voting: Voting;
  setChosenAnswerInParent: (arg: number) => void;
  requestDataRefresh: () => void;
}

interface IVotePanelState {
  isWaitingForTxResponse: boolean;
}

export default class VotePanel extends Component<IVotePanelProps, IVotePanelState> {
  constructor(props) {
    super(props);
    this.state = {
      isWaitingForTxResponse: false,
    };
  }

  public render() {
    if (this.state.isWaitingForTxResponse) {
      return (
        <Panel>
          <Panel.Heading>Vote</Panel.Heading>
          <Panel.Body>
            <Row className="text-center" style={{ marginTop: "-1em" }}>
              <Col lg={12}>
                <h3>Please wait</h3>
              </Col>
            </Row>
            <Row className="text-center">
              <Col lg={12}>
                <Loader type="Grid" color="#00BFFF" height="10%" width="10%" />
              </Col>
            </Row>
            <Row className="text-center">
              <Col lg={12}>
                <h4>Your transaction is being processed</h4>
              </Col>
            </Row>
          </Panel.Body>
        </Panel>
      );
    } else {
      return (
        <Panel>
          <Panel.Heading>Vote</Panel.Heading>
          <Panel.Body>
            <Fragment>
              {this.props.voting.info.answers.map((answer, index) => {
                return (
                  <Row>
                    <Col lg={9}>
                      <h4>{answer}</h4>
                    </Col>
                    <Col lg={3}>
                      <Button
                        value={index}
                        onClick={() => this.handleAnswerClick(index)}
                        {...((this.props.voting.info.isPrivileged !== null && !this.props.voting.info.isPrivileged) ||
                        this.props.voting.info.hasUserVoted
                          ? { disabled: true }
                          : null)}
                        {...(this.props.chosenAnswer === index ? { active: true } : null)}
                      >
                        Pick answer #{index + 1}
                      </Button>
                    </Col>
                  </Row>
                );
              })}
              <Row>
                <Col lg={12} className="text-center">
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
            </Fragment>
          </Panel.Body>
        </Panel>
      );
    }
  }

  private handleAnswerClick = (chosenAnswer: number) => {
    this.props.setChosenAnswerInParent(chosenAnswer);
  };

  private handleSubmit = async () => {
    this.setState({ isWaitingForTxResponse: true });
    try {
      await submitVote(this.props.blockchainData, this.props.voting, this.props.chosenAnswer);
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ isWaitingForTxResponse: false });
    }
    this.props.requestDataRefresh();
  };
}
