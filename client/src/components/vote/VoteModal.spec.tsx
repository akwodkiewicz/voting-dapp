import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { Button, Modal, Panel } from "react-bootstrap";
import sinon from "sinon";
import Web3 from "web3";

import VotingContractAbi from "../../contracts/VotingContract.json";
import { VotingContract } from "../../typed-contracts/VotingContract";
import { BlockchainData, VotingInfo } from "../../utils/types";
import VoteModal from "./VoteModal";

describe("<VoteModal/>", () => {
  let wrapper: ShallowWrapper;
  const contract: VotingContract = new new Web3().eth.Contract(VotingContractAbi.abi) as VotingContract;
  const blockchainData: BlockchainData = {
    accounts: [],
    manager: null,
    web3: new Web3(),
  };
  const answers = ["A", "B", "C", "D", "E"];
  const setChosenAnswerInParentSpy = sinon.spy();
  context("when user can vote", () => {
    const votingInfo: VotingInfo = {
      answers,
      categoryAddress: "0x0",
      hasUserVoted: false,
      isPrivate: false,
      isPrivileged: true,
      question: "Question?",
      resultsEndTime: 1,
      votingEndTime: 0,
    };

    beforeEach(() => {
      wrapper = shallow(
        <VoteModal
          blockchainData={blockchainData}
          chosenAnswer={null}
          voting={{ contract, info: votingInfo }}
          show={true}
          setChosenAnswerInParent={setChosenAnswerInParentSpy}
          requestDataRefresh={sinon.spy()}
          handleOnHide={sinon.spy()}
        />
      );
    });

    it("has an enabled button for every possible answer", () => {
      const rows = wrapper
        .find("#choice-panel")
        .find(Panel.Body)
        .children();

      expect(rows).to.have.lengthOf(answers.length);
      rows.forEach((r, i) => {
        expect(r.find("h4").render().text()).to.equal(answers[i]); // prettier-ignore
        expect(r.find(Button).prop("disabled")).to.be.false;
      });
    });

    it("has an enabled submit button", () => {
      expect(
        wrapper
          .find(Modal.Footer)
          .find(Button)
          .prop("disabled")
      ).to.be.false;
    });

    context("when user clicks on second answer (index=1)", () => {
      beforeEach(() => {
        const secondAnswerRow = wrapper
          .find("#choice-panel")
          .find(Panel.Body)
          .childAt(1);
        secondAnswerRow.find(Button).simulate("click");
      });
      it("calls setChosenAnswerInParent(1)", () => {
        expect(setChosenAnswerInParentSpy.calledOnceWith(1)).to.be.true;
      });
    });
  });

  context("when user has already voted", () => {
    const votingInfo: VotingInfo = {
      answers,
      categoryAddress: "0x0",
      hasUserVoted: true,
      isPrivate: false,
      isPrivileged: true,
      question: "Question?",
      resultsEndTime: 1,
      votingEndTime: 0,
    };

    beforeEach(() => {
      wrapper = shallow(
        <VoteModal
          blockchainData={blockchainData}
          chosenAnswer={null}
          voting={{ contract, info: votingInfo }}
          show={true}
          setChosenAnswerInParent={sinon.spy()}
          requestDataRefresh={sinon.spy()}
          handleOnHide={sinon.spy()}
        />
      );
    });

    it("has a disabled button for every possible answer", () => {
      const rows = wrapper
        .find("#choice-panel")
        .find(Panel.Body)
        .children();

      expect(rows).to.have.lengthOf(answers.length);
      rows.forEach((r, i) => {
        expect(r.find("h4").render().text()).to.equal(answers[i]); // prettier-ignore
        expect(r.find(Button).prop("disabled")).to.be.true;
      });
    });

    it("does not have a submit button", () => {
      expect(
        wrapper
          .find(Modal.Footer)
          .find(Button)
          .exists()
      ).to.be.false;
    });

    it("has a message 'You have already voted!'", () => {
      expect(
        wrapper
          .find(Modal.Footer)
          .find("h4")
          .render()
          .text()
      ).to.equal("You have already voted!");
    });
  });
});
