import * as moment from "moment";
import { Component } from "react";
import { Col, ControlLabel, FormGroup, Grid, Row } from "react-bootstrap";
import * as Datetime from "react-datetime";

interface IVoteDatesProps {
  voteEndDateTime: moment.Moment;
  resultsEndDateTime: moment.Moment;
  getResultsViewingEnd: (arg: number) => void;
  getVoteEnd: (arg: number) => void;
}

// tslint:disable:object-literal-sort-keys
class VoteDates extends Component<IVoteDatesProps> {
  constructor(props) {
    super(props);
  }

  public voteEndDateHandler = (inputMoment) => {
    const newVoteEndDateTime = moment(inputMoment).set({
      hours: this.props.voteEndDateTime.hours(),
      minutes: this.props.voteEndDateTime.minutes(),
    });

    // Reset resultsEndDateTime if neccessary
    if (newVoteEndDateTime.isAfter(this.props.resultsEndDateTime, "minute")) {
      const newResultsEndDateTime = moment(newVoteEndDateTime).add(1, "d");
      this.props.getResultsViewingEnd(newResultsEndDateTime.utc().unix());
    }

    this.props.getVoteEnd(newVoteEndDateTime.utc().unix());
  };
  public voteEndTimeHandler = (inputMoment) => {
    const newVoteEndDateTime = moment(inputMoment).set({
      year: this.props.voteEndDateTime.year(),
      month: this.props.voteEndDateTime.month(),
      day: this.props.voteEndDateTime.day(),
    });

    // Reset resultsEndDateTime if neccessary
    if (newVoteEndDateTime.isAfter(this.props.resultsEndDateTime, "minute")) {
      const newResultsEndDateTime = moment(newVoteEndDateTime).add(1, "h");
      this.props.getResultsViewingEnd(newResultsEndDateTime.utc().unix());
    }

    this.props.getVoteEnd(newVoteEndDateTime.utc().unix());
  };

  public resultsEndDateHandler = (inputMoment) => {
    const newResultsEndDateTime = moment(inputMoment).set({
      hours: this.props.resultsEndDateTime.hours(),
      minutes: this.props.resultsEndDateTime.minutes(),
    });

    this.props.getResultsViewingEnd(newResultsEndDateTime.utc().unix());
  };

  public resultsEndTimeHandler = (inputMoment) => {
    const newResultsEndDateTime = moment(inputMoment).set({
      year: this.props.resultsEndDateTime.year(),
      month: this.props.resultsEndDateTime.month(),
      day: this.props.resultsEndDateTime.day(),
    });

    // Don't allow changing incorrect value
    if (newResultsEndDateTime.isBefore(this.props.voteEndDateTime, "minute")) {
      return;
    }

    this.props.getResultsViewingEnd(newResultsEndDateTime.utc().unix());
  };

  public render() {
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
                value={this.props.voteEndDateTime}
              />
            </Col>
            <Col xs={3}>
              <Datetime
                inputProps={{ id: "voteTimeEnd" }}
                dateFormat={false}
                closeOnSelect={true}
                onChange={this.voteEndTimeHandler}
                value={this.props.voteEndDateTime}
              />
            </Col>

            <Col xs={3}>
              <Datetime
                inputProps={{ id: "resultsDateEnd" }}
                closeOnSelect={true}
                isValidDate={(current) => {
                  current.set({
                    hour: this.props.resultsEndDateTime.hour(),
                    minute: this.props.resultsEndDateTime.minute(),
                  });
                  return current.isAfter(this.props.voteEndDateTime, "m");
                }}
                timeFormat={false}
                onChange={this.resultsEndDateHandler}
                value={this.props.resultsEndDateTime}
              />
            </Col>
            <Col xs={3}>
              <Datetime
                inputProps={{ id: "resultsTimeEnd" }}
                closeOnSelect={true}
                dateFormat={false}
                onChange={this.resultsEndTimeHandler}
                value={this.props.resultsEndDateTime}
              />
            </Col>
          </Row>
        </Grid>
      </FormGroup>
    );
  }
}

export default VoteDates;
