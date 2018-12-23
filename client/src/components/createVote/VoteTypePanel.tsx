import { Component, Fragment } from "react";

import { ControlLabel, FormGroup, Radio } from "react-bootstrap";
import PrivilegedAddresses from "./PrivilegedAddresses";

type Voter = string;

enum VoteType {
  Public = "public",
  Private = "private",
}

interface IVoteTypeProps {
  voteType: VoteType;
  privilegedVoters: Voter[];
  setVoteTypeInParent: (arg: VoteType) => void;
  setPrivilegedVotersInParent: (arg: Voter[]) => void;
}

class VoteTypePanel extends Component<IVoteTypeProps> {
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
        <ControlLabel>Vote type</ControlLabel>
        <FormGroup onChange={this.changeVoteType}>
          <Radio
            name="radioGroup"
            checked={this.props.voteType === VoteType.Public ? true : false}
            id="votePublic"
            inline
          >
            Public
          </Radio>
          <Radio name="radioGroup" checked={this.props.voteType === VoteType.Private ? true : false} inline>
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

export default VoteTypePanel;
export { Voter, VoteType };
