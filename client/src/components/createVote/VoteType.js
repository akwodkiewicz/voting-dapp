import React, { Component } from "react";
import { ControlLabel, FormGroup, Radio } from "react-bootstrap";
import PrivilegedAddresses from "./PrivilegedAddresses";

class VoteType extends Component {
  constructor(props) {
    super(props);
  }

  changeVoteType = () => {
    const publicVote = document.getElementById("votePublic");
    const voteType = publicVote.checked ? "public" : "private";
    this.props.setVoteTypeInParent(voteType);
  };

  setPrivilegedVoters = (voters) => {
    this.props.setPrivilegedVotersInParent(voters);
  };

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

        <PrivilegedAddresses
          setPrivilegedAddressesInParent={this.setPrivilegedVoters}
          voteType={this.props.voteType}
          textAreaValue={this.props.privilegedVoters.reduce((prevVal, currVal, currIdx) => {
            return currIdx === 0 ? currVal : prevVal + "\n" + currVal;
          }, "")}
        />
      </React.Fragment>
    );
  }
}

export default VoteType;
