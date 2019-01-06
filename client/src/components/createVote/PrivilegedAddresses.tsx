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
          <HelpBlock>
            Manually enter addresses below or load them from the <span style={{ fontStyle: "italic" }}>.txt</span> file.
          </HelpBlock>
          <FormControl
            type="file"
            accept=".txt"
            onChange={this.loadAddressesFromFile}
            label="File"
            style={{ marginBottom: "1em" }}
          />
          <FormControl
            onChange={this.saveAddresses}
            componentClass="textarea"
            placeholder="Don't forget to paste your own address here (if you want to vote)!"
            value={this.props.textAreaValue}
            id="privilegedAddressesTextArea"
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

  private saveAddresses = (e: FormEvent<FormControl & HTMLInputElement>) => {
    const addressesArray = (e.currentTarget.value as string).split("\n");
    this.props.setPrivilegedAddressesInParent(addressesArray);
  };

  private loadAddressesFromFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      let fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.handleFileRead(fileReader);
      };
      fileReader.readAsText(file);
    }
  };

  private handleFileRead = (fileReader) => {
    const content = fileReader.result;
    const textArea = document.getElementById("privilegedAddressesTextArea") as HTMLInputElement;
    textArea.value = content;
    const contentArray = content.split("\n") as string[];
    contentArray.pop(); // popping last "" element
    this.props.setPrivilegedAddressesInParent(contentArray);
  };
}
