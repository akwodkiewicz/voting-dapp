import React, { Component } from "react";
import {Link} from 'react-router-dom';
import AnswersList from "./AnswersList";
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
class CreateVotePage extends Component {
  constructor() {
    super();

    this.state = {
      question: '',
      category: 'aaa',
      answers: [],
      voteType: 'public'      
    }
    this.handleChange = this.handleChange.bind(this);
    this.changeVoteType = this.changeVoteType.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.handleChangeRaw = this.handleChangeRaw.bind(this);
  }



  
  handleCreateVote() {    
  }
  
  addAnswer({target}) {
      var answer = document.getElementById('answer').value;
      var allAnswers = this.state.answers;
      allAnswers.push(answer);
      this.setState(() => ({
        answers : allAnswers
      })
    )
  }

  handleChange({target}) {
    this.setState(() => ({
      [target.name]: target.value
    }))
    console.log(this.state.question);
    console.log(this.state.category);
  }

  changeVoteType({target}) {
    var voteType = 'private';
    this.setState(() => ({
      [voteType]: voteType
    }))
    console.log(this.state[voteType])
  }
  
  handleChangeRaw = (date) => { date.currentTarget.value = moment(this.props.input.value).format("DD/MM/YYYY") }
  
  render() {
    return (
      <form onSubmit={this.handleCreateVote}>
       
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <input type="text" name = "question" className="form-control" id="question" placeholder="Type a question for vote" onChange={this.handleChange} value={this.state.question}/>
        </div>

        <div className="form-group">
          <label htmlFor="answers">Possible answers</label>
          <small id="answersHelp" className="form-text text-muted">There must be at least two answers.</small>

          <AnswersList answers={this.state.answers}/>

          <div className="input-group">
            <input type="text" id="answer" className="form-control" placeholder="Type an answer"/>
            <div className="input-group-append">
              <button type="button" className="btn btn-outline-secondary" onClick={this.addAnswer}>Add</button>                       
            </div>
          </div>
        </div>

        <div style={{display: 'inline-block'}}>
          <label>Voting end time</label>
          <Datetime 
            isValidDate = {function(current) {              
              return current.isAfter(moment());
            }}
            id = 'voteEndDate'
          />

          <label>Voting expiration time</label>
          <Datetime 
            isValidDate = {function(current) {                            
              let voteEndTime = document.getElementById('voteEndDate');
              return voteEndTime != null ? current.isAfter(voteEndTime.value) : current.isAfter(moment().subtract(1, 'day'));
            }}
          />
        </div>
        

        <div className="form-group">
          <label htmlFor="categories">Category</label>
            <input id="categories" 
              type="text" 
              className="form-control" 
              name="city" 
              onChange={this.handleChange}
              placeholder="Select existing category or type a new one" 
              list="existing-categories"/>
            <datalist  id="existing-categories">
              <option value="Arts"/>
              <option value="Politics"/>
              <option value="Business"/>
            </datalist>          
        </div>

        

        <fieldset className="form-group">
            <legend>Vote type</legend>
            <div className="form-check">
              <label className="form-check-label">
                <input type="radio" className="form-check-input" name="optionsRadios" id="option-public" onChange={this.changeVoteType} defaultChecked/>
                Public
              </label>
            </div>
            <div className="form-check">
            <label className="form-check-label">
                <input type="radio" className="form-check-input" name="optionsRadios" id="option-private" onChange={this.changeVoteType}/>
                Private
              </label>
            </div>
        </fieldset>

        <PrivateAdressTextBox voteType={this.state.voteType} />
      
        

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }

}

function PrivateAdressTextBox(props) {
  const voteType = props.voteType;
  //console.log(voteType)
  if(voteType === 'private') {
    return <h1> LOL </h1>
  }  
  return null;  
}

export default CreateVotePage;