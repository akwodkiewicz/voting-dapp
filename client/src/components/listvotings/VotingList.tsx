import moment from "moment";
import React, { Component } from "react";
import { Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Panel, Tooltip } from "react-bootstrap";

import { fetchVotings } from "../../utils/eth";
import { BlockchainData, Category, ContractAddress, Voting } from "../../utils/types";
import { PrivacySetting } from "./PrivacyButtons";

export enum VotingState {
  Active = "active",
  Passive = "passive",
  Disabled = "disabled",
}

interface IVotingListProps {
  blockchainData: BlockchainData;
  chosenVotingAddress: ContractAddress;
  category: Category;
  votings: Voting[];
  privacySetting: PrivacySetting;
  votingState: VotingState;
  setVotingsInParent: (arg: Voting[]) => void;
  setChosenVotingAddressInParent: (arg: ContractAddress) => void;
}

interface IVotingListState {
  areVotingsFetched: boolean;
}

export default class VotingList extends Component<IVotingListProps, IVotingListState> {
  private publicVotingTooltip = (
    <Tooltip id="tooltip">
      <strong>Public voting</strong>
      <p>Everyone can take active participation in this voting!</p>
    </Tooltip>
  );

  private privateVotingTooltip = (
    <Tooltip id="tooltip">
      <strong>Private voting with access</strong>
      <p>You are permitted to take active participation in this voting.</p>
    </Tooltip>
  );

  private inaccessibleVotingTooltip = (
    <Tooltip id="tooltip">
      <strong>Inaccessible private voting</strong>
      <p>
        Voting creator did not grant you access to this voting. You cannot take active participation, but you can still
        look at the results!
      </p>
    </Tooltip>
  );

  constructor(params) {
    super(params);

    this.state = {
      areVotingsFetched: false,
    };
  }

  public componentDidMount = async () => {
    if (this.props.blockchainData) {
      const votings = await fetchVotings(this.props.blockchainData, this.props.category, this.props.votingState);
      this.props.setVotingsInParent(votings);
      this.setState({ areVotingsFetched: true });
    }
  };

  public componentDidUpdate = async (prevProps: IVotingListProps) => {
    if (prevProps.category !== this.props.category) {
      this.setState({ areVotingsFetched: false });
    }
    if (!this.state.areVotingsFetched && this.props.blockchainData) {
      const votings = await fetchVotings(this.props.blockchainData, this.props.category, this.props.votingState);
      this.props.setVotingsInParent(votings);
      this.setState({ areVotingsFetched: true });
    }
  };

  public handleVotingClick = (event: React.MouseEvent<ListGroupItem & HTMLInputElement>) => {
    const question = event.currentTarget.innerText;
    let chosenVotingIndex: number;
    this.props.votings.forEach((voting, index) => {
      if (voting.info.question === question) {
        chosenVotingIndex = index;
      }
    });
    this.props.setChosenVotingAddressInParent(this.props.votings[chosenVotingIndex].contract._address);
  };

  public render() {
    return (
      <Panel>
        {this.state.areVotingsFetched ? (
          <ListGroup>
            {this.filteredVotings().map((voting) => {
              if (voting.info.isPrivate && voting.info.isPrivileged) {
                return (
                  <OverlayTrigger placement="right" overlay={this.privateVotingTooltip}>
                    <ListGroupItem
                      key={voting.contract._address}
                      onClick={this.handleVotingClick}
                      {...(voting.contract._address === this.props.chosenVotingAddress ? { active: true } : null)}
                    >
                      {voting.info.question}
                      <Glyphicon glyph="lock" className="pull-right" />
                    </ListGroupItem>
                  </OverlayTrigger>
                );
              } else if (voting.info.isPrivate && !voting.info.isPrivileged) {
                return (
                  <OverlayTrigger placement="right" overlay={this.inaccessibleVotingTooltip}>
                    <ListGroupItem
                      key={voting.contract._address}
                      onClick={this.handleVotingClick}
                      {...(voting.contract._address === this.props.chosenVotingAddress ? { active: true } : null)}
                    >
                      {voting.info.question}
                      <Glyphicon glyph="ban-circle" className="pull-right" />
                    </ListGroupItem>
                  </OverlayTrigger>
                );
              } else {
                return (
                  <OverlayTrigger placement="right" overlay={this.publicVotingTooltip}>
                    <ListGroupItem
                      key={voting.contract._address}
                      onClick={this.handleVotingClick}
                      {...(voting.contract._address === this.props.chosenVotingAddress ? { active: true } : null)}
                    >
                      {voting.info.question}
                      <Glyphicon glyph="globe" className="pull-right" />
                    </ListGroupItem>
                  </OverlayTrigger>
                );
              }
            })}
          </ListGroup>
        ) : (
          <Panel.Body>Fetching data from blockchain...</Panel.Body>
        )}
      </Panel>
    );
  }

  private filteredVotings = () => {
    return this.props.votings
      .filter((voting) => {
        if (this.props.privacySetting === PrivacySetting.Private) {
          return voting.info.isPrivate;
        } else if (this.props.privacySetting === PrivacySetting.Public) {
          return !voting.info.isPrivate;
        } else return true;
      })
      .filter((voting) => {
        const now = moment().utc().unix(); // prettier-ignore
        if (this.props.votingState === VotingState.Active) {
          return now <= voting.info.votingEndTime;
        } else if (this.props.votingState === VotingState.Passive) {
          return voting.info.votingEndTime < now && now <= voting.info.resultsEndTime;
        } else return false;
      });
  };
}
