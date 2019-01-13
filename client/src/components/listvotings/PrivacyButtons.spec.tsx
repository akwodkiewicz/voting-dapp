import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import sinon from "sinon";
import { PrivacySetting } from "../../utils/enums";
import PrivacyButtons from "./PrivacyButtons";

describe("<PrivacyButtons/>", () => {
  let wrapper: ShallowWrapper;
  const chosenPrivacySetting = PrivacySetting.Public;
  const setChosenPrivacySettingInParentSpy = sinon.spy();

  before(() => {
    wrapper = shallow(
      <PrivacyButtons
        chosenPrivacySetting={chosenPrivacySetting}
        setchosenPrivacySettingInParent={setChosenPrivacySettingInParentSpy}
      />
    );
  });

  context("when chosen 'Public' setting", () => {
    it("only 'public' ToggleButton is active", () => {
      expect(
        wrapper
          .find(ToggleButton)
          .filter({ value: PrivacySetting.Public })
          .prop("active")
      ).to.be.true;

      wrapper
        .find(ToggleButton)
        .filterWhere((n) => n.prop("value") !== PrivacySetting.Public)
        .forEach((n) => {
          expect(n.prop("active")).to.be.undefined;
        });
    });

    context("and when user selects 'All' setting", () => {
      before(() => {
        wrapper
          .find(ToggleButtonGroup)
          .getElement()
          .props.onChange(PrivacySetting.All);
        wrapper.update();
      });

      it("calls #setChosenPrivacySettingInParent with 'All'", () => {
        expect(setChosenPrivacySettingInParentSpy.called).to.be.true;
        expect(setChosenPrivacySettingInParentSpy.calledOnceWith(PrivacySetting.All)).to.be.true;
      });

      context("and parent updates the chosenPrivacySetting prop to 'All'", () => {
        before(() => {
          wrapper.setProps({ chosenPrivacySetting: PrivacySetting.All });
        });

        it("has only 'All' ToggleButton active", () => {
          expect(
            wrapper
              .find(ToggleButton)
              .filter({ value: PrivacySetting.All })
              .prop("active")
          ).to.be.true;

          wrapper
            .find(ToggleButton)
            .filterWhere((n) => n.prop("value") !== PrivacySetting.All)
            .forEach((n) => {
              expect(n.prop("active")).to.be.undefined;
            });

          context("and when user selects 'Private' setting", () => {
            before(() => {
              wrapper
                .find(ToggleButtonGroup)
                .getElement()
                .props.onChange(PrivacySetting.Private);
              wrapper.update();
            });

            it("calls #setChosenPrivacySettingInParent with 'Private'", () => {
              expect(setChosenPrivacySettingInParentSpy.calledTwice).to.be.true;
              expect(setChosenPrivacySettingInParentSpy.calledWith(PrivacySetting.Private)).to.be.true;
            });

            context("and parent updates the chosenPrivacySetting prop to 'Private'", () => {
              before(() => {
                wrapper.setProps({ chosenPrivacySetting: PrivacySetting.Private });
              });

              it("has only 'Private' ToggleButton active", () => {
                expect(
                  wrapper
                    .find(ToggleButton)
                    .filter({ value: PrivacySetting.Private })
                    .prop("active")
                ).to.be.true;

                wrapper
                  .find(ToggleButton)
                  .filterWhere((n) => n.prop("value") !== PrivacySetting.Private)
                  .forEach((n) => {
                    expect(n.prop("active")).to.be.undefined;
                  });
              });
            });
          });
        });
      });
    });
  });
});
