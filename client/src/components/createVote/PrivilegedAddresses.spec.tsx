import { expect } from "chai";
import { mount } from "enzyme";
import React from "react";
import sinon from "sinon";
import PrivilegedAddresses from "./PrivilegedAddresses";

describe("<PrivilegedAddresses/>", () => {
  let wrapper;
  const setPrivilegedAddressesInParent = sinon.spy();

  beforeEach(() => {
    wrapper = mount(
      <PrivilegedAddresses
        touched={false}
        valid={false}
        textAreaValue={""}
        setPrivilegedAddressesInParent={setPrivilegedAddressesInParent}
      />
    );
  });

  it("saves entered input on change", () => {
    const textArea = wrapper.find("#privilegedAddressesTextArea").at(0);
    textArea.simulate("change");
    expect(setPrivilegedAddressesInParent.calledOnce).to.be.true;
  });

  it("renders validation message on given props", () => {
    wrapper.setProps({ touched: true });
    const emptyAddressMessage = "You have to provide at least one address";
    const invalidInputMessage = "Addresses have to be valid keccak256 Ethereum addresses";
    const invalidInput = "a non address input";

    const emptyAddressBlock = wrapper.find("#validationZeroAddresses").at(0);
    let invalidAddressBlock = wrapper.find("#validationInvalidFormat").at(0);

    expect(emptyAddressBlock.text()).eq(emptyAddressMessage);
    wrapper.setProps({ textAreaValue: invalidInput });

    invalidAddressBlock = wrapper.find("#validationInvalidFormat").at(0);
    expect(invalidAddressBlock.text()).eq(invalidInputMessage);
  });

  // test reading from file + validations
  // xit("reads file with only good addresses and puts them to textarea", async () => {
  //   expect(wrapper.state().fileContentMismatch).to.be.false;
  //   const fileContents = "0x0752B4F663e46205B2FE3e030cC0C513254050A3\nNotAnAddress";
  //   const file = new Blob([fileContents], { type: "text/plain" });
  //   const fileUploader = wrapper.find("#privilegedAddressesFileLoader").first();
  //   await fileUploader.prop("onChange")({ target: { files: [file] } });

  //   expect(wrapper.state().fileContentMismatch).to.be.true;
  //   expect(wrapper.state().noAddressesInFile).to.be.false;
  // });
});
