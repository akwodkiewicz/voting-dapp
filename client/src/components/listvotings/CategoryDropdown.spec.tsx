import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { DropdownButton, MenuItem } from "react-bootstrap";
import Loader from "react-loader-spinner";
import sinon, { SinonStub } from "sinon";
import Web3 from "web3";

import * as eth from "../../utils/eth";
import { BlockchainData } from "../../utils/types";
import CategoryDropdown from "./CategoryDropdown";

describe("<CategoryDropdown/>", () => {
  const blockchainData: BlockchainData = {
    accounts: [],
    manager: null,
    web3: new Web3(),
  };
  const categories = [{ address: "0x0", name: "CAT1" }, { address: "0x1", name: "Cat2" }];
  const chosenCategoryIndexTest = 1;

  context("when mounted (and blockchainData is null)", () => {
    let wrapper: ShallowWrapper;
    let fetchCategoriesStub: SinonStub;
    let setCategoriesInParentExpectation;
    let setChosenCategoryInParentExpectation;

    before(() => {
      fetchCategoriesStub = sinon.stub(eth, "fetchCategories").returns((async () => categories)());
    });

    after(() => {
      fetchCategoriesStub.restore();
    });

    beforeEach(() => {
      setCategoriesInParentExpectation = sinon
        .mock()
        .atLeast(1)
        .withExactArgs(categories);
      setChosenCategoryInParentExpectation = sinon
        .mock()
        .once()
        .withExactArgs(chosenCategoryIndexTest);
      wrapper = shallow(
        <CategoryDropdown
          blockchainData={null}
          categories={[]}
          chosenCategoryIndex={null}
          setCategoriesInParent={setCategoriesInParentExpectation}
          setChosenCategoryInParent={setChosenCategoryInParentExpectation}
        />
      );
    });

    it("has empty categories array", () => {
      expect((wrapper.instance() as CategoryDropdown).props.categories).to.be.empty;
    });

    it("shows loader instead of dropdown", () => {
      expect(wrapper.find(DropdownButton).exists()).to.be.false;
      expect(wrapper.find(Loader).exists()).to.be.true;
    });

    context("and blockchainData is passed from parent", () => {
      beforeEach(async () => {
        wrapper.setProps({ blockchainData });
        const prevProps = wrapper.instance().props;
        const prevState = wrapper.instance().state;
        await wrapper.instance().componentDidUpdate(prevProps, prevState, null);
      });

      it("cDU fetches categories from blockchain and sets them in parent", () => {
        expect(fetchCategoriesStub.called).to.be.true;
        setCategoriesInParentExpectation.verify();
      });

      it("areCategoriesFetched is true", () => {
        expect((wrapper.instance() as CategoryDropdown).state.areCategoriesFetched).to.be.true;
      });

      it("has dropdown instead of loader", () => {
        expect(wrapper.find(DropdownButton).exists()).to.be.true;
        expect(wrapper.find(Loader).exists()).to.be.false;
      });

      context("and parent passes down the categories prop", () => {
        beforeEach(() => {
          wrapper.setProps({ categories });
        });
        it("has a MenuItem for every category", () => {
          expect(wrapper.find(MenuItem)).to.have.lengthOf(categories.length);
          wrapper.find(MenuItem).forEach((n, i) => {
            expect(n.render().text()).to.equal(categories[i].name);
          });
        });

        context("and user chooses one category", () => {
          beforeEach(() => {
            wrapper
              .find(MenuItem)
              .filter({ eventKey: categories[chosenCategoryIndexTest].name })
              .simulate("select");
          });

          it("sets chosen category name as dropdown title", () => {
            expect(wrapper.find(DropdownButton).prop("title")).to.equal(categories[chosenCategoryIndexTest].name);
          });

          it("sets chosen category in parent", () => {
            setChosenCategoryInParentExpectation.verify();
          });
        });
      });
    });
  });
});
