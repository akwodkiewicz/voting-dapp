import moment from "moment";
import React, { Component } from "react";
import { Button, Col, ControlLabel, FormControl, FormGroup, HelpBlock, InputGroup, Radio, Row } from "react-bootstrap";
import "react-datetime/css/react-datetime.css"; //tslint:disable-line
import * as CategoryContract from "../../contracts/CategoryContract.json";
import { BlockchainData, Category, ContractAddress, VoteFormData } from "../../utils/types";
import AnswersList from "./AnswersList";
import CategoryPanel, { CategoryPanelType } from "./CategoryPanel";
import VoteDates, { VotingExpiryOption } from "./VoteDates";
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
  typedAnswer: string;
  voteEndTime: number;
  voteType: VoteType;
  votingExpiryOption: VotingExpiryOption;
}

export default class CreateVoteForm extends Component<ICreateVoteFormProps, ICreateVoteFormState> {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      categoriesList: [],
      categoryPanel: CategoryPanelType.New,
      chosenCategory: null,
      isCategoriesListFetched: false,
      privilegedVoters: [],
      question: "",
      typedAnswer: "",
      voteEndTime: moment()
        .add(3, "h")
        .utc()
        .unix(),
      voteType: VoteType.Public,
      votingExpiryOption: VotingExpiryOption.ThreeDays,
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
        voteEndTime: this.props.formData.voteEndTime,
        voteType: this.props.formData.voteType,
        votingExpiryOption: this.props.formData.votingExpiryOption,
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
      categoryPanel: categories.length > 0 ? CategoryPanelType.Existing : CategoryPanelType.New,
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
        voteEndTime: this.props.formData.voteEndTime,
        voteType: this.props.formData.voteType,
        votingExpiryOption: this.props.formData.votingExpiryOption,
      });
    }
  };

  public setQuestion = (e) => {
    const question = e.target.value;
    this.setState(() => ({
      question,
    }));
  };

  public setTypedAnswer = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    // Do not simplify this code!
    // Setting state using e.currentTarget.value directly generates "released/nullified synthetic event" warning
    const val = e.currentTarget.value;
    this.setState(() => ({
      typedAnswer: val,
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

  public changeCategoryPanelToExisting = (event: React.FormEvent<Radio & HTMLInputElement>) => {
    if (!event.currentTarget.value) {
      return;
    }
    const chosenCategory = this.state.categoriesList.length > 0 ? this.state.categoriesList[0].address : null;

    this.setState(() => ({
      categoryPanel: CategoryPanelType.Existing,
      chosenCategory,
    }));
  };

  public changeCategoryPanelToNew = (event: React.FormEvent<Radio & HTMLInputElement>) => {
    if (!event.currentTarget.value) {
      return;
    }
    this.setState(() => ({
      categoryPanel: CategoryPanelType.New,
      chosenCategory: null,
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
        <Row>
          <Col md={12}>
            <FormGroup controlId="question">
              <ControlLabel>Question</ControlLabel>
              <FormControl
                type="text"
                placeholder="E.g. 'Do you believe in life after love?'"
                onChange={this.setQuestion}
                value={this.state.question}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <FormGroup controlId="answer">
              <ControlLabel>Answers</ControlLabel>
              <HelpBlock>There must be at least 2 answers.</HelpBlock>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Your answer here"
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
          </Col>
        </Row>

        {this.state.answers.length !== 0 ? (
          <Row>
            <Col md={12}>
              <AnswersList setAnswers={this.setAnswers} answers={this.state.answers} />
            </Col>
          </Row>
        ) : null}

        <VoteDates
          getVoteEnd={this.setVoteEnd}
          voteEndDateTime={moment(this.state.voteEndTime, "X")}
          votingExpiryOption={this.state.votingExpiryOption}
          setVotingExpiryOptionInParent={this.setVotingExpiryOption}
        />

        <Row>
          <Col md={12}>
            <FormGroup>
              <ControlLabel>Category</ControlLabel>
              <HelpBlock>Select an existing category from the list or create a new one.</HelpBlock>
              <Radio
                name="categoryGroup"
                id="category-from-list"
                disabled={this.state.isCategoriesListFetched && this.state.categoriesList.length === 0}
                checked={this.state.categoryPanel === "existing"}
                onChange={this.changeCategoryPanelToExisting}
                inline
              >
                Select existing category
              </Radio>
              <Radio
                name="categoryGroup"
                id="category-new"
                checked={this.state.categoryPanel === "new"}
                onChange={this.changeCategoryPanelToNew}
                inline
              >
                Create new category
              </Radio>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <CategoryPanel
              setCategoryInParent={this.setCategory}
              categoryPanel={this.state.categoryPanel}
              categoriesList={this.state.categoriesList}
              chosenCategory={this.state.chosenCategory}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <VoteTypePanel
              setVoteTypeInParent={this.setVoteType}
              setPrivilegedVotersInParent={this.setPrivilegedVoters}
              voteType={this.state.voteType}
              privilegedVoters={this.state.privilegedVoters}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Button onClick={this.handleCreateVote}>Submit</Button>
          </Col>
        </Row>
      </form>
    );
  }

  private setVotingExpiryOption = (votingExpiryOptionFromChild: VotingExpiryOption) => {
    this.setState({ votingExpiryOption: votingExpiryOptionFromChild });
  };
}
