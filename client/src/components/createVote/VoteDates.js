import React, { Component } from "react";
import {ControlLabel, FormGroup, Grid, Row, Col }from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import moment from "moment";

class VoteDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voteEndDate : 0,
      voteEndTime : 0,      
      resultsEndDate : 0,
      resultsEndTime : 0
    }
    this.getVoteEndDateHandler = this.getVoteEndDateHandler.bind(this);
    this.getVoteEndTimeHandler = this.getVoteEndTimeHandler.bind(this);

  }

  getVoteEndDateHandler(e) {
    let result = moment();
    result.set({'year': e.year(), 'month': e.month(), 'date': e.date()})
    
    this.setState(()=>({
      voteEndDate : result
    }))
    if(this.state.voteEndTime !== 0) {
      result.set({'hour': this.state.voteEndTime.hour(), 'minute': this.state.voteEndTime.minute() });
      this.props.getVoteEnd(result.unix());
    } 
  }

  getVoteEndTimeHandler(e) {
    let result= moment();
    result.set({'hour': e.hour(), 'minute': e.minute()})
    
    this.setState(()=>({
      voteEndTime : result
    }))
    if(this.state.voteEndDate !== 0) {
      result.set({'year': this.state.voteEndDate.year(), 'month': this.state.voteEndDate.month(), 'date': this.state.voteEndDate.date()});
      this.props.getVoteEnd(result.unix());
    } 
  }
  
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
            <Col xs={3}>
              Date
            </Col>

            <Col xs={3}>
              Time
            </Col>

            <Col xs={3}>
              Date
            </Col>

            <Col xs={3}>
              Time
            </Col>
          </Row>
          <Row className="showGrid">
            <Col xs={3}> 
              <Datetime 
                inputProps={{id: 'voteDateEnd'}}
                closeOnSelect={true}
                isValidDate = {(current) => {   
                  let resultsPeriodEnd = document.getElementById('resultsPeriodEnd');
                  if(resultsPeriodEnd != null && resultsPeriodEnd.value !== "") {
                    return moment(resultsPeriodEnd.value).isAfter(current.add(1, 'minute'), 'minute') && current.isAfter(moment().subtract(1, 'day'), 'minute');
                  }
                  return current.isAfter(moment().subtract(1, 'day'), 'minute');                 
                }} 
                timeFormat={false}
                onChange={this.getVoteEndDateHandler}
              />
            </Col>
            <Col xs={3}>
            <Datetime 
                inputProps={{id: 'voteTimeEnd'}}
                closeOnSelect={true}
                dateFormat={false}
                onChange={this.getVoteEndTimeHandler}
                isValidDate = {(current) => {
                  return current.hour() > 11;
                }}
              />
            </Col>

            <Col xs={3}> 
              <Datetime 
                inputProps={{id: 'resultsDateEnd'}}
                closeOnSelect={true}
                isValidDate = {(current) => {   
                  let votePeriodEnd = document.getElementById('votePeriodEnd');
                  if(votePeriodEnd != null && votePeriodEnd.value !== "") {
                    return current.isAfter(moment(votePeriodEnd.value).add(1, 'minute'), 'minute') && current.isAfter(moment().subtract(1, 'day'), 'minute');
                  }
                  return current.isAfter(moment().subtract(1, 'day'), 'minute');                 
                }}
                timeFormat={false}
              />
              
            </Col>
            <Col xs={3}>
            <Datetime 
                inputProps={{id: 'resultsTimeEnd'}}
                closeOnSelect={true}
                dateFormat={false}
              />
            </Col>
          </Row>
        </Grid>
        </FormGroup>
    )
  }
}

export default VoteDates;