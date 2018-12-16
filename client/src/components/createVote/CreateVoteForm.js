import React, { Component } from "react";
import AnswersList from "./AnswersList";
import VoteType from "./VoteType";
import VoteDates from "./VoteDates";
import FieldGroup from "../common/FieldGroup";
import CategoryPanel from "./CategoryPanel";
import "react-datetime/css/react-datetime.css";
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock } from "react-bootstrap";

import ManagerContract from "../../build/ManagerContract.json";
import CategoryContract from "../../build/CategoryContract.json";
import Web3 from "web3";

class CreateVoteForm extends Component {
  constructor() {
    super();

    this.state = {
      question: "",
      typedAnswer: "",
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
    this.addAnswer = this.addAnswer.bind(this);
    this.changeCategoryPanel = this.changeCategoryPanel.bind(this);
    this.handleCreateVote = this.handleCreateVote.bind(this);
  }

  async componentDidMount() {
    console.log("form componentDidMount");
    const accounts = await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const managerInstance = new web3.eth.Contract(ManagerContract.abi, "0x457D31982A783280F42e05e22493e47f8592358D", {
      from: accounts[0],
    });

    const numberOfCategories = await managerInstance.methods.numberOfCategories().call();
    let categories = [];
    for (let index = 0; index < numberOfCategories; index++) {
      const categoryAddress = await managerInstance.methods.categoryContractsList(index).call();
      const categoryContract = new web3.eth.Contract(CategoryContract.abi, categoryAddress);
      const categoryName = web3.utils.toUtf8(await categoryContract.methods.categoryName().call());
      categories.push(categoryName);
    }
    this.setState({
      categoriesList: categories,
    });

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

  setTypedAnswer = (e) => {
    this.setState(() => ({
      typedAnswer: e.value,
    }));
  };

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

  setCategory = (categoryFromChild) => {
    this.setState(() => ({
      category: categoryFromChild,
    }));
  };

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

  addAnswer = () => {
    var answer = document.getElementById("answer").value;
    var allAnswers = this.state.answers;
    if (allAnswers.includes(answer)) {
      return;
    }
    allAnswers.push(answer);
    this.setState(() => ({
      answers: allAnswers,
      typedAnswer: "",
    }));
  };

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
            <FormControl
              type="text"
              placeholder="Enter the answer"
              onChange={this.setTypedAnswer}
              value={this.state.typedAnswer}
            />
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
        <CategoryPanel
          setCategoryInParent={this.setCategory}
          categoryPanel={this.state.categoryPanel}
          categoriesList={this.state.categoriesList}
        />
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
