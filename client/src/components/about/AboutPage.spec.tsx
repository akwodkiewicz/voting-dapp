import { expect } from "chai";
import { configure } from "enzyme";

/* Repeat those 2 lines in every *.spec.ts file */
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
/* -------------------------------------------- */

describe("It's not even a test, dummy", () => {
  it("does nothing", () => {
    expect(true).to.be.true;
  });
});
