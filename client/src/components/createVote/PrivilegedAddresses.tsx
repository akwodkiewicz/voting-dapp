import React, { Component, FormEvent } from "react";
import { ControlLabel, FormControl, FormGroup, Glyphicon, HelpBlock, OverlayTrigger, Tooltip } from "react-bootstrap";
import Web3 from "web3";
import { VoteType } from "./VoteTypePanel";

interface IPrivilegedAddressesProps {
  voteType: VoteType;
  touched: boolean;
  valid: boolean;
  textAreaValue: string;
  setPrivilegedAddressesInParent: (arg: string[]) => void;
}

interface IPrivilegedAddressesState {
  fileContentMismatch: boolean;
  noAddressesInFile: boolean;
}

export default class PrivilegedAddresses extends Component<IPrivilegedAddressesProps, IPrivilegedAddressesState> {
  constructor(props) {
    super(props);
    this.state = {
      fileContentMismatch: false,
      noAddressesInFile: false,
    };
  }

  public render() {
    if (this.props.voteType === "private") {
      return (
        <FormGroup
          validationState={
            this.props.touched && !this.props.valid
              ? "error"
              : this.state.fileContentMismatch || this.state.noAddressesInFile
              ? "warning"
              : null
          }
        >
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
            style={{ resize: "vertical" }}
          />

          {this.state.noAddressesInFile ? (
            <HelpBlock>Uploaded file does not contain any valid keccak256 Ethereum addresses</HelpBlock>
          ) : null}

          {this.state.fileContentMismatch ? (
            <HelpBlock>Uploaded file contained some lines without valid addresses. Verify imported data.</HelpBlock>
          ) : null}

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
    this.setState({
      fileContentMismatch: false,
      noAddressesInFile: false,
    });
    this.props.setPrivilegedAddressesInParent(addressesArray);
  };

  private loadAddressesFromFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.handleFileRead(fileReader);
      };
      fileReader.readAsText(file);
    }
  };

  private handleFileRead = (fileReader: FileReader) => {
    const content = fileReader.result;
    const contentArray = content
      .toString()
      .split("\n")
      .filter((c) => c !== "");

    const addresses = contentArray.filter((c) => Web3.utils.isAddress(c));
    if (addresses.length === 0) {
      this.setState({
        fileContentMismatch: false,
        noAddressesInFile: true,
      });
      return; // Do not touch form and do not overwrite existing data
    }
    if (addresses.length !== contentArray.length) {
      this.setState({
        fileContentMismatch: true,
        noAddressesInFile: false,
      });
    } else {
      this.setState({
        fileContentMismatch: false,
        noAddressesInFile: false,
      });
    }
    this.props.setPrivilegedAddressesInParent(addresses);
  };
}
