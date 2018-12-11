import React, { Component } from "react";
import AnswersList from "./AnswersList";
import VoteType from './VoteType';
import VoteDates from './VoteDates';
import FieldGroup from '../common/FieldGroup';
import CategoryPanel from "./CategoryPanel";
import CreateVoteForm from './CreateVoteForm';
import 'react-datetime/css/react-datetime.css';
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock } from 'react-bootstrap';
import AboutPage from '../about/AboutPage'
import HomePage from '../home/HomePage'
import LoadingResult from "./LoadingResult"
import DisplayResult from './DisplayResult'
class CreateVotePage extends Component {
  constructor() {
    super();

    this.state = {
      mode: 'form',
      resultStatus: 'success'       
    }

    this.getSubmitData = this.getSubmitData.bind(this)
    this.getTransactionResult = this.getTransactionResult.bind(this)
  }
 
  getSubmitData() {
    // get some data
    
    this.setState(() => ({
      mode: 'fetching'
    }))

    
  }

  getTransactionResult() {
    // TODO: change method to awaiting for the response from the blockchain
    //this.sleep(2000)

    this.setState(() => ({
      mode: 'success'
    }))
  }

  render() {
    if(this.state.mode === 'form') {
      return (
        <CreateVoteForm getSubmitData={this.getSubmitData} />
      )
    }
    else if(this.state.mode === 'fetching') {
      return (
        <LoadingResult getTransactionResult={this.getTransactionResult}/>
      )
    }
    else {
      return (
        <DisplayResult status={this.state.resultStatus}/>
      )
    }
    
  }
  
}

export default CreateVotePage