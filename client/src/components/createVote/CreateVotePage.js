import React, { Component } from "react";
import AnswersList from "./AnswersList";
import VoteType from './VoteType';
import VoteDates from './VoteDates';
import FieldGroup from '../common/FieldGroup';
import CategoryPanel from "./CategoryPanel";
import 'react-datetime/css/react-datetime.css';
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock } from 'react-bootstrap';


class CreateVotePage extends Component {
  constructor() {
    super();

    this.state = {
      question: '',
      answers: [],
      voteEndTime: 0,
      resultsViewingEndTime: 0,
      categoryPanel: 'existing',
      category: '',
      voteType: 'public',   
      privilegedVoters: []         
    }
    this.getQuestion = this.getQuestion.bind(this);
    this.getAnswers = this.getAnswers.bind(this);
    this.getVoteEnd = this.getVoteEnd.bind(this);
    this.getResultsViewingEndTime = this.getResultsViewingEndTime.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.getVoteType = this.getVoteType.bind(this);
    this.getPrivilegedVoters = this.getPrivilegedVoters.bind(this);    
    this.addAnswer = this.addAnswer.bind(this);
    this.changeCategoryPanel = this.changeCategoryPanel.bind(this);
    this.handleCreateVote = this.handleCreateVote.bind(this);

  }

  getQuestion(e) {
    const question = e.target.value;
    this.setState(() => ({
      question : question
    }))
  }

  getAnswers(answersFromChild) {
    this.setState(()=>({
      answers: answersFromChild
    }))
  }

  getVoteEnd(timeFromChild) {
    this.setState(()=>({
      voteEndTime: timeFromChild
    }))
  }

  getResultsViewingEndTime(timeFromChild) {
    this.setState(()=>({
      resultsViewingEndTime: timeFromChild
    }))
  }

  getCategory(categoryFromChild) {
    this.setState(() => ({
      category : categoryFromChild
    }))
  }

  getVoteType(voteTypeFromChild) {
    this.setState(()=>({
      voteType: voteTypeFromChild
    }))
  }

  getPrivilegedVoters(privilegedVoters) {
    this.setState(() => ({
      privilegedVoters : privilegedVoters
    }))
  }

  changeCategoryPanel() {
    var categoryQuestion = document.getElementById('category-from-list');
    var categoryAnswer = categoryQuestion.checked ? 'existing' : 'new';

    this.setState(() => ({
      categoryPanel : categoryAnswer  
    }))
  }

  

  
  
  handleCreateVote() { 
    // TODO: validation   
    console.log(this.state.question);
    console.log(this.state.answers);
    console.log(this.state.voteEndTime)
    console.log(this.state.resultsViewingEndTime)
    console.log(this.state.category);
    console.log(this.state.voteType);    
    console.log(this.state.privilegedVoters);
  }
  
  addAnswer({target}) {
    var answer = document.getElementById('answer').value;
    var allAnswers = this.state.answers;
    if(!allAnswers.includes(answer)) {
      allAnswers.push(answer);
      this.setState(() => ({
        answers : allAnswers
      }))
    }    
  }
    
  render() {
    return (
      <form>
       
        <FieldGroup id="question" type="text" label="Question" 
          placeholder="Enter the question for vore" onChange={this.getQuestion}
        />
        
        <ControlLabel>Answers</ControlLabel>                            

        <FormGroup>
          <HelpBlock>There must be at least 2 answers.</HelpBlock>
          <InputGroup>            
            <FormControl id="answer" type="text" placeholder="Enter the answer"/>
            <InputGroup.Button>
              <Button onClick={this.addAnswer}>Add answer</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        <AnswersList getAnswers={this.getAnswers} answers={this.state.answers}/>

        <VoteDates getVoteEnd={this.getVoteEnd} getResultsViewingEnd={this.getResultsViewingEndTime}/>
        
        <FormGroup onChange={this.changeCategoryPanel}>
          <ControlLabel>Category</ControlLabel>
          <HelpBlock>Select existing category from the list or create a new one.</HelpBlock>       
            <Radio name="categoryGroup" id="category-from-list" defaultChecked inline>
              Select existing category
            </Radio>
            <Radio name="categoryGroup" id="category-new" inline>
              Create new category
            </Radio>
        </FormGroup>
              
        <CategoryPanel getCategory={this.getCategory} categoryPanel={this.state.categoryPanel}/>
                  
        <VoteType getVoteType={this.getVoteType} getPrivilegedVoters={this.getPrivilegedVoters}/>

        <Button onClick={this.handleCreateVote}>Submit</Button>
      </form>
    );
  }

}



export default CreateVotePage;