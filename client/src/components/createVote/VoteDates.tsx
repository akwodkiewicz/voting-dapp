import moment from "moment";
import React, { Component } from "react";
import { Col, ControlLabel, FormGroup, HelpBlock, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Datetime from "react-datetime";

export enum VotingExpiryOption {
  ThreeDays = 3 * 24 * 60 * 60,
  Week = 7 * 24 * 60 * 60,
  Month = 30 * 24 * 60 * 60,
}

interface IVoteDatesProps {
  voteEndDateTime: moment.Moment;
  votingExpiryOption: VotingExpiryOption;
  getVoteEnd: (arg: number) => void;
  setVotingExpiryOptionInParent: (arg: VotingExpiryOption) => void;
}

// tslint:disable:object-literal-sort-keys
export default class VoteDates extends Component<IVoteDatesProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <Row>
        <Col md={6}>
          <Row>
            <Col md={12}>
              <ControlLabel>Deadline</ControlLabel>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <HelpBlock>Date</HelpBlock>
                <Datetime
                  inputProps={{ id: "voteDateEnd" }}
                  closeOnSelect={true}
                  isValidDate={(current) => {
                    return current.isAfter(moment().subtract(1, "day"), "minute");
                  }}
                  timeFormat={false}
                  onChange={this.voteEndDateHandler}
                  value={this.props.voteEndDateTime}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <HelpBlock>Time</HelpBlock>
                <Datetime
                  inputProps={{ id: "voteTimeEnd" }}
                  dateFormat={false}
                  closeOnSelect={true}
                  onChange={this.voteEndTimeHandler}
                  value={this.props.voteEndDateTime}
                />
              </FormGroup>
            </Col>
          </Row>
        </Col>

        <Col md={6}>
          <Row>
            <Col md={12}>
              <ControlLabel>Results expiry date</ControlLabel>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <HelpBlock>
                  <em>How long will the results be available?</em>
                </HelpBlock>
                <ToggleButtonGroup
                  type="radio"
                  name="votingExpiryOption"
                  value={this.props.votingExpiryOption}
                  onChange={this.votingExpiryOptionHandler}
                  justified
                >
                  <ToggleButton value={VotingExpiryOption.ThreeDays}>3 Days</ToggleButton>
                  <ToggleButton value={VotingExpiryOption.Week}>1 Week</ToggleButton>
                  <ToggleButton value={VotingExpiryOption.Month}>1 Month</ToggleButton>
                </ToggleButtonGroup>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  private voteEndDateHandler = (inputMoment) => {
    const newVoteEndDateTime = moment(inputMoment).set({
      hours: this.props.voteEndDateTime.hours(),
      minutes: this.props.voteEndDateTime.minutes(),
    });

    this.props.getVoteEnd(newVoteEndDateTime.utc().unix());
  };
  private voteEndTimeHandler = (inputMoment) => {
    const newVoteEndDateTime = moment(inputMoment).set({
      year: this.props.voteEndDateTime.year(),
      month: this.props.voteEndDateTime.month(),
      day: this.props.voteEndDateTime.day(),
    });

    this.props.getVoteEnd(newVoteEndDateTime.utc().unix());
  };

  private votingExpiryOptionHandler = (value: VotingExpiryOption) => {
    this.props.setVotingExpiryOptionInParent(value);
  };
}
