import moment from "moment";
import React, { Component } from "react";
import { Button, Col, ControlLabel, FormControl, FormGroup, HelpBlock, InputGroup, Radio, Row } from "react-bootstrap";
import "react-datetime/css/react-datetime.css"; //tslint:disable-line
import * as CategoryContract from "../../contracts/CategoryContract.json";
import { BlockchainData, VoteFormData } from "../../utils/types";
import AnswersList from "./AnswersList";
import CategoryPanel, { CategoryPanelType, ICategoryPanelProps } from "./CategoryPanel";
import VoteDates, { VotingExpiryOption } from "./VoteDates";
import VoteTypePanel, { Voter, VoteType } from "./VoteTypePanel";

interface ICreateVoteFormProps {
  formData: VoteFormData;
  blockchainData: BlockchainData;
  setSubmitData: (arg: ICreateVoteFormState) => void;
}

export interface ICreateVoteFormState {
  answers: string[];
  answersTouched: boolean;
  answersValid: boolean;
  isCategoriesListFetched: boolean;
  privilegedVoters: Voter[];
  question: string;
  questionTouched: boolean;
  questionValid: boolean;
  typedAnswer: string;
  voteEndTime: number;
  voteType: VoteType;
  votingExpiryOption: VotingExpiryOption;
  categoryPanelProps: ICategoryPanelProps;
  submitFailed: boolean;
}

export default class CreateVoteForm extends Component<ICreateVoteFormProps, ICreateVoteFormState> {
  constructor(props) {
    super(props);

    this.state = {
      answers: [],
      answersTouched: false,
      answersValid: true,
      categoryPanelProps: {
        categoriesList: [],
        categoryPanel: CategoryPanelType.New,
        chosenCategory: "",
        setCategoryInParent: this.setCategory,
        touched: false,
        valid: false,
      },
      isCategoriesListFetched: false,
      privilegedVoters: [],
      question: "",
      questionTouched: false,
      questionValid: false,
      submitFailed: false,
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
      this.setState((state, props) => {
        return {
          answers: props.formData.answers,
          answersValid: this.isAnswerListValid(props.formData.answers),
          categoryPanelProps: {
            ...state.categoryPanelProps,
            categoryPanel: props.formData.categoryPanel,
            chosenCategory: props.formData.chosenCategory,
            valid: this.isCategoryValid(props.formData.chosenCategory),
          },
          privilegedVoters: props.formData.privilegedVoters,
          question: props.formData.question,
          questionValid: this.isQuestionValid(props.formData.question),
          voteEndTime: props.formData.voteEndTime,
          voteType: props.formData.voteType,
          votingExpiryOption: props.formData.votingExpiryOption,
        };
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

    this.setState((state) => {
      return {
        categoryPanelProps: {
          ...state.categoryPanelProps,
          categoriesList: categories,
          categoryPanel: categories.length > 0 ? CategoryPanelType.Existing : CategoryPanelType.New,
          chosenCategory: categories.length > 0 ? categories[0].address : "",
        },
        isCategoriesListFetched: true,
      };
    });

    if (this.props.formData) {
      this.setState((state, props) => {
        return {
          answers: this.props.formData.answers,
          categoryPanelProps: {
            ...state.categoryPanelProps,
            categoryPanel: props.formData.categoryPanel,
            chosenCategory: props.formData.chosenCategory,
          },
          privilegedVoters: this.props.formData.privilegedVoters,
          question: this.props.formData.question,
          voteEndTime: this.props.formData.voteEndTime,
          voteType: this.props.formData.voteType,
          votingExpiryOption: this.props.formData.votingExpiryOption,
        };
      });
    }
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
      answersTouched: true,
      answersValid: answersFromChild.length >= 2,
    }));
  };

  public setVoteEnd = (timeFromChild) => {
    this.setState(() => ({
      voteEndTime: timeFromChild,
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
    const chosenCategory =
      this.state.categoryPanelProps.categoriesList.length > 0
        ? this.state.categoryPanelProps.categoriesList[0].address
        : "";

    this.setState((state) => {
      return {
        categoryPanelProps: {
          ...state.categoryPanelProps,
          categoryPanel: CategoryPanelType.Existing,
          chosenCategory,
          valid: true,
        },
      };
    });
  };

  public changeCategoryPanelToNew = (event: React.FormEvent<Radio & HTMLInputElement>) => {
    if (!event.currentTarget.value) {
      return;
    }

    this.setState((state) => {
      return {
        categoryPanelProps: {
          ...state.categoryPanelProps,
          categoryPanel: CategoryPanelType.New,
          chosenCategory: "",
          valid: false,
        },
      };
    });
  };

  public addAnswer = () => {
    const answer = (document.getElementById("answer") as HTMLInputElement).value;
    const allAnswers = this.state.answers;
    if (!answer || !answer.trim() || allAnswers.find((a) => a === answer)) {
      return;
    }
    allAnswers.push(answer);

    if (allAnswers.length >= 2 && this.state.answersTouched) {
      this.setState({
        answersTouched: false,
      });
    }

    this.setState(() => ({
      answers: allAnswers,
      answersValid: allAnswers.length >= 2,
      typedAnswer: "",
    }));
  };

  public render() {
    return (
      <form>
        <Row>
          <Col md={12}>
            <FormGroup
              controlId="question"
              validationState={this.state.questionTouched ? (this.state.questionValid ? "success" : "error") : null}
            >
              <ControlLabel>Question</ControlLabel>
              <FormControl
                type="text"
                placeholder="E.g. 'Do you believe in life after love?'"
                onChange={this.setQuestion}
                value={this.state.question}
              />
              <FormControl.Feedback />
              {this.state.questionTouched && !this.state.questionValid ? (
                <HelpBlock>Question cannot be empty</HelpBlock>
              ) : null}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <FormGroup
              controlId="answer"
              validationState={this.state.answersTouched ? (this.state.answersValid ? null : "error") : null}
            >
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
                disabled={
                  this.state.isCategoriesListFetched && this.state.categoryPanelProps.categoriesList.length === 0
                }
                checked={this.state.categoryPanelProps.categoryPanel === "existing"}
                onChange={this.changeCategoryPanelToExisting}
                inline
              >
                Select existing category
              </Radio>
              <Radio
                name="categoryGroup"
                id="category-new"
                checked={this.state.categoryPanelProps.categoryPanel === "new"}
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
              categoryPanel={this.state.categoryPanelProps.categoryPanel}
              categoriesList={this.state.categoryPanelProps.categoriesList}
              chosenCategory={this.state.categoryPanelProps.chosenCategory}
              valid={this.state.categoryPanelProps.valid}
              touched={this.state.categoryPanelProps.touched}
              setCategoryInParent={this.state.categoryPanelProps.setCategoryInParent}
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

        <Row style={{ marginBottom: "10px" }}>
          <Col md={12}>
            <FormGroup validationState={this.state.submitFailed ? "error" : null}>
              <Button onClick={this.handleCreateVote}>Submit</Button>
              {this.state.submitFailed ? <HelpBlock>You need to fill the form correctly</HelpBlock> : null}
            </FormGroup>
          </Col>
        </Row>
      </form>
    );
  }

  private handleCreateVote = () => {
    this.setState((state) => {
      return {
        answersTouched: true,
        categoryPanelProps: { ...state.categoryPanelProps, touched: true },
        questionTouched: true,
      };
    });

    if (!this.isAnswerListValid(this.state.answers)) {
      this.setState({
        answersValid: false,
      });
    }

    if (!this.state.answersValid || !this.state.categoryPanelProps.valid || !this.state.questionValid) {
      this.setState({
        submitFailed: true,
      });
    } else {
      this.props.setSubmitData(this.state);
    }
  };

  private setQuestion = (e) => {
    const question = e.currentTarget.value;

    this.setState(() => ({
      question,
      questionTouched: true,
      questionValid: this.isQuestionValid(question),
    }));
  };

  private setCategory = (categoryFromChild: string) => {
    this.setState((state) => {
      return {
        categoryPanelProps: {
          ...state.categoryPanelProps,
          chosenCategory: categoryFromChild,
          touched: true,
          valid: this.isCategoryValid(categoryFromChild),
        },
      };
    });
  };

  private isAnswerListValid = (answerList: string[]) => {
    return answerList.length >= 2;
  };

  private isCategoryValid = (categoryName: string) => {
    return categoryName.length > 0 && this.props.blockchainData.web3.utils.fromUtf8(categoryName).length <= 32;
  };

  private isQuestionValid = (question: string) => {
    return question.length > 0;
  };

  private setVotingExpiryOption = (votingExpiryOptionFromChild: VotingExpiryOption) => {
    this.setState({ votingExpiryOption: votingExpiryOptionFromChild });
  };
}
