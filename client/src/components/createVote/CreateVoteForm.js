import React, { Component } from "react";
import AnswersList from "./AnswersList";
import VoteType from "./VoteType";
import VoteDates from "./VoteDates";
import FieldGroup from "../common/FieldGroup";
import CategoryPanel from "./CategoryPanel";
import "react-datetime/css/react-datetime.css";
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock } from "react-bootstrap";

class CreateVoteForm extends Component {
  constructor() {
    super();

    this.state = {
      question: "",
      answers: [],
      voteEndTime: 0,
      resultsViewingEndTime: 0,
      categoryPanel: "existing",
      category: "",
      voteType: "public",
      privilegedVoters: [],
    };

    this.getQuestion = this.getQuestion.bind(this);
    this.getAnswers = this.getAnswers.bind(this);
    this.getVoteEnd = this.getVoteEnd.bind(this);
    this.getResultsViewingEndTime = this.getResultsViewingEndTime.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.changeCategoryPanel = this.changeCategoryPanel.bind(this);
    this.handleCreateVote = this.handleCreateVote.bind(this);
  }

  componentDidMount() {
    if (!this.props.formData) {
      return;
    }

    this.setState({
      question: this.props.formData.question,
      answers: this.props.formData.answers,
      voteEndTime: this.props.formData.voteEndTime,
      resultsViewingEndTime: this.props.formData.resultsViewingEndTime,
      categoryPanel: this.props.formData.categoryPanel,
      category: this.props.formData.category,
      voteType: this.props.formData.voteType,
      privilegedVoters: this.props.formData.privilegedVoters,
    });
  }

  getQuestion(e) {
    const question = e.target.value;
    this.setState(() => ({
      question: question,
    }));
  }

  getAnswers(answersFromChild) {
    this.setState(() => ({
      answers: answersFromChild,
    }));
  }

  getVoteEnd(timeFromChild) {
    this.setState(() => ({
      voteEndTime: timeFromChild,
    }));
  }

  getResultsViewingEndTime(timeFromChild) {
    this.setState(() => ({
      resultsViewingEndTime: timeFromChild,
    }));
  }

  getCategory(categoryFromChild) {
    this.setState(() => ({
      category: categoryFromChild,
    }));
  }

  setVoteType = (voteTypeFromChild) => {
    this.setState(() => ({
      voteType: voteTypeFromChild,
    }));
  };

  setPrivilegedVoters = (privilegedVotersFromChild) => {
    this.setState(() => ({
      privilegedVoters: privilegedVotersFromChild,
    }));
  };

  changeCategoryPanel() {
    var categoryQuestion = document.getElementById("category-from-list");
    var categoryAnswer = categoryQuestion.checked ? "existing" : "new";

    this.setState(() => ({
      categoryPanel: categoryAnswer,
    }));
  }

  handleCreateVote() {
    this.props.getSubmitData(this.state);
  }

  addAnswer({ target }) {
    var answer = document.getElementById("answer").value;
    var allAnswers = this.state.answers;
    if (!allAnswers.includes(answer)) {
      allAnswers.push(answer);
      this.setState(() => ({
        answers: allAnswers,
      }));
    }
  }

  render() {
    return (
      <form>
        <FieldGroup
          id="question"
          type="text"
          label="Question"
          placeholder="Enter the voting question"
          onChange={this.getQuestion}
          value={this.state.question}
        />

        <ControlLabel>Answers</ControlLabel>

        <FormGroup>
          <HelpBlock>There must be at least 2 answers.</HelpBlock>
          <InputGroup>
            <FormControl id="answer" type="text" placeholder="Enter the answer" />
            <InputGroup.Button>
              <Button onClick={this.addAnswer}>Add answer</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        <AnswersList getAnswers={this.getAnswers} answers={this.state.answers} />

        <VoteDates getVoteEnd={this.getVoteEnd} getResultsViewingEnd={this.getResultsViewingEndTime} />

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

        <CategoryPanel getCategory={this.getCategory} categoryPanel={this.state.categoryPanel} />
        <VoteType
          setVoteTypeInParent={this.setVoteType}
          setPrivilegedVotersInParent={this.setPrivilegedVoters}
          voteType={this.state.voteType}
          privilegedVoters={this.state.privilegedVoters}
        />
        <Button onClick={this.handleCreateVote}>Submit</Button>
      </form>
    );
  }
}

export default CreateVoteForm;
