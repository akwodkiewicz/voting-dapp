import React, { Component, FormEvent } from "react";
import { ControlLabel, FormControl, FormGroup, Glyphicon, OverlayTrigger, Tooltip } from "react-bootstrap";
import { VoteType } from "./VoteTypePanel";

interface IPrivilegedAddressesProps {
  voteType: VoteType;
  textAreaValue: string;
  setPrivilegedAddressesInParent: (arg: string[]) => void;
}

export default class PrivilegedAddresses extends Component<IPrivilegedAddressesProps> {
  constructor(props) {
    super(props);
  }

  public saveAddresses = (e: FormEvent<FormControl & HTMLInputElement>) => {
    const addressesArray = e.currentTarget.value.split("\n");
    // TODO: validate each address
    this.props.setPrivilegedAddressesInParent(addressesArray);
  };

  public render() {
    if (this.props.voteType === "private") {
      return (
        <FormGroup>
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
        </FormGroup>
      );
    } else return null;
  }
}
