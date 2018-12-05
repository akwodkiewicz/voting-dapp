import React, { Component } from "react";
import {ControlLabel, FormGroup, FormControl, HelpBlock, Grid, Row, Col }from 'react-bootstrap';
import * as Datetime from 'react-datetime';
import moment from "moment";

class CategoryPanel extends Component {
  render() {
    const categoryPanel = this.props.categoryPanel;
    if (categoryPanel === 'existing') {
      return (
        <React.Fragment>
          <FormControl componentClass="select" placeholder="select">
            <option value="arts">Arts</option>
            <option value="politics">Business</option>
            <option value="computer-science">Computer science</option>
          </FormControl>
        </React.Fragment>
      )
    }
    else {
      return(      
        <React.Fragment>
          <FormControl id="answer" type="text" placeholder="Enter new category"/>
        </React.Fragment>      
      )
    }
  }
}

export default CategoryPanel;