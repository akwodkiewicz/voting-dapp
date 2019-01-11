import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import sinon from "sinon";
import web3 from "web3";
import VotingContractAbi from "../../contracts/VotingContract.json";
import { VotingContract } from "../../typed-contracts/VotingContract";
import { VotingInfo } from "../../utils/types";
import ResultsModal from "./ResultsModal";
import ResultsPieChart from "./ResultsPieChart";

describe("<ResultsModal/>", () => {
  let wrapper: ShallowWrapper;
  const contract: VotingContract = new new web3().eth.Contract(VotingContractAbi.abi) as VotingContract;

  const votingInfo: VotingInfo = {
    answers: ["A", "B", "C"],
    categoryAddress: "0x0",
    hasUserVoted: false,
    isPrivate: false,
    isPrivileged: true,
    question: "Question?",
    resultsEndTime: 1,
    votingEndTime: 0,
  };

  context("when no one has voted", () => {
    beforeEach(() => {
      wrapper = shallow(
        <ResultsModal results={[]} show={true} voting={{ contract, info: votingInfo }} handleOnHide={sinon.fake()} />
      );
    });
    it("does not show a pie chart", () => {
      expect(wrapper.find(ResultsPieChart).exists()).to.be.false;
    });
  });

  context("when at least 1 person voted", () => {
    beforeEach(() => {
      wrapper = shallow(
        <ResultsModal
          results={["5", "3", "0"]}
          show={true}
          voting={{ contract, info: votingInfo }}
          handleOnHide={sinon.fake()}
        />
      );
    });
    it("does show a pie chart", () => {
      expect(wrapper.find(ResultsPieChart).exists()).to.be.true;
    });
  });
});
