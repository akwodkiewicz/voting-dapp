import React, { Component } from "react";
import { Button, FormControl, FormGroup, InputGroup } from "react-bootstrap";
import { fetchVoting } from "../../utils/eth";
import { BlockchainData } from "../../utils/types";

interface IHomePageProps {
  blockchainData: BlockchainData;
}
export default class HomePage extends Component<IHomePageProps> {
  public searchVoting = async () => {
    // TODO: simple address validation
    const address = (document.getElementById("address") as HTMLInputElement).value;
    const voting = await fetchVoting(this.props.blockchainData, address);
    return voting;
  };

  public render() {
    return (
      <FormGroup>
        <InputGroup>
          <FormControl type="text" id="address" />
          <InputGroup.Button>
            <Button onClick={this.searchVoting}>Before</Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    );
  }
}
