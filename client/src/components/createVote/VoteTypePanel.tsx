import React, { Component, Fragment } from "react";

import { ControlLabel, FormGroup, Glyphicon, OverlayTrigger, Radio, Tooltip } from "react-bootstrap";
import PrivilegedAddresses from "./PrivilegedAddresses";

export type Voter = string;

export enum VoteType {
  Public = "public",
  Private = "private",
}

interface IVoteTypeProps {
  voteType: VoteType;
  privilegedVoters: Voter[];
  setVoteTypeInParent: (arg: VoteType) => void;
  setPrivilegedVotersInParent: (arg: Voter[]) => void;
}

export default class VoteTypePanel extends Component<IVoteTypeProps> {
  constructor(props: Readonly<IVoteTypeProps>) {
    super(props);
  }

  public changeVoteType = () => {
    const publicVote = document.getElementById("votePublic") as HTMLInputElement;
    const voteType = publicVote.checked ? VoteType.Public : VoteType.Private;
    this.props.setVoteTypeInParent(voteType);
  };

  public setPrivilegedVoters = (voters: Voter[]) => {
    this.props.setPrivilegedVotersInParent(voters);
  };

  public render() {
    return (
      <Fragment>
        <FormGroup>
          <ControlLabel style={{ display: "block" }}>
            Vote type
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip">
                  <strong>Public voting</strong>
                  <p>Everyone can take active participation in this voting!</p>
                  <strong>Private voting</strong>
                  <p>Only privileged addresses are permitted to vote.</p>
                </Tooltip>
              }
            >
              <Glyphicon glyph="info-sign" style={{ padding: "0 0 3px 5px", verticalAlign: "middle" }} />
            </OverlayTrigger>
          </ControlLabel>

          <Radio
            id="votePublic"
            name="radioGroup"
            checked={this.props.voteType === VoteType.Public ? true : false}
            onChange={this.changeVoteType}
            inline
          >
            Public
          </Radio>
          <Radio
            id="votePrivate"
            name="radioGroup"
            checked={this.props.voteType === VoteType.Private ? true : false}
            onChange={this.changeVoteType}
            inline
          >
            Private
          </Radio>
        </FormGroup>

        <PrivilegedAddresses
          setPrivilegedAddressesInParent={this.setPrivilegedVoters}
          voteType={this.props.voteType}
          textAreaValue={this.props.privilegedVoters.reduce((prevVal, currVal, currIdx) => {
            return currIdx === 0 ? currVal : prevVal + "\n" + currVal;
          }, "")}
        />
      </Fragment>
    );
  }
}
