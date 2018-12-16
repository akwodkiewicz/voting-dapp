import React, { Component } from "react";
import AnswersList from "./AnswersList";
import VoteType from "./VoteType";
import VoteDates from "./VoteDates";
import CategoryPanel from "./CategoryPanel";
import "react-datetime/css/react-datetime.css";
import { FormGroup, FormControl, ControlLabel, Button, Radio, InputGroup, HelpBlock } from "react-bootstrap";
import moment from "moment";
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
      voteEndTime: moment()
        .add(3, "h")
        .utc()
        .unix(),
      resultsViewingEndTime: moment()
        .add(3, "d")
        .set("h", 21)
        .set("m", 0)
        .utc()
        .unix(),
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
    if (numberOfCategories.length > 0) {
      let categories = [];
      for (let index = 0; index < numberOfCategories; index++) {
        const categoryAddress = await managerInstance.methods.categoryContractsList(index).call();
        const categoryContract = new web3.eth.Contract(CategoryContract.abi, categoryAddress);
        const categoryName = web3.utils.toUtf8(await categoryContract.methods.categoryName().call());
        categories.push(categoryName);
      }
      this.setState({
        categoriesList: categories,
        category: categories[0],
      });
    }

    if (this.props.formData) {
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
      category: "",
    }));
  };

  handleCreateVote = () => {
    this.props.setSubmitData(this.state);
  };

  addAnswer = () => {
    const answer = document.getElementById("answer").value;
    const allAnswers = this.state.answers;
    if (!answer || !answer.trim() || allAnswers.includes(answer)) {
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
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  this.addAnswer();
                }
              }}
              value={this.state.typedAnswer}
            />
            <InputGroup.Button>
              <Button onClick={this.addAnswer}>Add answer</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>

        <AnswersList setAnswers={this.setAnswers} answers={this.state.answers} />

        <VoteDates
          getVoteEnd={this.setVoteEnd}
          getResultsViewingEnd={this.setResultsViewingEndTime}
          voteEndDateTime={moment(this.state.voteEndTime, "X")}
          resultsEndDateTime={moment(this.state.resultsViewingEndTime, "X")}
        />

        <FormGroup onChange={this.changeCategoryPanel}>
          <ControlLabel>Category</ControlLabel>
          <HelpBlock>Select existing category from the list or create a new one.</HelpBlock>
          <Radio name="categoryGroup" id="category-from-list" checked={this.state.categoryPanel === "existing"} inline>
            Select existing category
          </Radio>
          <Radio name="categoryGroup" id="category-new" checked={this.state.categoryPanel === "new"} inline>
            Create new category
          </Radio>
        </FormGroup>

        <CategoryPanel
          setCategoryInParent={this.setCategory}
          categoryPanel={this.state.categoryPanel}
          categoriesList={this.state.categoriesList}
          categoryName={this.state.category}
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
