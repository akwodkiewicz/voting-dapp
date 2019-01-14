import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { Alert, Button } from "react-bootstrap";
import sinon from "sinon";
import { ResultStatus } from "../../utils/enums";
import DisplayResult from "./DisplayResult";

describe("<DisplayResult/>", () => {
  let wrapper: ShallowWrapper;
  const txHash = "0x0";
  const softReset = sinon.spy();
  const hardReset = sinon.spy();

  context("Success alert", () => {
    beforeEach(() => {
      wrapper = shallow(
        <DisplayResult
          status={ResultStatus.Success}
          softReset={softReset}
          txHash={txHash}
          hardReset={hardReset}
          votingCreatedEventData={null}
        />
      );
    });

    it("renders success alert", () => {
      expect(wrapper.find(Alert).prop("bsStyle")).eq("success");
    });

    it("has callable create new form button", () => {
      wrapper.find(Button).simulate("click");
      expect(hardReset.called).to.be.true;
    });
  });

  context("Danger alert", () => {
    beforeEach(() => {
      wrapper = shallow(
        <DisplayResult
          status={ResultStatus.Failure}
          softReset={softReset}
          txHash={txHash}
          hardReset={hardReset}
          votingCreatedEventData={null}
        />
      );
    });

    it("renders danger alert", () => {
      expect(wrapper.find(Alert).prop("bsStyle")).eq("danger");
    });

    it("has callable go back to form button", () => {
      wrapper.find(Button).simulate("click");
      expect(softReset.called).to.be.true;
    });
  });
});
