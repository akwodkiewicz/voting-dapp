import React, { Component } from "react";
import {ControlLabel, FormGroup, Radio, FormControl}from 'react-bootstrap';

class VoteType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voteType: "public"      
    }
    this.changeVoteType = this.changeVoteType.bind(this);
  }
  
  changeVoteType({target}) {
    var publicVote = document.getElementById('votePublic');
    var voteType = publicVote.checked ? 'public' : 'private';
    console.log("Public vote value: " + publicVote.checked)
    console.log("Vote type: " + voteType)

    this.setState(() => ({
      voteType: voteType
    }))
    console.log("State: " + this.state.voteType)
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
        <PrivateAdressTextBox voteType={this.state.voteType} />
      </React.Fragment>
    );
  }    
}

function PrivateAdressTextBox(props) {
  
  if(props.voteType === 'private') {
    return (
      <FormGroup>
        <ControlLabel>Privileged addresses</ControlLabel>
        <FormControl componentClass="textarea" placeholder="textarea" />
      </FormGroup>
    )
  }  
  return null;  
}

export default VoteType;