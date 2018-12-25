import React, { Component, Fragment } from "react";
import {
  ButtonGroup,
  Dropdown,
  DropdownButton,
  ListGroup,
  ListGroupItem,
  MenuItem,
  Panel,
  SelectCallback,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { fetchCategories } from "../../utils/eth";
import { BlockchainData, Category } from "../common/types";

export enum PrivacySetting {
  All = "all",
  Public = "public",
  Private = "private",
}

interface IPrivacyButtonsProps {
  chosenPrivacySetting: PrivacySetting;
  setchosenPrivacySettingInParent: (arg: PrivacySetting) => void;
}

export default class PrivacyButtons extends Component<IPrivacyButtonsProps> {
  constructor(props) {
    super(props);
  }

  public handleOnChange = (chosenPrivacySetting: PrivacySetting) => {
    this.props.setchosenPrivacySettingInParent(chosenPrivacySetting);
  };

  public render() {
    return (
      <ToggleButtonGroup
        type="radio"
        name="privacySetting"
        value={this.props.chosenPrivacySetting}
        onChange={this.handleOnChange}
      >
        <ToggleButton
          value={PrivacySetting.All}
          {...(this.props.chosenPrivacySetting === PrivacySetting.All ? { active: true } : null)}
        >
          {PrivacySetting.All}
        </ToggleButton>
        <ToggleButton
          value={PrivacySetting.Public}
          {...(this.props.chosenPrivacySetting === PrivacySetting.Public ? { active: true } : null)}
        >
          {PrivacySetting.Public}
        </ToggleButton>
        <ToggleButton
          value={PrivacySetting.Private}
          {...(this.props.chosenPrivacySetting === PrivacySetting.Private ? { active: true } : null)}
        >
          {PrivacySetting.Private}
        </ToggleButton>
      </ToggleButtonGroup>
    );
  }
}
