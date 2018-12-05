import React, { Component } from "react";
import AnswersList from "./AnswersList";
import VoteType from './VoteType';
import VoteDates from './VoteDates';
import FieldGroup from '../common/FieldGroup';
import CategoryPanel from "./CategoryPanel";
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock, Grid, Row, Col } from 'react-bootstrap';


class CreateVotePage extends Component {
  constructor() {
    super();

    this.state = {
      question: '',
      categoryPanel: 'existing',
      category: '',
      answers: [],
      voteType: 'public',            
    }
    this.addAnswer = this.addAnswer.bind(this);
    this.changeCategoryPanel = this.changeCategoryPanel.bind(this);
    this.handleCreateVote = this.handleCreateVote.bind(this);
    this.getCategory = this.getCategory.bind(this);
  }

  changeCategoryPanel({target}) {
    var categoryQuestion = document.getElementById('category-from-list');
    var categoryAnswer = categoryQuestion.checked ? 'existing' : 'new';

    this.setState(() => ({
      categoryPanel : categoryAnswer  
    }))
  }

  getCategory(category) {
    this.setState(() => ({
      category : category
    }))
  }
  
  handleCreateVote() { 
    // TODO   
    console.log(this.state.question);
    console.log(this.state.category);
    console.log(this.state.answer);
    console.log(this.state.voteType);
  }
  
  addAnswer({target}) {
    var answer = document.getElementById('answer').value;
    var allAnswers = this.state.answers;
    allAnswers.push(answer);
    this.setState(() => ({
      answers : allAnswers
    }))
  }
    
  render() {
    return (
      <form>
       
        <FieldGroup
          id="question"
          type="text"
          label="Question"
          placeholder="Enter the question for vore"
        />
        
        <ControlLabel>Answers</ControlLabel>                            

        <FormGroup>
          <InputGroup>            
            <FormControl id="answer" type="text" placeholder="Enter the answer"/>

            <InputGroup.Button>
              <Button onClick={this.addAnswer}>Add answer</Button>
            </InputGroup.Button>
          </InputGroup>
          <HelpBlock>There must be at least 2 answers.</HelpBlock>
        </FormGroup>
        <AnswersList answers={this.state.answers}/>

        <VoteDates/>
        
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
                  
        <VoteType voteType={this.state.voteType}/>

        <Button onClick={this.handleCreateVote}>Submit</Button>
      </form>
    );
  }

}



export default CreateVotePage;