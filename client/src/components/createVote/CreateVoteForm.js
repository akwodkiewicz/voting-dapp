import React, { Component } from "react";
import AnswersList from "./AnswersList";
import VoteType from "./VoteType";
import VoteDates from "./VoteDates";
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
  }

  async componentDidMount() {
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

  setQuestion = (e) => {
    const question = e.target.value;
    this.setState(() => ({
      question: question,
    }));
  };

  setTypedAnswer = (e) => {
    this.setState(() => ({
      typedAnswer: e.value,
    }));
  };

  setAnswers = (answersFromChild) => {
    this.setState(() => ({
      answers: answersFromChild,
    }));
  };

  setVoteEnd = (timeFromChild) => {
    this.setState(() => ({
      voteEndTime: timeFromChild,
    }));
  };

  setResultsViewingEndTime = (timeFromChild) => {
    this.setState(() => ({
      resultsViewingEndTime: timeFromChild,
    }));
  };

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

  changeCategoryPanel = () => {
    var categoryQuestion = document.getElementById("category-from-list");
    var categoryAnswer = categoryQuestion.checked ? "existing" : "new";

    this.setState(() => ({
      categoryPanel: categoryAnswer,
    }));
  };

  handleCreateVote = () => {
    this.props.setSubmitData(this.state);
  };

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
        <FormGroup controlId="question">
          <ControlLabel>Question</ControlLabel>
          <FormControl
            type="text"
            placeholder="Enter the voting question"
            onChange={this.setQuestion}
            value={this.state.question}
          />
        </FormGroup>

        <FormGroup controlId="answer">
          <ControlLabel>Answers</ControlLabel>
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

        <AnswersList setAnswers={this.setAnswers} answers={this.state.answers} />

        <VoteDates getVoteEnd={this.setVoteEnd} getResultsViewingEnd={this.setResultsViewingEndTime} />

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
