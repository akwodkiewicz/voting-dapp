import React, { Component } from "react";
import { Button, Col, Panel, Row } from "react-bootstrap";
import { submitVote } from "../../utils/eth";
import { BlockchainData, Voting } from "../../utils/types";

interface IVotePanelProps {
  blockchainData: BlockchainData;
  chosenAnswer: number;
  voting: Voting;
  setChosenAnswerInParent: (arg: number) => void;
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
    return (
      <Panel>
        <Panel.Heading>Vote</Panel.Heading>
        <Panel.Body className="clearfix">
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
                    {...(this.props.chosenAnswer === index ? { active: true } : null)}
                  >
                    Pick answer #{index + 1}
                  </Button>
                </Col>
              </Row>
            );
          })}
          <Row>
            <Col lgOffset={4}>
              {this.state.isWaitingForTxResponse ? (
                <Button disabled onClick={this.handleSubmit}>
                  Submitting...
                </Button>
              ) : (
                <Button onClick={this.handleSubmit}>Submit your vote!</Button>
              )}
            </Col>
          </Row>
        </Panel.Body>
      </Panel>
    );
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
  };
}
