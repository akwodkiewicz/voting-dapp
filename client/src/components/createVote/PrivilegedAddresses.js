import React, { Component } from "react";
import {ControlLabel, FormControl, FormGroup }from 'react-bootstrap';

class PrivilegedAddresses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addresses: []
    }
    this.saveAddresses = this.saveAddresses.bind(this);
    this.getPrivilegedAddresses = this.getPrivilegedAddresses.bind(this);
  }
  getPrivilegedAddresses(addresses) {
  }

  saveAddresses(e) {
      let addressesArray = e.target.value.split('\n');
      // TODO: validate each address
      this.addresses = addressesArray;
      this.props.getPrivilegedAddresses(addressesArray);
  }
    
  render() {
    if (this.props.voteType === 'private') { 
      return (     
        <FormGroup>
          <ControlLabel>Privileged addresses</ControlLabel>
          <FormControl onChange={this.saveAddresses} componentClass="textarea" placeholder="textarea" />
        </FormGroup>               
      )
    }
    else return null;    
  }
}

export default PrivilegedAddresses;