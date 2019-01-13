import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { Table } from "react-bootstrap";
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
    answers: ["A", "B", "C", "D", "E"],
    categoryAddress: "0x0",
    hasUserVoted: false,
    isPrivate: false,
    isPrivileged: true,
    question: "Question?",
    resultsEndTime: 1,
    votingEndTime: 0,
  };

  context("when no one has voted", () => {
    const results = ["0", "0", "0", "0", "0"];
    const percentage = ["0%", "0%", "0%", "0%", "0%"];

    beforeEach(() => {
      wrapper = shallow(
        <ResultsModal
          results={results}
          show={true}
          voting={{ contract, info: votingInfo }}
          handleOnHide={sinon.fake()}
        />
      );
    });

    it("does not show a pie chart", () => {
      expect(wrapper.find(ResultsPieChart).exists()).to.be.false;
    });

    it("has message about no votes", () => {
      expect(wrapper.containsMatchingElement(<h3>No one has voted!</h3>)).to.be.true;
    });

    it("has table with all answers, number of votes and correct percentages", () => {
      const table = wrapper.find(Table);
      expect(table.exists()).to.be.true;

      const rows = table.find("tbody").find("tr");
      expect(rows).to.have.lengthOf(votingInfo.answers.length);

      // prettier-ignore
      rows.forEach((r) => {
        const renderedAnswer = r.childAt(0).render().val();
        const idx = votingInfo.answers.indexOf(renderedAnswer);

        expect(renderedAnswer).to.equal(votingInfo.answers[idx]);
        expect(r.childAt(1).render().val()).to.equal(results[idx]);
        expect(r.childAt(2).render().val()).to.equal(percentage[idx]);
      });
    });
  });

  context("when at least 1 person voted", () => {
    const results = ["5", "3", "0", "0", "2"];
    const percentage = ["50%", "30%", "0%", "0%", "20%"];
    beforeEach(() => {
      wrapper = shallow(
        <ResultsModal
          results={results}
          show={true}
          voting={{ contract, info: votingInfo }}
          handleOnHide={sinon.fake()}
        />
      );
    });

    it("has a pie chart", () => {
      expect(wrapper.find(ResultsPieChart).exists()).to.be.true;
    });

    it("has no message about no votes", () => {
      expect(wrapper.containsMatchingElement(<h3>No one has voted!</h3>)).to.be.false;
    });

    it("has table with all answers, number of votes and correct percentages", () => {
      const table = wrapper.find(Table);
      expect(table.exists()).to.be.true;

      const rows = table.find("tbody").find("tr");
      expect(rows).to.have.lengthOf(votingInfo.answers.length);

      // prettier-ignore
      rows.forEach((r) => {
        const renderedAnswer = r.childAt(0).render().val();
        const idx = votingInfo.answers.indexOf(renderedAnswer);

        expect(renderedAnswer).to.equal(votingInfo.answers[idx]);
        expect(r.childAt(1).render().val()).to.equal(results[idx]);
        expect(r.childAt(2).render().val()).to.equal(percentage[idx]);
      });
    });
  });
});
