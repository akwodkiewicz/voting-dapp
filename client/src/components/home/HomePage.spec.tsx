import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { Button, FormControl, HelpBlock } from "react-bootstrap";
import Web3 from "web3";

import { Validation } from "../../utils/enums";
import { BlockchainData } from "../../utils/types";
import NotFoundModal from "../vote/NotFoundModal";
import ResultsModal from "../vote/ResultsModal";
import VoteModal from "../vote/VoteModal";
import HomePage from "./HomePage";

describe("<HomePage/>", () => {
  let wrapper: ShallowWrapper;
  const blockchainData: BlockchainData = {
    accounts: [],
    manager: null,
    web3: new Web3(),
  };

  function hasValidationError() {
    expect(wrapper.find({ validationState: Validation.Error }).exists()).to.be.true;
    expect(wrapper.find({ validationState: Validation.Success }).exists()).to.be.false;
    expect(wrapper.find({ validationState: Validation.Warning }).exists()).to.be.false;
    expect(wrapper.find({ validationState: null }).exists()).to.be.false;
  }

  function pasteIntoSearchBar(text: string) {
    const input = wrapper.find(FormControl);
    input.simulate("focus");
    input.simulate("change", { target: { value: text } });
  }

  beforeEach(() => {
    wrapper = shallow(<HomePage blockchainData={blockchainData} />);
  });

  context("when mounted", () => {
    it("has enabled search button", () => {
      expect(wrapper.find(Button)).to.not.have.property("disabled");
    });

    it("has only one HelpBlock", () => {
      expect(wrapper.find(HelpBlock)).to.have.lengthOf(1);
    });

    it("has no explicit validation state", () => {
      expect(wrapper.find({ validationState: Validation.Success }).exists()).to.be.false;
      expect(wrapper.find({ validationState: Validation.Warning }).exists()).to.be.false;
      expect(wrapper.find({ validationState: Validation.Error }).exists()).to.be.false;
    });

    it("has no modals", () => {
      expect(wrapper.find(ResultsModal).exists()).to.be.false;
      expect(wrapper.find(VoteModal).exists()).to.be.false;
      expect(wrapper.find(NotFoundModal).exists()).to.be.false;
    });

    it("has empty search bar", () => {
      expect(wrapper.find(FormControl).prop("value")).to.be.empty;
    });
  });

  context("when user pastes whole", () => {
    context("valid mixed-case address", () => {
      const validMixedCaseAddr = "0xE263Eb83e1343193C7F6A9DB9576b1316E94fd27";

      beforeEach("paste address", () => {
        pasteIntoSearchBar(validMixedCaseAddr);
      });

      it("has the address in search bar", () => {
        expect(wrapper.find(FormControl).prop("value")).eq(validMixedCaseAddr);
      });

      it("has updated searchBoxState state", () => {
        expect(wrapper.state("searchBoxText")).eq(validMixedCaseAddr);
      });

      it("is validated successfully", () => {
        expect(wrapper.find({ validationState: Validation.Success }).exists()).to.be.true;
        expect(wrapper.find({ validationState: Validation.Warning }).exists()).to.be.false;
        expect(wrapper.find({ validationState: Validation.Error }).exists()).to.be.false;
        expect(wrapper.find({ validationState: null }).exists()).to.be.false;
      });

      it("has only one HelpBlock", () => {
        expect(wrapper.find(HelpBlock)).to.have.lengthOf(1);
      });

      it("has enabled search button", () => {
        expect(wrapper.find(Button).prop("disabled")).to.be.false;
      });
    });

    context("mixed-case address without '0x' prefix", () => {
      const noPrefixMixedCaseAddr = "E263Eb83e1343193C7F6A9DB9576b1316E94fd27";

      beforeEach("paste address", () => {
        pasteIntoSearchBar(noPrefixMixedCaseAddr);
      });

      it("has the address in search bar", () => {
        expect(wrapper.find(FormControl).prop("value")).eq(noPrefixMixedCaseAddr);
      });

      it("has updated searchBoxState state", () => {
        expect(wrapper.state("searchBoxText")).eq(noPrefixMixedCaseAddr);
      });

      it("has validation error", hasValidationError);

      it("has two HelpBlocks", () => {
        expect(wrapper.find(HelpBlock)).to.have.lengthOf(2);
      });

      it("has disabled search button", () => {
        expect(wrapper.find(Button).prop("disabled")).to.be.true;
      });

      it("has a second HelpBlock with no-prefix message", () => {
        expect(
          wrapper
            .find(HelpBlock)
            .at(1)
            .render()
            .text()
        ).to.match(/'0x' prefix/);
      });
    });
  });

  context("when user types", () => {
    context("just a '0'", () => {
      beforeEach(() => {
        pasteIntoSearchBar("0");
      });

      it("has a second HelpBlock with 42-char-addr message", () => {
        expect(
          wrapper
            .find(HelpBlock)
            .at(1)
            .render()
            .text()
        ).to.match(/42/);
      });

      it("has validation error", hasValidationError);
    });

    context("just a letter 'A'", () => {
      beforeEach(() => {
        pasteIntoSearchBar("A");
      });

      it("has a second HelpBlock with no-prefix message", () => {
        expect(
          wrapper
            .find(HelpBlock)
            .at(1)
            .render()
            .text()
        ).to.match(/'0x' prefix/);
      });

      it("has validation error", hasValidationError);
    });
  });
});
