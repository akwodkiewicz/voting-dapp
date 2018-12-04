import React, { Component } from "react";
import {Link} from 'react-router-dom';
import AnswersList from "./AnswersList";
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock } from 'react-bootstrap';
import FieldGroup from '../common/FieldGroup';
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
       
        <FieldGroup
          id="question"
          type="text"
          label="Question"
          placeholder="Enter the question for vore"
        />
        
        <ControlLabel>Answers</ControlLabel>                            

        <FormGroup>
          <InputGroup help="lol">            
            <FormControl id="answer" type="text" placeholder="Enter the answer"/>

            <InputGroup.Button>
              <Button onClick={this.addAnswer}>Add answer</Button>
            </InputGroup.Button>
          </InputGroup>
          <HelpBlock>There must be at least 2 answers.</HelpBlock>
        </FormGroup>
        <AnswersList answers={this.state.answers}/>


        <FormGroup>
          <ControlLabel>Category</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="arts">Arts</option>
            <option value="politics">Business</option>
            <option value="computer-science">Computer science</option>
          </FormControl>
          <FieldGroup
            id="new-category"
            type="text"
            label="New Category"
            placeholder="Enter the new category"
          />
        </FormGroup>
        
        <ControlLabel>Vote type</ControlLabel>
        <FormGroup>
          <Radio name="radioGroup" checked inline onChange={this.changeVoteType}>
            Public
          </Radio>
          <Radio name="radioGroup" inline>
            Private
          </Radio>
        </FormGroup>

        <PrivateAdressTextBox voteType={this.state.voteType} />


        <Button type="submit">Submit</Button>
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