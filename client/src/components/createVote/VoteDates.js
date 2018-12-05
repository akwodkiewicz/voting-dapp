import React, { Component } from "react";
import {ControlLabel, FormGroup, Grid, Row, Col }from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import moment from "moment";

class VoteDates extends Component {
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
          <Row className="showGrid">
            <Col xs={6}> 
              <Datetime 
                inputProps={{id: 'votePeriodEnd'}}
                closeOnSelect={true}
                timeFormat={'HH:mm'}
                isValidDate = {(current) => {   
                  let resultsPeriodEnd = document.getElementById('resultsPeriodEnd');
                  if(resultsPeriodEnd != null && resultsPeriodEnd.value !== "") {
                    return moment(resultsPeriodEnd.value).isAfter(current.add(1, 'minute'), 'minute') && current.isAfter(moment().subtract(1, 'day'), 'minute');
                  }
                  return current.isAfter(moment().subtract(1, 'day'), 'minute');                 
                }} 
              />
            </Col>
            <Col xs={6}> 
              <Datetime 
                inputProps={{id: 'resultsPeriodEnd'}}
                closeOnSelect={true}
                isValidDate = {(current) => {   
                  let votePeriodEnd = document.getElementById('votePeriodEnd');
                  if(votePeriodEnd != null && votePeriodEnd.value !== "") {
                    return current.isAfter(moment(votePeriodEnd.value).add(1, 'minute'), 'minute') && current.isAfter(moment().subtract(1, 'day'), 'minute');
                  }
                  return current.isAfter(moment().subtract(1, 'day'), 'minute');                 
                }}
              />
            </Col>
          </Row>
        </Grid>
        </FormGroup>
    )
  }
}

export default VoteDates;