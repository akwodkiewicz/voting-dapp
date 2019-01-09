import { expect } from "chai";
import { configure, mount } from "enzyme";
import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import sinon from "../../../../node_modules/sinon/pkg/sinon-esm.js";

import AnswersList from "./AnswersList";

import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

describe("<AnswersList/>", () => {
  let component;
  const answers = ["a", "b"];
  const setAnswers = () => {};

  beforeEach(() => {
    component = mount(<AnswersList setAnswers={setAnswers} answers={answers} />);
  });
  it("should exists", () => {
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
});
