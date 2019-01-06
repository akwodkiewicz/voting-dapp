import React, { Component, Fragment } from "react";
import { ControlLabel, Modal, Panel, Table } from "react-bootstrap";
import { Voting, VotingInfo } from "../../utils/types";
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

  public getSortedAnswersWithResults = () => {
    const results = this.props.results.map((result) => parseInt(result, 10));
    // const resultsPercentage = this.props.results.map((result) => parseInt(result, 10)/results);

    results.sort().reverse();
    const votingInfo: VotingInfo = this.props.voting.info;
    const dic = [];
    for (let i = 0; i < this.props.voting.info.answers.length; i++) {
      const currentAnswer = votingInfo.answers[i];
      const currenResult = parseInt(this.props.results[i], 10);
      dic.push({ answer: currentAnswer, result: currenResult });
    }

    dic.sort((first, second) => {
      return second.result - first.result;
    });

    return dic;
  };

  public render() {
    const dic = this.getSortedAnswersWithResults();
    console.log(dic);
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
              <Table responsive>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Answer</th>
                    <th style={{ textAlign: "center" }}>No. votes</th>
                    <th style={{ textAlign: "center" }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {dic.map((element) => (
                    <tr>
                      <td style={{ width: "65%" }}>{element.answer}</td>
                      <td style={{ textAlign: "center" }}>{element.result}</td>
                      <td style={{ textAlign: "center" }}>{((100 * element.result) / dic.length).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {this.props.results.every((val) => parseInt(val, 10) === 0) ? (
                <h3 className="text-center">No one has voted!</h3>
              ) : (
                <Fragment>
                  <ResultsPieChart results={this.props.results} voting={this.props.voting} />
                </Fragment>
              )}
            </Panel.Body>
          </Panel>
        </Modal.Body>
      </Modal>
    );
  }
}
