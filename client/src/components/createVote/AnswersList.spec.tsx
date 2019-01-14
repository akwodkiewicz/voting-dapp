import { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import sinon from "sinon";
import AnswersList from "./AnswersList";

describe("<AnswersList/>", () => {
  let component;
  const answers = ["a", "b"];
  const setAnswers = () => {};

  beforeEach(() => {
    component = mount(<AnswersList setAnswers={setAnswers} answers={answers} />);
  });
  it("should exist", () => {
    expect(component).to.exist;
    expect(component.props().answers).eq(answers);
    expect(component.props().answers[0]).eq("a");
    expect(component.props().answers[1]).eq("b");
    expect(component.props().setAnswers).eq(setAnswers);
  });

  it("first list element should be 'a'", () => {
    const firstListGroupItem = component.find(ListGroupItem).at(0);
    expect(firstListGroupItem.text()).eq("a");
  });

  it("second list element should be 'b'", () => {
    const firstListGroupItem = component.find(ListGroupItem).at(1);
    expect(firstListGroupItem.text()).eq("b");
  });

  it("list should have two elements", () => {
    const listGroupItems = component.find(ListGroupItem);
    expect(listGroupItems.children()).to.have.length(answers.length);
  });

  it("should remove element from list when clicked", () => {
    const firstListGroupItem = component.find(ListGroupItem).at(0);
    firstListGroupItem.simulate("click");
    expect(component.find(ListGroup).children()).to.have.length(1);
  });

  it("should call getAnswers when clicked", () => {
    const firstListGroupItem = component.find(ListGroupItem).at(0);
    const spy = sinon.spy(setAnswers);
    firstListGroupItem.simulate("click");
    expect(spy.calledOnce);
  });

  it("should call getAnswers when clicked", () => {
    const firstListGroupItem = component.find(ListGroupItem).at(0);
    const spy = sinon.spy(setAnswers);
    firstListGroupItem.simulate("click");
    expect(spy.calledOnce);
  });
});
