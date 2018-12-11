import React, { Component } from "react";
import CreateVoteForm from './CreateVoteForm';
import LoadingResult from "./LoadingResult"
import DisplayResult from './DisplayResult'
class CreateVotePage extends Component {
  constructor() {
    super();

    this.state = {
      mode: 'form',
      resultStatus: 'success',
      formData: null 
    }

    this.getSubmitData = this.getSubmitData.bind(this)
    this.getTransactionResult = this.getTransactionResult.bind(this)
  }
 
  getSubmitData(formData) {
    // get some data
    
    this.setState(() => ({
      mode: 'fetching',
      formData: formData
    }))

    
  }

  getTransactionResult() {
    // TODO: here send the data to blockchain using data from state.formData

    // your code

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