import React, { Component } from "react";
import {ControlLabel, FormGroup, Radio, FormControl}from 'react-bootstrap';
import PrivilegedAddresses from './PrivilegedAddresses';

class VoteType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voteType: "public",
      privilegedAddresses: []      
    }
    this.changeVoteType = this.changeVoteType.bind(this);
    this.getPrivilegedAddresses = this.getPrivilegedAddresses.bind(this);
  }
  
  changeVoteType({target}) {
    var publicVote = document.getElementById('votePublic');
    var voteType = publicVote.checked ? 'public' : 'private';

    this.setState(() => ({
      voteType: voteType
    }))
    this.props.getVoteType(voteType);
  }

  getPrivilegedAddresses(addresses) {
    this.props.getPrivilegedVoters(addresses);
  }

  render() {
    return (
      <React.Fragment>
        <ControlLabel>Vote type</ControlLabel>
        <FormGroup onChange={this.changeVoteType}>
          <Radio name="radioGroup" defaultChecked id="votePublic" inline>
            Public
          </Radio>
          <Radio name="radioGroup" inline>
            Private
          </Radio>
        </FormGroup>

        <PrivilegedAddresses getPrivilegedAddresses={this.getPrivilegedAddresses} voteType={this.state.voteType} />
      </React.Fragment>
    );
  }    
}

export default VoteType;