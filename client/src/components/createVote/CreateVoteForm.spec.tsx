import { expect } from "chai";
import { mount, shallow } from "enzyme";
import moment from "moment";
import React from "react";
import { ListGroupItem, ToggleButtonGroup } from "react-bootstrap";
import Datetime from "react-datetime";
import sinon, { SinonStub } from "sinon";
import Web3 from "web3";
import { CategoryPanelType, VotingExpiryOption } from "../../utils/enums";
import * as eth from "../../utils/eth";
import { BlockchainData, Category } from "../../utils/types";
import { ICategoryPanelProps } from "./CategoryPanel";
import CreateVoteForm from "./CreateVoteForm";

describe("<CreateVoteForm/>", () => {
  let wrapper;
  const blockchainData: BlockchainData = {
    accounts: [],
    manager: null,
    web3: new Web3(),
  };
  let categories: Category[] = [
    {
      address: "0x1",
      name: "CategoryA",
    },
    {
      address: "0x2",
      name: "CategoryB",
    },
  ];
  const setSubmitData = sinon.spy();
  let fetchCategoriesStub: SinonStub;

  before(() => {
    fetchCategoriesStub = sinon.stub(eth, "fetchCategories").resolves(categories);
  });

  after(() => {
    fetchCategoriesStub.restore();
  });

  beforeEach(() => {
    wrapper = mount(<CreateVoteForm blockchainData={null} formData={null} setSubmitData={setSubmitData} />);
  });

  // tests fetchCategoriesAndSetState
  context("ComponentDidMount", async () => {
    beforeEach(async () => {
      wrapper = shallow(
        <CreateVoteForm blockchainData={blockchainData} formData={null} setSubmitData={setSubmitData} />
      );
      await (wrapper.instance() as CreateVoteForm).componentDidMount();
      expect(fetchCategoriesStub.called).to.be.true;
    });

    it("first form rendering (not returned from DisplayResult)", () => {
      expect(wrapper.state().categoryPanelProps.categoriesList).eq(categories);
      expect(wrapper.state().categoryPanelProps.categoryPanel).eq(CategoryPanelType.Existing);
      expect(wrapper.state().categoryPanelProps.chosenCategory).eq(categories[0].address);
      expect(wrapper.state().categoryPanelProps.categoriesList).deep.equal(categories);
      expect(wrapper.state().isCategoriesListFetched).to.be.true;
    });
  });

  context("Question section", () => {
    beforeEach(() => {
      wrapper = mount(<CreateVoteForm blockchainData={null} formData={null} setSubmitData={setSubmitData} />);
    });
    // tests private setQuestion and isQuestionValid\
    // https://github.com/airbnb/enzyme/issues/218#issuecomment-401397775
    // on why not to use simulate with event arguments
    it("properly changes state on question change", () => {
      const question = "Question";
      expect(wrapper.state().questionTouched).to.be.false;
      expect(wrapper.state().question).eq("");
      expect(wrapper.state().questionValid).to.be.false;

      const questionField = wrapper.find("#questionText").first();
      questionField.prop("onChange")({ currentTarget: { value: question } });

      expect(wrapper.state().questionTouched).to.be.true;
      expect(wrapper.state().question).eq(question);
      expect(wrapper.state().questionValid).to.be.true;
    });

    it("question field, left empty, renders 'cannot be empty' validation message", () => {
      const questionField = wrapper.find("#questionText").at(0);
      const expectedMessage = "Question cannot be empty";
      // before any action, there is no validation message
      let questionValidationMessage = wrapper.find("#questionValidationMessage");

      expect(questionValidationMessage).to.have.length(0);
      expect(wrapper.state().questionTouched).to.be.false;

      questionField.simulate("change");
      questionValidationMessage = wrapper.find("#questionValidationMessage").first();

      expect(wrapper.state().questionTouched).to.be.true;
      expect(wrapper.state().questionValid).to.be.false;
      expect(questionValidationMessage.text()).eq(expectedMessage);
    });
  });

  context("Answers section", () => {
    // tests isTypedAnswerValid 2x refresh
    it("has 'add answer' button disabled when answer is too long, enabled when it is correct", () => {
      wrapper = shallow(
        <CreateVoteForm blockchainData={blockchainData} formData={null} setSubmitData={setSubmitData} />
      );

      const tooLongAnswer = "123456789012345678901234567890123";
      const correctAnswer = "a";

      const answersInput = wrapper.find("#answersInput").first();
      const answersButton = wrapper.find("#answersSubmit").first();

      expect(answersButton.props().disabled).to.be.true;

      answersInput.prop("onChange")({ currentTarget: { value: correctAnswer } });
      expect(wrapper.state().typedAnswer).eq(correctAnswer);
      expect(wrapper.state().typedAnswerTouched).to.be.true;
      expect(wrapper.state().typedAnswerValid).to.be.true;

      const answersButton2 = wrapper.find("#answersSubmit").first();

      expect(answersButton2.props().disabled).to.be.false;

      answersInput.prop("onChange")({ currentTarget: { value: tooLongAnswer } });
      expect(answersButton.props().disabled).to.be.true;
    });

    // tests setTypedAnswer -> isTypedAnswerValid -> addAnswer
    it("adds 1 answer to the empty list, updates state and renders list", () => {
      // state before flow of functions
      expect(wrapper.state().answers).to.be.empty;
      expect(wrapper.state().answersValid).to.be.true;

      // in the beginning, make sure there are no answers
      let answers = wrapper.find(ListGroupItem);
      expect(answers).to.have.length(0);

      const answersInput = wrapper.find("#answersInput").first();
      const answersButton = wrapper.find("#answersSubmit").first();
      const typedAnswer = "test answer";

      answersInput.prop("onChange")({ currentTarget: { value: typedAnswer } });
      answersButton.simulate("click");

      answers = wrapper.find(ListGroupItem);
      expect(answers).to.have.length(1);
      expect(answers.first().text()).eq(typedAnswer);
      expect(wrapper.state().answers).deep.equal([typedAnswer]);
      expect(wrapper.state().answersValid).to.be.false;
    });

    it("should add 2 answers to the list, render it and update state accordingly to private functions", () => {
      // state before flow of functions
      expect(wrapper.state().answers).to.be.empty;
      expect(wrapper.state().answersValid).to.be.true;

      // in the beginning, make sure there are no answers
      let answers = wrapper.find(ListGroupItem);
      expect(answers).to.have.length(0);

      const answersInput = wrapper.find("#answersInput").first();
      const answersButton = wrapper.find("#answersSubmit").first();
      const typedAnswers = ["test answer", "test answer2"];

      answersInput.prop("onChange")({ currentTarget: { value: typedAnswers[0] } });
      answersButton.simulate("click");
      answersInput.prop("onChange")({ currentTarget: { value: typedAnswers[1] } });
      answersButton.simulate("click");

      answers = wrapper.find(ListGroupItem);
      expect(answers).to.have.length(2);
      expect(answers.at(0).text()).eq(typedAnswers[0]);
      expect(answers.at(1).text()).eq(typedAnswers[1]);
      expect(wrapper.state().answers).deep.equal(typedAnswers);
      expect(wrapper.state().answersValid).to.be.true;
    });

    it("should not let to add answer exact to an existing one", () => {
      const answersInput = wrapper.find("#answersInput").first();
      const answersButton = wrapper.find("#answersSubmit").first();
      const typedAnswer = "test answer";

      answersInput.prop("onChange")({ currentTarget: { value: typedAnswer } });
      answersButton.simulate("click");

      answersInput.prop("onChange")({ currentTarget: { value: typedAnswer } });
      answersButton.simulate("click");

      const answers = wrapper.find(ListGroupItem);
      expect(answers).to.have.length(1);
      expect(answers.first().text()).eq(typedAnswer);
      expect(wrapper.state().answers).deep.equal([typedAnswer]);
      expect(wrapper.state().answersValid).to.be.false;
    });

    // 6 refreshes
    it("renders proper validation messages", () => {
      wrapper = shallow(
        <CreateVoteForm blockchainData={blockchainData} formData={null} setSubmitData={setSubmitData} />
      );

      const goodAnswer = "good answer";
      const tooLongAnswer = "123456789012345678901234567890123";
      const tooLongAnswerMessage = "Answer cannot be larger than 32 bytes";
      const cannotBeEmptyMessage = "Answer cannot be empty";
      const answerNotUniqueMessage = "Answers have to be unique";
      const notEnoughAnswersMessage = "There must be at least 2 answers";

      let answerTooLongBlock = wrapper.find("#answerTooLong");
      let answerEmptyBlock = wrapper.find("#answerEmpty");
      let answerNotUniqueBlock = wrapper.find("#answerNotUnique");
      let notEnoughAnswersBlock = wrapper.find("#answerAtLeastTwo");

      expect(answerTooLongBlock).to.be.empty;
      expect(answerEmptyBlock).to.be.empty;
      expect(answerNotUniqueBlock).to.be.empty;
      expect(notEnoughAnswersBlock).to.be.empty;

      const answersInput = wrapper.find("#answersInput").first();
      const answersButton = wrapper.find("#answersSubmit").first();
      const submitButton = wrapper.find("#submit").first();

      // tooLong
      answersInput.prop("onChange")({ currentTarget: { value: tooLongAnswer } });
      answerTooLongBlock = wrapper.find("#answerTooLong").first();
      expect(answerTooLongBlock.render().text()).eq(tooLongAnswerMessage);

      // is empty
      answersInput.prop("onChange")({ currentTarget: { value: "" } });
      answerEmptyBlock = wrapper.find("#answerEmpty").first();
      expect(answerEmptyBlock.render().text()).eq(cannotBeEmptyMessage);

      // not unique
      answersInput.prop("onChange")({ currentTarget: { value: goodAnswer } });
      answersButton.simulate("click");
      answersInput.prop("onChange")({ currentTarget: { value: goodAnswer } });
      answerNotUniqueBlock = wrapper.find("#answerNotUnique").first();
      expect(answerNotUniqueBlock.render().text()).eq(answerNotUniqueMessage);

      // not enough answers
      submitButton.simulate("click");
      notEnoughAnswersBlock = wrapper.find("#answerAtLeastTwo").first();
      expect(notEnoughAnswersBlock.render().text()).eq(notEnoughAnswersMessage);
    });
  });

  context("Deadline section", () => {
    // tests setVoteEnd
    beforeEach(() => {
      wrapper = mount(<CreateVoteForm blockchainData={null} formData={null} setSubmitData={setSubmitData} />);
    });

    it("saves picked date to state", () => {
      const currentlySetDate = moment().add(1, "hours");
      const newDate = moment()
        .add(1, "days")
        .add(1, "months")
        .add(1, "years");

      expect(wrapper.state().voteDatesProps.endDateTime.year()).eq(currentlySetDate.year());
      expect(wrapper.state().voteDatesProps.endDateTime.month()).eq(currentlySetDate.month());
      expect(wrapper.state().voteDatesProps.endDateTime.day()).eq(currentlySetDate.day());
      expect(wrapper.state().voteDatesProps.valid).to.be.true;

      const datePicker = wrapper.find(Datetime).at(0);
      datePicker.prop("onChange")(newDate);

      expect(wrapper.state().voteDatesProps.endDateTime.year()).eq(newDate.year());
      expect(wrapper.state().voteDatesProps.endDateTime.month()).eq(newDate.month());
      expect(wrapper.state().voteDatesProps.endDateTime.day()).eq(newDate.day());
      expect(wrapper.state().voteDatesProps.valid).to.be.true;
    });

    it("saves picked time to state", () => {
      const currentlySetDate = moment().add(1, "hours");
      const newTime = moment()
        .add(2, "hours")
        .add(2, "minutes");

      expect(wrapper.state().voteDatesProps.endDateTime.hours()).eq(currentlySetDate.hours());
      expect(wrapper.state().voteDatesProps.endDateTime.minutes()).eq(currentlySetDate.minutes());

      const timePicker = wrapper.find(Datetime).at(1);
      timePicker.prop("onChange")(newTime);

      expect(wrapper.state().voteDatesProps.endDateTime.hours()).eq(newTime.hours());
      expect(wrapper.state().voteDatesProps.endDateTime.minutes()).eq(newTime.minutes());
    });

    // tests setVotingExpiryOption
    it("saves picked expiry option to state", () => {
      expect(wrapper.state().voteDatesProps.votingExpiryOption).eq(VotingExpiryOption.ThreeDays);
      const newExpiryOption = VotingExpiryOption.Month;
      const votingExpiryOptionComponent = wrapper.find(ToggleButtonGroup).at(0);
      votingExpiryOptionComponent.prop("onChange")(newExpiryOption);
      expect(wrapper.state().voteDatesProps.votingExpiryOption).eq(newExpiryOption);
    });
  });

  context("Category section", () => {
    beforeEach(() => {
      wrapper = shallow(
        <CreateVoteForm blockchainData={blockchainData} formData={null} setSubmitData={setSubmitData} />
      );
    });
    it("has 'Select existing category' button disabled due to no categories", () => {
      const newCategoryPanel: ICategoryPanelProps = {
        categoriesList: [],
        categoryPanel: CategoryPanelType.New,
        chosenCategory: "",
        newCategoryExists: false,
        setCategoryInParent: () => {},
        touched: false,
        valid: false,
      };
      wrapper.setState({ categoryPanelProps: newCategoryPanel, isCategoriesListFetched: true });
      const selectExistingButton = wrapper.find("#category-from-list").first();
      expect(wrapper.state().isCategoriesListFetched).to.be.true;
      expect(wrapper.state().categoryPanelProps.categoriesList.length).eq(0);
      expect(selectExistingButton.props().disabled).to.be.true;
      expect(selectExistingButton.props().checked).to.be.false;
    });

    it("has 'Select existing category' button enabled an selected when there are some fetched categories", () => {
      categories = [
        {
          address: "0x1",
          name: "CategoryA",
        },
        {
          address: "0x2",
          name: "CategoryB",
        },
      ];
      const newCategoryPanel: ICategoryPanelProps = {
        categoriesList: categories,
        categoryPanel: categories.length > 0 ? CategoryPanelType.Existing : CategoryPanelType.New,
        chosenCategory: categories.length > 0 ? categories[0].address : "",
        newCategoryExists: false,
        setCategoryInParent: () => {},
        touched: false,
        valid: categories.length > 0,
      };
      wrapper.setState({ categoryPanelProps: newCategoryPanel, isCategoriesListFetched: true });
      const selectExistingButton = wrapper.find("#category-from-list").first();
      expect(wrapper.state().isCategoriesListFetched).to.be.true;
      expect(wrapper.state().categoryPanelProps.categoryPanel).eq(CategoryPanelType.Existing);
      expect(wrapper.state().categoryPanelProps.categoriesList).eq(categories);
      expect(wrapper.state().categoryPanelProps.chosenCategory).eq(categories[0].address);
      expect(selectExistingButton.props().disabled).to.be.false;
      expect(selectExistingButton.props().checked).to.be.true;
    });

    // tests changeCategoryPanelToNew and changeCategoryPanelToExisting
    it("changes state on radio button switch based on selected option", () => {
      categories = [
        {
          address: "0x1",
          name: "CategoryA",
        },
        {
          address: "0x2",
          name: "CategoryB",
        },
      ];
      const newCategoryPanel: ICategoryPanelProps = {
        categoriesList: categories,
        categoryPanel: categories.length > 0 ? CategoryPanelType.Existing : CategoryPanelType.New,
        chosenCategory: categories.length > 0 ? categories[0].address : "",
        newCategoryExists: false,
        setCategoryInParent: () => {},
        touched: false,
        valid: categories.length > 0,
      };
      wrapper.setState({ categoryPanelProps: newCategoryPanel, isCategoriesListFetched: true });

      expect(wrapper.state().categoryPanelProps.categoryPanel).eq(CategoryPanelType.Existing);
      expect(wrapper.state().categoryPanelProps.chosenCategory).eq(categories[0].address);

      const newCategoryButton = wrapper.find("#category-new").first();
      // value cannot be empty for validation to pass
      newCategoryButton.prop("onChange")({ currentTarget: { value: " " } });
      expect(wrapper.state().categoryPanelProps.categoryPanel).eq(CategoryPanelType.New);
      expect(wrapper.state().categoryPanelProps.chosenCategory).eq("");

      const selectExistingButton = wrapper.find("#category-from-list").first();
      // value cannot be empty for validation to pass
      selectExistingButton.prop("onChange")({ currentTarget: { value: " " } });
      expect(wrapper.state().categoryPanelProps.categoryPanel).eq(CategoryPanelType.Existing);
      expect(wrapper.state().categoryPanelProps.chosenCategory).eq(categories[0].address);
    });
  });

  context("Vote type section", () => {
    beforeEach(() => {
      wrapper = mount(<CreateVoteForm blockchainData={null} formData={null} setSubmitData={setSubmitData} />);
    });
    it("has two radio buttons, Public selected on default", () => {
      const publicRadioButton = wrapper.find("#votePublic").at(0);
      const privateRadioButton = wrapper.find("#votePrivate").at(0);
      expect(publicRadioButton.props().checked).to.be.true;
      expect(privateRadioButton.props().checked).to.be.false;
    });
  });

  context("On submit", () => {
    beforeEach(() => {
      wrapper = shallow(<CreateVoteForm blockchainData={null} formData={null} setSubmitData={setSubmitData} />);
    });

    it("renders all validation messages due to empty form", () => {
      const submitButton = wrapper.find("#submit").first();
      submitButton.simulate("click");
      expect(wrapper.state().submitFailed).to.be.true;

      // question
      const questionValidationBlock = wrapper.find("#questionValidationMessage").first();
      const questionValidationMessage = "Question cannot be empty";
      expect(questionValidationBlock.render().text()).eq(questionValidationMessage);

      // answers
      const answersValidationBlock = wrapper.find("#answerAtLeastTwo").first();
      const answersValidationMessage = "There must be at least 2 answers";
      expect(answersValidationBlock.render().text()).eq(answersValidationMessage);

      // submit
      const submitValidationBlock = wrapper.find("#submitValidationMessage").first();
      const submitValidationMessage = "You need to fill the form correctly";
      expect(submitValidationBlock.render().text()).eq(submitValidationMessage);
    });
  });
});
