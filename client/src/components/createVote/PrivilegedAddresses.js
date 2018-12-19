import React, { Component } from "react";
import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";

class PrivilegedAddresses extends Component {
  constructor(props) {
    super(props);
  }

  saveAddresses = (e) => {
    const addressesArray = e.target.value.split("\n");
    // TODO: validate each address
    this.props.setPrivilegedAddressesInParent(addressesArray);
  };

  render() {
    if (this.props.voteType === "private") {
      return (
        <FormGroup>
          <ControlLabel>Privileged addresses</ControlLabel>
          <FormControl
            onChange={this.saveAddresses}
            componentClass="textarea"
            placeholder="textarea"
            value={this.props.textAreaValue}
          />
        </FormGroup>
      );
    } else return null;
  }
}

export default PrivilegedAddresses;
