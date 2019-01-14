import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";
import { CategoryPanelType } from "../../utils/enums";
import { Category } from "../../utils/types";
import CategoryPanel from "./CategoryPanel";

describe("<CategoryPanel/>", () => {
  const setCategoryInParent = sinon.spy();
  const categories: Category[] = [
    {
      address: "0x1",
      name: "CategoryA",
    },
    {
      address: "0x2",
      name: "CategoryB",
    },
  ];
  let wrapper;

  context("Existing categories list", () => {
    it("renders select for existing categories", () => {
      wrapper = shallow(
        <CategoryPanel
          categoriesList={categories}
          categoryPanel={CategoryPanelType.Existing}
          chosenCategory={categories[0].address}
          newCategoryExists={false}
          setCategoryInParent={setCategoryInParent}
          touched={false}
          valid={false}
        />
      );

      const categoryPanel = wrapper.find("#categoryPanelExisting").at(0);
      const listOptions = wrapper.find("option");
      expect(categoryPanel.props().value).eq(categories[0].address);
      expect(listOptions).to.have.length(2);
      expect(listOptions.at(0).text()).eq(categories[0].name);
      expect(listOptions.at(1).text()).eq(categories[1].name);
    });

    it("renders infromation about fetching categories", () => {
      wrapper = shallow(
        <CategoryPanel
          categoriesList={null}
          categoryPanel={CategoryPanelType.Existing}
          chosenCategory={""}
          newCategoryExists={false}
          setCategoryInParent={setCategoryInParent}
          touched={false}
          valid={false}
        />
      );

      const loadingMessage = "Loading categories from blockchain...";
      const categoryPanel = wrapper.find("#categoryPanelFetchingMessage");
      expect(categoryPanel.text()).eq(loadingMessage);
    });

    it("calls setCategoryInParent onChange", () => {
      wrapper = shallow(
        <CategoryPanel
          categoriesList={categories}
          categoryPanel={CategoryPanelType.Existing}
          chosenCategory={categories[0].address}
          newCategoryExists={false}
          setCategoryInParent={setCategoryInParent}
          touched={false}
          valid={false}
        />
      );

      const categoryPanel = wrapper.find("#categoryPanelExisting");
      categoryPanel.prop("onChange")({ target: { value: categories[1] } });
      expect(setCategoryInParent.calledOnce).to.be.true;
    });
  });

  context("New category input", () => {
    it("renders proper validation messsages", () => {
      wrapper = shallow(
        <CategoryPanel
          categoriesList={[]}
          categoryPanel={CategoryPanelType.New}
          chosenCategory=""
          newCategoryExists={false}
          setCategoryInParent={setCategoryInParent}
          touched={false}
          valid={false}
        />
      );

      let emptyAddressBlock = wrapper.find("#categoryPanelValidationEmptyMessage");
      let tooLongAddressBlock = wrapper.find("#categoryPanelValidationTooLongMessage");

      const emptyAddressMessage = "Category name cannot be empty";
      const tooLongAddressMessage = "Category name cannot be larger than 32 bytes";
      const tooLongCategory = "123456789012345678901234567890123";

      expect(emptyAddressBlock).to.be.empty;
      expect(tooLongAddressBlock).to.be.empty;

      wrapper.setProps({ touched: true, valid: false, chosenCategory: "" });
      emptyAddressBlock = wrapper.find("#categoryPanelValidationEmptyMessage").first();
      expect(emptyAddressBlock.render().text()).eq(emptyAddressMessage);

      wrapper.setProps({ chosenCategory: tooLongCategory });
      tooLongAddressBlock = wrapper.find("#categoryPanelValidationTooLongMessage").first();
      expect(tooLongAddressBlock.render().text()).eq(tooLongAddressMessage);
    });
  });
});
