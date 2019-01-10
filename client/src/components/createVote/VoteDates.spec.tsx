import { expect } from "chai";
import { mount, shallow } from "enzyme";
import moment, { Moment } from "moment";
import React from "react";
// import { Col, ControlLabel, FormGroup, HelpBlock, Row, , ToggleButtonGroup } from "react-bootstrap";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";

import Datetime from "react-datetime";
import sinon from "sinon";
import { /*Validation,*/ VotingExpiryOption } from "../../utils/enums";
import VoteDates from "./VoteDates";

describe("<VoteDates/>", () => {
  let component;
  let setEndDateTimeInParent;
  let setVotingExpiryOptionInParent;
  const endDateTime: moment.Moment = moment("2019-01-12T10:10:10");
  const votingExpiryOption: VotingExpiryOption = VotingExpiryOption.ThreeDays;
  const valid: boolean = true;

  beforeEach(() => {
    setEndDateTimeInParent = sinon.spy();
    setVotingExpiryOptionInParent = sinon.spy();
    component = shallow(
      <VoteDates
        endDateTime={endDateTime}
        votingExpiryOption={votingExpiryOption}
        valid={valid}
        setEndDateTimeInParent={setEndDateTimeInParent}
        setVotingExpiryOptionInParent={setVotingExpiryOptionInParent}
      />
    );
  });

  it("has Datetime components: with default date and default time", () => {
    const dateTimeComponents = component.find(Datetime);
    expect(dateTimeComponents).to.have.length(2);

    const datePicker = dateTimeComponents.at(0);
    const timePicker = dateTimeComponents.at(1);

    const dateValue = datePicker.props().value as Moment;
    const timeValue = timePicker.props().value as Moment;

    expect(dateValue).eq(endDateTime);
    expect(timeValue.hours()).eq(endDateTime.hours());
    expect(timeValue.minutes()).eq(endDateTime.minutes());
  });

  it("has votingExpiryOption with default first button selected", () => {
    const votingExpiryOptionComponent = component.find(ToggleButtonGroup).at(0);
    const toggleButtons = votingExpiryOptionComponent.children();
    expect(toggleButtons).to.have.length(3);
    const expectedSelectedButtonValue = toggleButtons.at(0).props().value;
    expect(votingExpiryOptionComponent.props().value).eq(expectedSelectedButtonValue);
  });

  context("Datetime date picker", () => {
    let datePicker;

    beforeEach(() => {
      datePicker = component.find(Datetime).at(0);
    });

    it("calls setEndDateTimeInParent on chage", () => {
      datePicker.simulate("change");
      expect(setEndDateTimeInParent.called).to.be.true;
    });

    it("date props changed after onChange method", () => {
      const newDate = endDateTime.add(2, "days");
      datePicker.simulate("change", { target: { value: newDate } });
      expect(datePicker.props().value.year()).eq(newDate.year());
      expect(datePicker.props().value.month()).eq(newDate.month());
      expect(datePicker.props().value.days()).eq(newDate.days());
    });
  });

  context("Datetime time picker", () => {
    let timePicker;

    beforeEach(() => {
      timePicker = component.find(Datetime).at(1);
    });

    it("calls setEndDateTimeInParent on chage", () => {
      timePicker.simulate("change");
      expect(setEndDateTimeInParent.called).to.be.true;
    });

    it("warning rendered when valid=false props is set", () => {
      component = mount(
        <VoteDates
          endDateTime={moment()}
          votingExpiryOption={votingExpiryOption}
          valid={false}
          setEndDateTimeInParent={setEndDateTimeInParent}
          setVotingExpiryOptionInParent={setVotingExpiryOptionInParent}
        />
      );

      const validationMessage = "Voting has to be active for at least 20s";
      const validationBlock = component.find("#validationMessage").at(0);
      expect(validationBlock.text()).eq(validationMessage);
    });

    it("time props changed after onChange method", () => {
      const newTime = endDateTime.add(2, "hours").subtract(2, "minutes");
      timePicker.simulate("change", { target: { value: newTime } });

      expect(timePicker.props().value.hours()).eq(newTime.hours());
      expect(timePicker.props().value.minutes()).eq(newTime.minutes());
    });
  });

  context("VotingExpiryOptions", () => {
    it("calls setVotingExpiryOptionInParent on change", () => {
      const votingExpiryOptionComponent = component.find(ToggleButtonGroup).at(0);
      votingExpiryOptionComponent.simulate("change");

      expect(setVotingExpiryOptionInParent.called).to.be.true;
    });
  });
});
