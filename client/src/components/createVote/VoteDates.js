import React, { Component } from "react";
import {ControlLabel, FormGroup, Radio, FormControl, Grid, Row, Col }from 'react-bootstrap';
import * as Datetime from 'react-datetime';

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
              <Datetime/>
            </Col>
            <Col xs={6}> 
              <Datetime/>
            </Col>
          </Row>
        </Grid>
        </FormGroup>
    )
  }
}

export default VoteDates;