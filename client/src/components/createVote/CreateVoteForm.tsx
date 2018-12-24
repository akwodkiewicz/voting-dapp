import moment from "moment";
import React, { Component } from "react";
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock, InputGroup, Radio } from "react-bootstrap";
import "react-datetime/css/react-datetime.css"; //tslint:disable-line
import * as CategoryContract from "../../contracts/CategoryContract.json";
import { BlockchainData, Category, ContractAddress, VoteFormData } from "../common/types";
import AnswersList from "./AnswersList";
import CategoryPanel, { CategoryPanelType } from "./CategoryPanel";
import VoteDates from "./VoteDates";
import VoteTypePanel, { Voter, VoteType } from "./VoteTypePanel";

interface ICreateVoteFormProps {
  formData: VoteFormData;
  blockchainData: BlockchainData;
  setSubmitData: (arg: ICreateVoteFormState) => void;
}

interface ICreateVoteFormState {
  answers: string[];
  categoriesList: Category[];
  categoryPanel: CategoryPanelType;
  chosenCategory: string | ContractAddress;
  isCategoriesListFetched: boolean;
  privilegedVoters: Voter[];
  question: string;
  resultsViewingEndTime: number;
  typedAnswer: string;
  voteEndTime: number;
  voteType: VoteType;
}

export default class CreateVoteForm extends Component<ICreateVoteFormProps, ICreateVoteFormState> {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      categoriesList: [],
      categoryPanel: CategoryPanelType.Existing,
      chosenCategory: null,
      isCategoriesListFetched: false,
      privilegedVoters: [],
      question: "",
      resultsViewingEndTime: moment()
        .add(3, "d")
        .set("h", 21)
        .set("m", 0)
        .utc()
        .unix(),
      typedAnswer: "",
      voteEndTime: moment()
        .add(3, "h")
        .utc()
        .unix(),
      voteType: VoteType.Public,
    };
  }

  public componentDidMount = async () => {
    if (this.props.blockchainData) {
      this.fetchCategories();
    }
    if (this.props.formData) {
      this.setState({
        answers: this.props.formData.answers,
        categoryPanel: this.props.formData.categoryPanel,
        chosenCategory: this.props.formData.chosenCategory,
        privilegedVoters: this.props.formData.privilegedVoters,
        question: this.props.formData.question,
        resultsViewingEndTime: this.props.formData.resultsViewingEndTime,
        voteEndTime: this.props.formData.voteEndTime,
        voteType: this.props.formData.voteType,
      });
    }
  };

  public componentDidUpdate = async () => {
    // If blockchainData was initialized after this component had mounted
    if (!this.state.isCategoriesListFetched && this.props.blockchainData) {
      this.fetchCategories();
    }
  };

  public fetchCategories = async () => {
    /** @type BlockchainData */
    const blockchainData = this.props.blockchainData;
    const web3 = blockchainData.web3;
    const managerInstance = blockchainData.manager;

    const categories = [];
    const numberOfCategories = parseInt(await managerInstance.methods.numberOfCategories().call(), 10);
    for (let index = 0; index < numberOfCategories; index++) {
      const categoryAddress = await managerInstance.methods.categoryContractsList(index).call();
      const categoryContract = new web3.eth.Contract(CategoryContract.abi, categoryAddress);
      const categoryName = web3.utils.toUtf8(await categoryContract.methods.categoryName().call());
      categories.push({ name: categoryName, address: categoryAddress });
    }

    this.setState({
      categoriesList: categories,
      chosenCategory: categories.length > 0 ? categories[0].address : null,
      isCategoriesListFetched: true,
    });

    if (this.props.formData) {
      this.setState({
        answers: this.props.formData.answers,
        categoryPanel: this.props.formData.categoryPanel,
        chosenCategory: this.props.formData.chosenCategory,
        privilegedVoters: this.props.formData.privilegedVoters,
        question: this.props.formData.question,
        resultsViewingEndTime: this.props.formData.resultsViewingEndTime,
        voteEndTime: this.props.formData.voteEndTime,
        voteType: this.props.formData.voteType,
      });
    }
  };

  public setQuestion = (e) => {
    const question = e.target.value;
    this.setState(() => ({
      question,
    }));
  };

  public setTypedAnswer = (e) => {
    this.setState(() => ({
      typedAnswer: e.value,
    }));
  };

  public setAnswers = (answersFromChild) => {
    this.setState(() => ({
      answers: answersFromChild,
    }));
  };

  public setVoteEnd = (timeFromChild) => {
    this.setState(() => ({
      voteEndTime: timeFromChild,
    }));
  };

  public setResultsViewingEndTime = (timeFromChild) => {
    this.setState(() => ({
      resultsViewingEndTime: timeFromChild,
    }));
  };

  public setCategory = (categoryFromChild) => {
    this.setState(() => ({
      chosenCategory: categoryFromChild,
    }));
  };

  public setVoteType = (voteTypeFromChild) => {
    this.setState(() => ({
      voteType: voteTypeFromChild,
    }));
  };

  public setPrivilegedVoters = (privilegedVotersFromChild) => {
    this.setState(() => ({
      privilegedVoters: privilegedVotersFromChild,
    }));
  };

  public changeCategoryPanel = () => {
    const existingCategoryButton = document.getElementById("category-from-list") as HTMLInputElement;
    const categoryType = existingCategoryButton.checked ? CategoryPanelType.Existing : CategoryPanelType.New;
    const chosenCategory =
      categoryType === CategoryPanelType.Existing && this.state.categoriesList.length > 0
        ? this.state.categoriesList[0].address
        : null;

    this.setState(() => ({
      categoryPanel: categoryType,
      chosenCategory,
    }));
  };

  public handleCreateVote = () => {
    this.props.setSubmitData(this.state);
  };

  public addAnswer = () => {
    const answer = (document.getElementById("answer") as HTMLInputElement).value;
    const allAnswers = this.state.answers;
    if (!answer || !answer.trim() || allAnswers.find((a) => a === answer)) {
      return;
    }
    allAnswers.push(answer);
    this.setState(() => ({
      answers: allAnswers,
      typedAnswer: "",
    }));
  };

  public render() {
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
          chosenCategory={this.state.chosenCategory}
        />

        <VoteTypePanel
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
