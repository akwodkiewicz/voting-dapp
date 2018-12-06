import React, { Component } from "react";
import {ControlLabel, FormGroup, Grid, Row, Col }from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import moment from "moment";

class VoteDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voteEndDate : '',
      voteEndTime : '',      
      resultsEndDate : '',
      resultsEndTime : ''
    }
    this.getVoteEndDateHandler = this.getVoteEndDateHandler.bind(this);
    this.getVoteEndTimeHandler = this.getVoteEndTimeHandler.bind(this);
    this.getResultsEndDateHandler = this.getResultsEndDateHandler.bind(this);
    this.getResultsEndTimeHandler = this.getResultsEndTimeHandler.bind(this);
  }

  getVoteEndDateHandler(e) {
    let result = moment();
    result.set({'year': e.year(), 'month': e.month(), 'date': e.date()})
    
    this.setState(()=>({
      voteEndDate : result
    }))
    if(this.state.voteEndTime !== '') {
      result.set({'hour': this.state.voteEndTime.hour(), 'minute': this.state.voteEndTime.minute() });
      this.props.getVoteEnd(result.utc().unix());
    } 
  }

  getVoteEndTimeHandler(e) {
    let result= moment();
    result.set({'hour': e.hour(), 'minute': e.minute()})
    
    this.setState(()=>({
      voteEndTime : result
    }))
    if(this.state.voteEndDate !== '') {
      result.set({'year': this.state.voteEndDate.year(), 'month': this.state.voteEndDate.month(), 'date': this.state.voteEndDate.date()});
      this.props.getVoteEnd(result.utc().unix());
    } 
  }
  
  getResultsEndDateHandler(e) {
    let result = moment();
    result.set({'year': e.year(), 'month': e.month(), 'date': e.date()})
    
    this.setState(()=>({
      resultsEndDate : result
    }))
    if(this.state.resultsEndTime !== '') {
      result.set({'hour': this.state.resultsEndTime.hour(), 'minute': this.state.resultsEndTime.minute() });
      this.props.getVoteEnd(result.utc().unix());
    } 
  }

  getResultsEndTimeHandler(e) {
    let result= moment();
    result.set({'hour': e.hour(), 'minute': e.minute()})
    
    this.setState(()=>({
      resultsEndTime : result
    }))
    if(this.state.resultsEndDate !== '') {
      result.set({'year': this.state.resultsEndDate.year(), 'month': this.state.resultsEndDate.month(), 'date': this.state.resultsEndDate.date()});
      this.props.getVoteEnd(result.utc().unix());
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
                onChange={this.getVoteEndTimeHandler}
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