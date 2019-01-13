import { expect } from "chai";
import { mount, shallow } from "enzyme";
import React from "react";
import { ListGroupItem } from "react-bootstrap";
import sinon from "sinon";
import Web3 from "web3";
import { BlockchainData } from "../../utils/types";
import CreateVoteForm from "./CreateVoteForm";

describe("<CreateVoteForm/>", () => {
  let wrapper;
  let blockchainData: BlockchainData = {
    accounts: [],
    manager: null,
    web3: new Web3(),
  };
  blockchainData = null;
  const setSubmitData = sinon.spy();

  beforeEach(() => {
    wrapper = mount(<CreateVoteForm blockchainData={blockchainData} formData={null} setSubmitData={setSubmitData} />);
  });

  context("Question section", () => {
    // tests private setQuestion and isQuestionValid\
    // https://github.com/airbnb/enzyme/issues/218#issuecomment-401397775 on why not to use simulate
    it("properly changes state on question change", () => {
      wrapper = mount(<CreateVoteForm blockchainData={blockchainData} formData={null} setSubmitData={setSubmitData} />);
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
    // tests isTypedAnswerValid
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
});
