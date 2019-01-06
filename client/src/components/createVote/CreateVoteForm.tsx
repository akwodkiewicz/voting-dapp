import moment from "moment";
import React, { Component } from "react";
import { Button, Col, ControlLabel, FormControl, FormGroup, HelpBlock, InputGroup, Radio, Row } from "react-bootstrap";
import "react-datetime/css/react-datetime.css"; //tslint:disable-line
import { ethStrBytesLength, fetchCategories } from "../../utils/eth";
import { BlockchainData, VoteFormData } from "../../utils/types";
import AnswersList from "./AnswersList";
import CategoryPanel, { CategoryPanelType, ICategoryPanelProps } from "./CategoryPanel";
import VoteDates, { isVotingEndDateTimeValid, IVoteDatesProps, VotingExpiryOption } from "./VoteDates";
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
  privilegedAddressesValid: boolean;
  privilegedAddressesTouched: boolean;
  question: string;
  questionTouched: boolean;
  questionValid: boolean;
  typedAnswer: string;
  typedAnswerValid: boolean;
  typedAnswerTouched: boolean;
  voteDatesProps: IVoteDatesProps;
  voteType: VoteType;
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
      privilegedAddressesTouched: false,
      privilegedAddressesValid: false,
      privilegedVoters: [],
      question: "",
      questionTouched: false,
      questionValid: false,
      submitFailed: false,
      typedAnswer: "",
      typedAnswerTouched: false,
      typedAnswerValid: false,
      voteDatesProps: {
        endDateTime: moment().add(1, "h"), // prettier-ignore
        setEndDateTimeInParent: this.setVoteEnd,
        setVotingExpiryOptionInParent: this.setVotingExpiryOption,
        valid: true,
        votingExpiryOption: VotingExpiryOption.ThreeDays,
      },
      voteType: VoteType.Public,
    };
  }

  public componentDidMount = async () => {
    if (this.props.blockchainData) {
      await this.fetchCategoriesAndSetState();
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
            valid:
              state.categoryPanelProps.categoryPanel === CategoryPanelType.Existing ||
              this.isCategoryNameValid(props.formData.chosenCategory),
          },
          privilegedAddressesValid: this.arePrivilegedAddressesValid(props.formData.privilegedVoters),
          privilegedVoters: props.formData.privilegedVoters,
          question: props.formData.question,
          questionValid: this.isQuestionValid(props.formData.question),
          voteDatesProps: {
            ...state.voteDatesProps,
            endDateTime: props.formData.voteEndDateTime,
            votingExpiryOption: props.formData.votingExpiryOption,
          },
          voteType: props.formData.voteType,
        };
      });
    }
  };

  public componentDidUpdate = async () => {
    // If blockchainData was initialized after this component had mounted
    if (!this.state.isCategoriesListFetched && this.props.blockchainData) {
      console.log("refresh");
      await this.fetchCategoriesAndSetState();

      // Restore previously set data
      if (this.props.formData) {
        this.setState((state, props) => {
          return {
            categoryPanelProps: {
              ...state.categoryPanelProps,
              categoryPanel: props.formData.categoryPanel,
              chosenCategory: props.formData.chosenCategory,
              valid:
                state.categoryPanelProps.categoryPanel === CategoryPanelType.Existing ||
                this.isCategoryNameValid(props.formData.chosenCategory),
            },
          };
        });
      }
    }
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
              validationState={
                this.state.answersTouched && !this.state.answersValid
                  ? "error"
                  : this.state.typedAnswerTouched && !this.state.typedAnswerValid
                  ? "warning"
                  : null
              }
            >
              <ControlLabel>Answers</ControlLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Your answer here"
                  onChange={this.setTypedAnswer}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      this.setState({ typedAnswerTouched: true });
                      if (this.state.typedAnswerValid) {
                        this.addAnswer();
                      }
                    }
                  }}
                  value={this.state.typedAnswer}
                />{" "}
                <InputGroup.Button>
                  <Button onClick={this.addAnswer} disabled={this.state.typedAnswerValid ? null : true}>
                    Add answer
                  </Button>
                </InputGroup.Button>
              </InputGroup>
              {this.state.typedAnswerTouched &&
              !this.state.typedAnswerValid &&
              ethStrBytesLength(this.state.typedAnswer) > 32 ? (
                <HelpBlock>Answer cannot be larger than 32 bytes</HelpBlock>
              ) : null}

              {this.state.typedAnswerTouched && !this.state.typedAnswerValid && this.state.typedAnswer.length === 0 ? (
                <HelpBlock>Answer cannot be empty</HelpBlock>
              ) : null}

              {this.state.typedAnswerTouched &&
              !this.state.typedAnswerValid &&
              this.state.answers.indexOf(this.state.typedAnswer) !== -1 ? (
                <HelpBlock>Answers have to be unique</HelpBlock>
              ) : null}

              {this.state.answersTouched && !this.state.answersValid && this.state.answers.length < 2 ? (
                <HelpBlock>There must be at least 2 answers</HelpBlock>
              ) : null}
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
          endDateTime={this.state.voteDatesProps.endDateTime}
          votingExpiryOption={this.state.voteDatesProps.votingExpiryOption}
          valid={this.state.voteDatesProps.valid}
          setVotingExpiryOptionInParent={this.state.voteDatesProps.setVotingExpiryOptionInParent}
          setEndDateTimeInParent={this.state.voteDatesProps.setEndDateTimeInParent}
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
              privilegedAddressesValid={this.state.privilegedAddressesValid}
              privilegedAddressesTouched={this.state.privilegedAddressesTouched}
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

  private fetchCategoriesAndSetState = async () => {
    const categories = await fetchCategories(this.props.blockchainData);
    this.setState((state) => {
      return {
        categoryPanelProps: {
          ...state.categoryPanelProps,
          categoriesList: categories,
          categoryPanel: categories.length > 0 ? CategoryPanelType.Existing : CategoryPanelType.New,
          chosenCategory: categories.length > 0 ? categories[0].address : "",
          valid: categories.length > 0,
        },
        isCategoriesListFetched: true,
      };
    });
  };

  private setQuestion = (e) => {
    const question = e.currentTarget.value;
    this.setState(() => ({
      question,
      questionTouched: true,
      questionValid: this.isQuestionValid(question),
    }));
  };

  private setTypedAnswer = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    // Do not simplify this code!
    // Setting state using e.currentTarget.value directly generates "released/nullified synthetic event" warning
    // It's probably because setState does not execute synchronously
    const val = e.currentTarget.value;
    this.setState(() => ({
      typedAnswer: val,
      typedAnswerValid: this.isTypedAnswerValid(val),
    }));
  };

  private addAnswer = () => {
    // Adding answers doesn't "touch" them
    const answer = this.state.typedAnswer;
    const allAnswers = this.state.answers;
    if (!this.isTypedAnswerValid(answer)) {
      this.setState({
        typedAnswerValid: false,
      });
      return;
    }
    allAnswers.push(answer);

    this.setState(() => ({
      answers: allAnswers,
      answersValid: allAnswers.length >= 2,
      typedAnswer: "",
      typedAnswerTouched: false,
      typedAnswerValid: false,
    }));
  };

  private setAnswers = (answersFromChild) => {
    // Setting answers from child means erasing an answer -> "touch"
    this.setState(() => ({
      answers: answersFromChild,
      answersTouched: true,
      answersValid: answersFromChild.length >= 2,
    }));
  };

  private setVoteEnd = (dateTimeFromChild: moment.Moment) => {
    this.setState((state) => {
      return {
        voteDatesProps: {
          ...state.voteDatesProps,
          endDateTime: dateTimeFromChild,
          valid: isVotingEndDateTimeValid(dateTimeFromChild),
        },
      };
    });
  };

  private setVotingExpiryOption = (votingExpiryOptionFromChild: VotingExpiryOption) => {
    this.setState((state) => {
      return { voteDatesProps: { ...state.voteDatesProps, votingExpiryOption: votingExpiryOptionFromChild } };
    });
  };

  private changeCategoryPanelToExisting = (event: React.FormEvent<Radio & HTMLInputElement>) => {
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

  private changeCategoryPanelToNew = (event: React.FormEvent<Radio & HTMLInputElement>) => {
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

  private setCategory = (categoryFromChild: string) => {
    this.setState((state) => {
      return {
        categoryPanelProps: {
          ...state.categoryPanelProps,
          chosenCategory: categoryFromChild,
          touched: true,
          valid:
            state.categoryPanelProps.categoryPanel === CategoryPanelType.Existing ||
            this.isCategoryNameValid(categoryFromChild),
        },
      };
    });
  };

  private setVoteType = (voteTypeFromChild) => {
    this.setState(() => ({
      privilegedAddressesTouched: false,
      privilegedVoters: [],
      voteType: voteTypeFromChild,
    }));
  };

  private setPrivilegedVoters = (privilegedVotersFromChild: Voter[]) => {
    this.setState(() => ({
      privilegedAddressesTouched: true,
      privilegedAddressesValid: this.arePrivilegedAddressesValid(privilegedVotersFromChild),
      privilegedVoters: privilegedVotersFromChild,
    }));
  };

  private handleCreateVote = () => {
    // Touch all touchable inputs
    this.setState((state) => {
      return {
        answersTouched: true,
        categoryPanelProps: { ...state.categoryPanelProps, touched: true },
        privilegedAddressesTouched: true,
        questionTouched: true,
      };
    });

    // Validate answer list on submit
    if (!this.isAnswerListValid(this.state.answers)) {
      this.setState({
        answersValid: false,
      });
    }

    if (!isVotingEndDateTimeValid(this.state.voteDatesProps.endDateTime)) {
      this.setState((state) => {
        return {
          voteDatesProps: {
            ...state.voteDatesProps,
            valid: false,
          },
        };
      });
    }

    if (
      !this.state.questionValid ||
      !this.state.answersValid ||
      !this.state.voteDatesProps.valid ||
      !this.state.categoryPanelProps.valid ||
      (this.state.voteType === VoteType.Private && !this.state.privilegedAddressesValid)
    ) {
      this.setState({
        submitFailed: true,
      });
    } else {
      this.props.setSubmitData(this.state);
    }
  };

  private arePrivilegedAddressesValid = (addresses: Voter[]) => {
    return addresses.every((a) => this.props.blockchainData.web3.utils.isAddress(a));
  };

  private isTypedAnswerValid = (typedAnswer: string) => {
    return (
      typedAnswer.length > 0 && ethStrBytesLength(typedAnswer) <= 32 && this.state.answers.indexOf(typedAnswer) === -1
    );
  };

  private isAnswerListValid = (answerList: string[]) => {
    return answerList.length >= 2;
  };

  private isCategoryNameValid = (categoryName: string) => {
    return categoryName.length > 0 && ethStrBytesLength(categoryName) <= 32;
  };

  private isQuestionValid = (question: string) => {
    return question.length > 0;
  };
}
