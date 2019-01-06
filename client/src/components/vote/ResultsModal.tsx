import React, { Component } from "react";
import { ControlLabel, Modal, Panel } from "react-bootstrap";
import { Voting } from "../../utils/types";
import ResultsPieChart from "./ResultsPieChart";
import { covertTimestampToDate } from "./VoteModal";

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
        <Modal.Body>
          <Panel>
            <Panel.Heading>
              <Panel.Title className="text-center" style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                Voting info
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <ControlLabel style={{ fontSize: "1.2em" }}>Question</ControlLabel>
              <p>{this.props.voting.info.question}</p>

              <ControlLabel style={{ fontSize: "1.2em" }}>Possible answers</ControlLabel>
              <ul>
                {this.props.voting.info.answers.map((answer) => {
                  return <li>{answer}</li>;
                })}
              </ul>
              <ControlLabel style={{ fontSize: "1.2em" }}>Voting deadline</ControlLabel>
              <p>{covertTimestampToDate(this.props.voting.info.votingEndTime)}.</p>
              <ControlLabel style={{ fontSize: "1.2em" }}>Results viewing</ControlLabel>
              <p>Available until {covertTimestampToDate(this.props.voting.info.resultsEndTime)}.</p>
              <ControlLabel style={{ fontSize: "1.2em" }}>Voting type</ControlLabel>
              <p>{this.props.voting.info.isPrivate ? "Private" : "Public"}.</p>
            </Panel.Body>
          </Panel>

          <Panel>
            <Panel.Heading>
              <Panel.Title className="text-center" style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                Voting results
              </Panel.Title>
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
