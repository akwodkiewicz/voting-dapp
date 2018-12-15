import React, { Component } from "react";
import { ControlLabel, FormGroup, Radio } from "react-bootstrap";
import PrivilegedAddresses from "./PrivilegedAddresses";

class VoteType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privilegedAddresses: [],
    };
    this.changeVoteType = this.changeVoteType.bind(this);
    this.getPrivilegedAddresses = this.getPrivilegedAddresses.bind(this);
  }

  changeVoteType() {
    const publicVote = document.getElementById("votePublic");
    const voteType = publicVote.checked ? "public" : "private";
    this.props.setVoteTypeInParent(voteType);
  }

  getPrivilegedAddresses(addresses) {
    this.props.getPrivilegedVoters(addresses);
  }

  render() {
    return (
      <React.Fragment>
        <ControlLabel>Vote type</ControlLabel>
        <FormGroup onChange={this.changeVoteType}>
          <Radio name="radioGroup" checked={this.props.voteType === "public" ? true : false} id="votePublic" inline>
            Public
          </Radio>
          <Radio name="radioGroup" checked={this.props.voteType === "private" ? true : false} inline>
            Private
          </Radio>
        </FormGroup>

        <PrivilegedAddresses getPrivilegedAddresses={this.getPrivilegedAddresses} voteType={this.props.voteType} />
      </React.Fragment>
    );
  }
}

export default VoteType;
