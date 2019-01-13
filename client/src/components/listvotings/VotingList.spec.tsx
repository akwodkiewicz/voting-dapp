import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import moment from "moment";
import React from "react";
import { ListGroupItem, Pagination } from "react-bootstrap";
import sinon from "sinon";
import Web3 from "web3";
import { PrivacySetting, VotingState } from "../../utils/enums";
import * as eth from "../../utils/eth";
import { BlockchainData, Voting } from "../../utils/types";
import VotingList from "./VotingList";

const votingsSmall: Voting[] = [
  {
    contract: null,
    info: {
      answers: ["African swallow", "European swallow"],
      categoryAddress: "0x0",
      hasUserVoted: false,
      isPrivate: false,
      isPrivileged: null,
      question: "What is the air speed velocity of an unladen swallow?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["A pleasant surprise", "A scary surprise"],
      categoryAddress: "0x1",
      hasUserVoted: false,
      isPrivate: true,
      isPrivileged: true,
      question: "What's in the box?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["What?!", "He's big", "He's bald"],
      categoryAddress: "0x2",
      hasUserVoted: false,
      isPrivate: false,
      isPrivileged: null,
      question: "What does Marcellus Wallace look like?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["It's over there", "The maze is not meant for you"],
      categoryAddress: "0x3",
      hasUserVoted: false,
      isPrivate: true,
      isPrivileged: false,
      question: "Where can I find the maze?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["African swallow", "European swallow"],
      categoryAddress: "0x4",
      hasUserVoted: false,
      isPrivate: false,
      isPrivileged: null,
      question: "What is the air speed velocity of an unladen swallow?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["A pleasant surprise", "A scary surprise"],
      categoryAddress: "0x5",
      hasUserVoted: false,
      isPrivate: true,
      isPrivileged: true,
      question: "What's in the box?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["What?!", "He's big", "He's bald"],
      categoryAddress: "0x6",
      hasUserVoted: false,
      isPrivate: false,
      isPrivileged: null,
      question: "What does Marcellus Wallace look like?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["It's over there", "The maze is not meant for you"],
      categoryAddress: "0x7",
      hasUserVoted: false,
      isPrivate: true,
      isPrivileged: false,
      question: "Where can I find the maze?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["African swallow", "European swallow"],
      categoryAddress: "0x8",
      hasUserVoted: false,
      isPrivate: false,
      isPrivileged: null,
      question: "What is the air speed velocity of an unladen swallow?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
  {
    contract: null,
    info: {
      answers: ["A pleasant surprise", "A scary surprise"],
      categoryAddress: "0x9",
      hasUserVoted: false,
      isPrivate: true,
      isPrivileged: true,
      question: "What's in the box?",
      resultsEndTime: moment()
        .add(2, "days")
        .unix(),
      votingEndTime: moment()
        .add(1, "days")
        .unix(),
    },
  },
];
function* publicVotingGenerator(numberOfVotings: number) {
  for (let i = 0; i < numberOfVotings; i++) {
    const voting: Voting = {
      contract: null,
      info: {
        answers: [`A${i}`, `B${i}`],
        categoryAddress: `0x${i}`,
        hasUserVoted: false,
        isPrivate: false,
        isPrivileged: null,
        question: `Question ${i}`,
        resultsEndTime: moment()
          .add(2, "days")
          .unix(),
        votingEndTime: moment()
          .add(1, "days")
          .unix(),
      },
    };
    yield voting;
  }
}
const votingsBig = [...publicVotingGenerator(99)];

const fetchVotingsStub = sinon.stub(eth, "fetchVotings").returns((async () => votingsSmall)());
const setVotingsInParentExpectation = sinon.mock().withExactArgs(votingsSmall);
const setChosenVotingAddressInParentExpectation = sinon.mock().withExactArgs("0x2");

describe("<VotingList/>", () => {
  const blockchainData: BlockchainData = {
    accounts: [],
    manager: null,
    web3: new Web3(),
  };
  let wrapper: ShallowWrapper;

  context("when mounted", () => {
    before(() => {
      wrapper = shallow(
        <VotingList
          blockchainData={blockchainData}
          chosenVotingAddress={null}
          category={null}
          displayInaccessibleVotings={null}
          filterPhase={""}
          votings={[]}
          privacySetting={PrivacySetting.All}
          votingState={VotingState.Active}
          isDataRefreshRequested={false}
          dataRefreshRequestHandled={sinon.spy()}
          setVotingsInParent={setVotingsInParentExpectation}
          setChosenVotingAddressInParent={setChosenVotingAddressInParentExpectation}
        />
      );
    });

    it("fetches votings", () => {
      expect(fetchVotingsStub.called).to.be.true;
    });

    it("sets votings in parent", () => {
      setVotingsInParentExpectation.verify();
    });

    it("sets internal state", () => {
      expect((wrapper.instance() as VotingList).state.areVotingsFetched).to.be.true;
    });

    context("when parents passes votings as prop", () => {
      before(() => {
        wrapper.setProps({ votings: votingsSmall });
      });

      it("renders votings", () => {
        expect(wrapper.find(ListGroupItem)).to.have.length.above(0);
      });

      context("when privacySetting == Public", () => {
        before(() => {
          wrapper.setProps({ privacySetting: PrivacySetting.Public });
        });

        it("shows public votings", () => {
          expect(
            wrapper
              .find(ListGroupItem)
              .filter(".public")
              .exists()
          ).to.be.true;
        });

        it("filters private votings", () => {
          expect(
            wrapper
              .find(ListGroupItem)
              .filter(".private")
              .exists()
          ).to.be.false;

          expect(
            wrapper
              .find(ListGroupItem)
              .filter(".inaccessible")
              .exists()
          ).to.be.false;
        });

        context("and displayInaccessibleVotings == true", () => {
          before(() => {
            wrapper.setProps({ displayInaccessibleVotings: true });
          });

          it("*still* does not show inaccessible votings", () => {
            expect(
              wrapper
                .find(ListGroupItem)
                .filter(".inaccessible")
                .exists()
            ).to.be.false;
          });
        });

        context("and displayInaccessibleVotings == false", () => {
          before(() => {
            wrapper.setProps({ displayInaccessibleVotings: false });
          });

          it("*still* does not show inaccessible votings", () => {
            expect(
              wrapper
                .find(ListGroupItem)
                .filter(".inaccessible")
                .exists()
            ).to.be.false;
          });
        });
      });

      context("when privacySetting == Private", () => {
        before(() => {
          wrapper.setProps({ privacySetting: PrivacySetting.Private });
        });

        it("filters public votings", () => {
          expect(
            wrapper
              .find(ListGroupItem)
              .filter(".public")
              .exists()
          ).to.be.false;
        });

        it("shows private votings", () => {
          expect(
            wrapper
              .find(ListGroupItem)
              .filter(".private")
              .exists()
          ).to.be.true;
        });

        context("and displayInaccessibleVotings == true", () => {
          before(() => {
            wrapper.setProps({ displayInaccessibleVotings: true });
          });

          it("shows inaccessible votings", () => {
            expect(
              wrapper
                .find(ListGroupItem)
                .filter(".inaccessible")
                .exists()
            ).to.be.true;
          });
        });

        context("and displayInaccessibleVotings == false", () => {
          before(() => {
            wrapper.setProps({ displayInaccessibleVotings: false });
          });

          it("filters inaccessible votings", () => {
            expect(
              wrapper
                .find(ListGroupItem)
                .filter(".inaccessible")
                .exists()
            ).to.be.false;
          });
        });
      });

      context("when privacySetting == All", () => {
        before(() => {
          wrapper.setProps({ privacySetting: PrivacySetting.All });
        });

        it("shows public votings", () => {
          expect(
            wrapper
              .find(ListGroupItem)
              .filter(".public")
              .exists()
          ).to.be.true;
        });

        it("shows private votings", () => {
          expect(
            wrapper
              .find(ListGroupItem)
              .filter(".private")
              .exists()
          ).to.be.true;
        });

        context("and displayInaccessibleVotings == true", () => {
          before(() => {
            wrapper.setProps({ displayInaccessibleVotings: true });
          });

          it("shows inaccessible votings", () => {
            expect(
              wrapper
                .find(ListGroupItem)
                .filter(".inaccessible")
                .exists()
            ).to.be.true;
          });
        });

        context("and displayInaccessibleVotings == false", () => {
          before(() => {
            wrapper.setProps({ displayInaccessibleVotings: false });
          });

          it("filters inaccessible votings", () => {
            expect(
              wrapper
                .find(ListGroupItem)
                .filter(".inaccessible")
                .exists()
            ).to.be.false;
          });
        });
      });
    });

    context("when there are fewer than 11 votings", () => {
      before(() => {
        wrapper.setProps({ votings: votingsSmall });
      });
      it("does not render Pagination component", () => {
        expect(wrapper.find(Pagination).exists()).to.be.false;
      });
    });

    context("when there are 99 votings", () => {
      before(() => {
        wrapper.setProps({ votings: votingsBig });
      });
      context("and none of them passes the privacy filter", () => {
        before(() => {
          wrapper.setProps({ privacySetting: PrivacySetting.Private });
        });
        it("does not render Pagination component", () => {
          expect(wrapper.find(Pagination).exists()).to.be.false;
        });
      });
      context("and they all pass the privacy filter", () => {
        before(() => {
          wrapper.setProps({ privacySetting: PrivacySetting.All });
        });
        it("renders 1st page of results", () => {
          expect(wrapper.state("activePageIndex")).to.equal(1);
        });
        it("renders 1st batch of 10 votings", () => {
          expect(wrapper.find(ListGroupItem)).to.have.lengthOf(10);
          wrapper.find(ListGroupItem).forEach((n, i) => {
            expect(n.render().text()).to.equal(`Question ${i}`);
          });
        });
        it("renders Pagination component", () => {
          expect(wrapper.find(Pagination).exists()).to.be.true;
        });
        it("has Pagination.First and Pagination.Prev buttons disabled", () => {
          expect(wrapper.find(Pagination.First).prop("disabled")).to.be.true;
          expect(wrapper.find(Pagination.Prev).prop("disabled")).to.be.true;
        });
        it("has Pagination.Item with text: 'Page 1/10'", () => {
          expect(
            wrapper
              .find(Pagination.Item)
              .render()
              .text()
          ).to.equal("Page 1/10");
        });
        it("has Pagination.Next and Pagination.Last buttons enabled", () => {
          expect(wrapper.find(Pagination.Next).prop("disabled")).to.be.false;
          expect(wrapper.find(Pagination.Last).prop("disabled")).to.be.false;
        });

        context("and when user clicks on 'Next'", () => {
          before(() => {
            wrapper.find(Pagination.Next).simulate("click");
          });
          it("moves them to 2nd page of results", () => {
            expect(wrapper.state("activePageIndex")).to.equal(2);
          });
          it("renders 2nd batch of 10 votings", () => {
            expect(wrapper.find(ListGroupItem)).to.have.lengthOf(10);
            wrapper.find(ListGroupItem).forEach((n, i) => {
              expect(n.render().text()).to.equal(`Question ${10 + i}`);
            });
          });
          it("has all Pagination buttons enabled", () => {
            expect(wrapper.find(Pagination.First).prop("disabled")).to.be.false;
            expect(wrapper.find(Pagination.Prev).prop("disabled")).to.be.false;
            expect(wrapper.find(Pagination.Next).prop("disabled")).to.be.false;
            expect(wrapper.find(Pagination.Last).prop("disabled")).to.be.false;
          });
          it("has Pagination.Item with text: 'Page 2/10'", () => {
            expect(
              wrapper
                .find(Pagination.Item)
                .render()
                .text()
            ).to.equal("Page 2/10");
          });

          context("and when user clicks on 'Last'", () => {
            before(() => {
              wrapper.find(Pagination.Last).simulate("click");
            });
            it("moves them to 10th page of results", () => {
              expect(wrapper.state("activePageIndex")).to.equal(10);
            });
            it("renders 10th batch of 9 votings", () => {
              expect(wrapper.find(ListGroupItem)).to.have.lengthOf(9);
              wrapper.find(ListGroupItem).forEach((n, i) => {
                expect(n.render().text()).to.equal(`Question ${90 + i}`);
              });
            });
            it("has Pagination.First and Pagination.Prev buttons enabled", () => {
              expect(wrapper.find(Pagination.First).prop("disabled")).to.be.false;
              expect(wrapper.find(Pagination.Prev).prop("disabled")).to.be.false;
            });
            it("has Pagination.Item with text: 'Page 10/10'", () => {
              expect(
                wrapper
                  .find(Pagination.Item)
                  .render()
                  .text()
              ).to.equal("Page 10/10");
            });
            it("has Pagination.Next and Pagination.Last buttons disabled", () => {
              expect(wrapper.find(Pagination.Next).prop("disabled")).to.be.true;
              expect(wrapper.find(Pagination.Last).prop("disabled")).to.be.true;
            });
          });
        });
      });
    });
  });
});
