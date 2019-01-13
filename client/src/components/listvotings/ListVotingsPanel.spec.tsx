import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { FormControl } from "react-bootstrap";
import Switch from "react-switch";
import Web3 from "web3";
import { VotingState } from "../../utils/enums";
import { BlockchainData, Category } from "../../utils/types";
import ResultsModal from "../vote/ResultsModal";
import VoteModal from "../vote/VoteModal";
import CategoryDropdown from "./CategoryDropdown";
import ListVotingsPanel from "./ListVotingsPanel";
import PrivacyButtons from "./PrivacyButtons";
import VotingList from "./VotingList";

describe("<ListVotingsPanel/>", () => {
  let wrapper: ShallowWrapper;
  const blockchainData: BlockchainData = {
    accounts: [],
    manager: null,
    web3: new Web3(),
  };
  const categories: Category[] = [
    {
      address: "0x0",
      name: "Cat1",
    },
    {
      address: "0x1",
      name: "Cat2",
    },
    {
      address: "0x2",
      name: "Cat3",
    },
  ];
  const chosenCategoryIdx = 1;
  context("when mounted", () => {
    before(() => {
      wrapper = shallow(
        <ListVotingsPanel blockchainData={blockchainData} title={"Active"} votingState={VotingState.Active} />
      );
    });
    it("renders CategoryDropdown and PrivacyButtons", () => {
      expect(wrapper.find(CategoryDropdown).exists()).to.be.true;
      expect(wrapper.find(PrivacyButtons).exists()).to.be.true;
    });
    it("does not render filter input and inaccessible votings toggle button", () => {
      expect(wrapper.find(FormControl).exists()).to.be.false;
      expect(wrapper.find(Switch).exists()).to.be.false;
    });
    it("does not render VotingList", () => {
      expect(wrapper.find(VotingList).exists()).to.be.false;
    });
    it("does not render modals", () => {
      expect(wrapper.find(ResultsModal).exists()).to.be.false;
      expect(wrapper.find(VoteModal).exists()).to.be.false;
    });

    context("when CategoryDropdown fetches categories", () => {
      before(() => {
        wrapper
          .find(CategoryDropdown)
          .getElement()
          .props.setCategoriesInParent(categories);
      });
      it("sets 'categories' state variable", () => {
        expect(wrapper.state("categories")).to.equal(categories);
      });

      context("when user chooses a category", () => {
        before(() => {
          wrapper
            .find(CategoryDropdown)
            .getElement()
            .props.setChosenCategoryInParent(chosenCategoryIdx);
          wrapper.update();
        });
        it("sets 'chosenCategoryIndex' state variable", () => {
          expect(wrapper.state("chosenCategoryIndex")).to.equal(chosenCategoryIdx);
        });
        it("renders VotingList", () => {
          expect(wrapper.find(VotingList).exists()).to.be.true;
        });
        it("renders filter input and inaccessible votings toggle button", () => {
          expect(wrapper.find(FormControl).exists()).to.be.true;
          expect(wrapper.find(Switch).exists()).to.be.true;
        });

        it("does not render modals", () => {
          expect(wrapper.find(ResultsModal).exists()).to.be.false;
          expect(wrapper.find(VoteModal).exists()).to.be.false;
        });

        context("when user chooses a category", () => {
          before(() => {
            wrapper
              .find(CategoryDropdown)
              .getElement()
              .props.setChosenCategoryInParent(chosenCategoryIdx);
            wrapper.update();
          });
          it("sets 'chosenCategoryIndex' state variable", () => {
            expect(wrapper.state("chosenCategoryIndex")).to.equal(chosenCategoryIdx);
          });
          it("renders VotingList", () => {
            expect(wrapper.find(VotingList).exists()).to.be.true;
          });
          it("renders filter input and inaccessible votings toggle button", () => {
            expect(wrapper.find(FormControl).exists()).to.be.true;
            expect(wrapper.find(Switch).exists()).to.be.true;
          });

          it("does not render modals", () => {
            expect(wrapper.find(ResultsModal).exists()).to.be.false;
            expect(wrapper.find(VoteModal).exists()).to.be.false;
          });
        });
      });
    });
  });
});
