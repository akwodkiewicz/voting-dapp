import React, { Component } from "react";
import {Link} from 'react-router-dom';
import AnswersList from "./AnswersList";
import VoteType from './VoteType';
import VoteDates from './VoteDates';
import FieldGroup from '../common/FieldGroup';
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock, Grid, Row, Col } from 'react-bootstrap';


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
    //this.changeVoteType = this.changeVoteType.bind(this);
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

  // changeVoteType({target}) {
  //   var voteType = 'private';
  //   this.setState(() => ({
  //     [voteType]: voteType
  //   }))
  //   console.log(this.state[voteType])
  // }
  
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
        



        <FormGroup>
          <ControlLabel>Category</ControlLabel>
          <HelpBlock>Select existing category from the list or create a new one.</HelpBlock>

          <Grid>
            <Row className="showGrid">
              <Col xs={6}>
                <ControlLabel>Available categories</ControlLabel>
              </Col>
              <Col xs={6}>
                <ControlLabel>New category</ControlLabel>
              </Col>
            </Row>
            <Row className="showGrid">
            <Col xs={6}> 
                <FormControl componentClass="select" placeholder="select">
                  <option value="arts"></option>
                  <option value="arts">Arts</option>
                  <option value="politics">Business</option>
                  <option value="computer-science">Computer science</option>
                </FormControl>
              </Col>
              <Col xs={6}> 
              <FormControl id="answer" type="text" placeholder="Enter new category"/>

              </Col>
            </Row>
          </Grid>          
          
          
        </FormGroup>
        
        <VoteType voteType={this.state.voteType}/>


        <Button type="submit">Submit</Button>
      </form>
    );
  }

}



export default CreateVotePage;