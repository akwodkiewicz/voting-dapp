import React, { Component } from "react";
import { ControlLabel, FormGroup, Grid, Row, Col } from "react-bootstrap";
import * as Datetime from "react-datetime";
import moment from "moment";

class VoteDates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voteEndDateTime: moment(),
      resultsEndDateTime: moment()
        .add(1, "day")
        .add(1, "hour"),
    };
  }

  componentDidMount() {
    let newState = {};
    if (this.props.voteEndDate) {
      newState.voteEndDate = this.props.voteEndDate;
    }
    if (this.props.voteEndTime) {
      newState.voteEndTime = this.props.voteEndTime;
    }
    if (this.props.resultsEndDate) {
      newState.resultsEndDate = this.props.resultsEndDate;
    }
    if (this.props.resultsEndTime) {
      newState.resultsEndTime = this.props.resultsEndTime;
    }
    this.setState(newState);
  }

  voteEndDateHandler = (inputMoment) => {
    const newVoteEndDateTime = moment(inputMoment).set({
      hours: this.state.voteEndDateTime.hours(),
      minutes: this.state.voteEndDateTime.minutes(),
    });
    this.setState(() => ({
      voteEndDateTime: newVoteEndDateTime,
    }));

    // Reset resultsEndDateTime if neccessary
    if (newVoteEndDateTime.isAfter(this.state.resultsEndDateTime, "minute")) {
      const newResultsEndDateTime = moment(newVoteEndDateTime).add(1, "d");
      this.setState(() => ({
        resultsEndDateTime: newResultsEndDateTime,
      }));
    }

    this.props.getVoteEnd(newVoteEndDateTime.utc().unix());
  };

  voteEndTimeHandler = (inputMoment) => {
    const newVoteEndDateTime = moment(inputMoment).set({
      year: this.state.voteEndDateTime.year(),
      month: this.state.voteEndDateTime.month(),
      day: this.state.voteEndDateTime.day(),
    });
    this.setState(() => ({
      voteEndDateTime: newVoteEndDateTime,
    }));

    // Reset resultsEndDateTime if neccessary
    if (newVoteEndDateTime.isAfter(this.state.resultsEndDateTime, "minute")) {
      const newResultsEndDateTime = moment(newVoteEndDateTime).add(1, "h");
      this.setState(() => ({
        resultsEndDateTime: newResultsEndDateTime,
      }));
    }

    this.props.getVoteEnd(newVoteEndDateTime.utc().unix());
  };

  resultsEndDateHandler = (inputMoment) => {
    const newResultsEndDateTime = moment(inputMoment).set({
      hours: this.state.resultsEndDateTime.hours(),
      minutes: this.state.resultsEndDateTime.minutes(),
    });
    this.setState(() => ({
      resultsEndDateTime: newResultsEndDateTime,
    }));
    this.props.getResultsViewingEnd(newResultsEndDateTime.utc().unix());
  };

  resultsEndTimeHandler = (inputMoment) => {
    const newResultsEndDateTime = moment(inputMoment).set({
      year: this.state.resultsEndDateTime.year(),
      month: this.state.resultsEndDateTime.month(),
      day: this.state.resultsEndDateTime.day(),
    });

    // Don't allow changing incorrect value
    if (newResultsEndDateTime.isBefore(this.state.voteEndDateTime, "minute")) {
      return;
    }

    this.setState(() => ({
      resultsEndDateTime: newResultsEndDateTime,
    }));

    this.props.getResultsViewingEnd(newResultsEndDateTime.utc().unix());
  };

  render() {
    return (
      <FormGroup>
        <Grid>
          <Row className="showGrid">
            <Col xs={6}>
              <ControlLabel>Voting end time</ControlLabel>
            </Col>
            <Col xs={6}>
              <ControlLabel>Results viewing end time</ControlLabel>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>Date</Col>

            <Col xs={3}>Time</Col>

            <Col xs={3}>Date</Col>

            <Col xs={3}>Time</Col>
          </Row>
          <Row className="showGrid">
            <Col xs={3}>
              <Datetime
                inputProps={{ id: "voteDateEnd" }}
                closeOnSelect={true}
                isValidDate={(current) => {
                  return current.isAfter(moment().subtract(1, "day"), "minute");
                }}
                timeFormat={false}
                onChange={this.voteEndDateHandler}
                value={this.state.voteEndDateTime}
              />
            </Col>
            <Col xs={3}>
              <Datetime
                inputProps={{ id: "voteTimeEnd" }}
                dateFormat={false}
                closeOnSelect={true}
                onChange={this.voteEndTimeHandler}
                value={this.state.voteEndDateTime}
              />
            </Col>

            <Col xs={3}>
              <Datetime
                inputProps={{ id: "resultsDateEnd" }}
                closeOnSelect={true}
                isValidDate={(current) => {
                  current.set({
                    hour: this.state.resultsEndDateTime.hour(),
                    minute: this.state.resultsEndDateTime.minute(),
                  });
                  return current.isAfter(this.state.voteEndDateTime, "m");
                }}
                timeFormat={false}
                onChange={this.resultsEndDateHandler}
                value={this.state.resultsEndDateTime}
              />
            </Col>
            <Col xs={3}>
              <Datetime
                inputProps={{ id: "resultsTimeEnd" }}
                closeOnSelect={true}
                dateFormat={false}
                onChange={this.resultsEndTimeHandler}
                value={this.state.resultsEndDateTime}
              />
            </Col>
          </Row>
        </Grid>
      </FormGroup>
    );
  }
}

export default VoteDates;
