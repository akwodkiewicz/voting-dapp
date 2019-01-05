import React, { Component, FormEvent } from "react";
import { ControlLabel, FormControl, FormGroup, Glyphicon, HelpBlock, OverlayTrigger, Tooltip } from "react-bootstrap";
import { VoteType } from "./VoteTypePanel";

interface IPrivilegedAddressesProps {
  voteType: VoteType;
  touched: boolean;
  valid: boolean;
  textAreaValue: string;
  setPrivilegedAddressesInParent: (arg: string[]) => void;
}

export default class PrivilegedAddresses extends Component<IPrivilegedAddressesProps> {
  constructor(props) {
    super(props);
  }

  public saveAddresses = (e: FormEvent<FormControl & HTMLInputElement>) => {
    const addressesArray = (e.currentTarget.value as string).trim().split("\n");
    this.props.setPrivilegedAddressesInParent(addressesArray);
  };

  public render() {
    if (this.props.voteType === "private") {
      return (
        <FormGroup validationState={this.props.touched ? (this.props.valid ? null : "error") : null}>
          <ControlLabel>
            Privileged addresses
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip">
                  <p>Every address should be in a separate line</p>
                </Tooltip>
              }
            >
              <Glyphicon glyph="info-sign" style={{ padding: "0 0 3px 5px", verticalAlign: "middle" }} />
            </OverlayTrigger>
          </ControlLabel>

          <FormControl
            onChange={this.saveAddresses}
            componentClass="textarea"
            placeholder="Don't forget to paste your own address here (if you want to vote)!"
            value={this.props.textAreaValue}
          />
          {this.props.touched && !this.props.valid ? (
            this.props.textAreaValue === "" ? (
              <HelpBlock>You have to provide at least one address</HelpBlock>
            ) : (
              <HelpBlock>Addresses have to be valid keccak256 Ethereum addresses</HelpBlock>
            )
          ) : null}
        </FormGroup>
      );
    } else return null;
  }
}
