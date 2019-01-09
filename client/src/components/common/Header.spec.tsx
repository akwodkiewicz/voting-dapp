import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";

import Header from "./Header";

describe("<Header/>", () => {
  it("should have 4 NavItems", () => {
    const header = shallow(<Header block={0} />);
    expect(header.find("NavItem")).to.have.lengthOf(4);
  });

  context("when prop 'block' is equal to 0", () => {
    it("Nav should have 0 disabled items", () => {
      const header = shallow(<Header block={0} />);
      expect(
        header
          .find("Nav")
          .children()
          .filter("[disabled=true]")
      ).to.have.lengthOf(0);
    });
  });

  context("when prop 'block' is in range to [1-3]", () => {
    it("has Nav with 2 disabled items", () => {
      for (let i = 1; i <= 3; i++) {
        const header = shallow(<Header block={i} />);
        expect(
          header
            .find("Nav")
            .children()
            .filter("[disabled=true]")
        ).to.have.lengthOf(2);
      }
    });

    it("has '/createvote' and '/listvotings' links disabled", () => {
      for (let i = 1; i <= 3; i++) {
        const header = shallow(<Header block={i} />);
        expect(header.find("[to='/createvote']").prop("disabled")).to.be.true;
        expect(header.find("[to='/listvotings']").prop("disabled")).to.be.true;
      }
    });

    it("has index page and '/about' link enabled", () => {
      for (let i = 1; i <= 3; i++) {
        const header = shallow(<Header block={i} />);
        expect(header.find("[to='/']").prop("disabled")).to.be.false;
        expect(header.find("[to='/about']").prop("disabled")).to.be.false;
      }
    });
  });

  context("when prop 'block' is equal to 4", () => {
    it("Nav should have 4 disabled items", () => {
      const header = shallow(<Header block={4} />);
      expect(
        header
          .find("Nav")
          .children()
          .filter("[disabled=true]")
      ).to.have.lengthOf(4);
    });
  });
});
