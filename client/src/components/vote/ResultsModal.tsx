import React, { Component } from "react";
import { ControlLabel, Modal, Panel } from "react-bootstrap";
import { Voting } from "../../utils/types";
import ResultsPieChart from "./ResultsPieChart";

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
          <Modal.Title className="text-center">{this.props.voting.info.question}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h3">Voting info</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <ControlLabel>Question:</ControlLabel>
              <p>{this.props.voting.info.question}</p>
              <ControlLabel>Possible answers</ControlLabel>
              <ul>
                {this.props.voting.info.answers.map((answer) => {
                  return <li>{answer}</li>;
                })}
              </ul>
            </Panel.Body>
          </Panel>

          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h3">Voting results</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              {this.props.results.every((val) => parseInt(val, 10) === 0) ? (
                <h3 className="text-center">No one has voted!</h3>
              ) : (
                <ResultsPieChart results={this.props.results} voting={this.props.voting} />
              )}
            </Panel.Body>
          </Panel>
        </Modal.Body>
      </Modal>
    );
  }
}
