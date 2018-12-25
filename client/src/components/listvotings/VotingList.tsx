import React, { Component } from "react";
import { ListGroup, ListGroupItem, Panel, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { fetchVotings } from "../../utils/eth";
import { BlockchainData, Category, Voting } from "../common/types";
import { PrivacySetting } from "./PrivacyButtons";

interface IVotingListProps {
  blockchainData: BlockchainData;
  chosenVotingIndex: number;
  category: Category;
  votings: Voting[];
  privacySetting: PrivacySetting;
  setVotingsInParent: (arg: Voting[]) => void;
  setChosenVotingIndexInParent: (arg: number) => void;
}

interface IVotingListState {
  areVotingsFetched: boolean;
}

export default class VotingList extends Component<IVotingListProps, IVotingListState> {
  // https://stackoverflow.com/a/20548578
  private vCenter = {
    display: "inline-block",
    float: "none" as "none", // https://stackoverflow.com/a/48087031
    "vertical-align": "middle",
  };

  constructor(params) {
    super(params);

    this.state = {
      areVotingsFetched: false,
    };
  }

  public componentDidMount = async () => {
    if (this.props.blockchainData) {
      const votings = await fetchVotings(this.props.blockchainData, this.props.category);
      this.props.setVotingsInParent(votings);
      this.setState({ areVotingsFetched: true });
    }
  };

  public componentDidUpdate = async (prevProps: IVotingListProps) => {
    if (prevProps.category !== this.props.category) {
      this.setState({ areVotingsFetched: false });
    }
    if (!this.state.areVotingsFetched && this.props.blockchainData) {
      const votings = await fetchVotings(this.props.blockchainData, this.props.category);
      this.props.setVotingsInParent(votings);
      this.setState({ areVotingsFetched: true });
    }
  };

  public handleVotingClick = (event: React.MouseEvent<ListGroupItem & HTMLInputElement>) => {
    const question = event.currentTarget.innerText;

    let chosenVotingIndex: number;
    this.props.votings.forEach((voting, index) => {
      if (voting.question === question) {
        chosenVotingIndex = index;
      }
    });
    this.props.setChosenVotingIndexInParent(chosenVotingIndex);
  };

  public render() {
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>Votings</Panel.Title>
        </Panel.Heading>
        {this.state.areVotingsFetched ? (
          <ListGroup>
            {this.props.votings
              .filter((voting) => {
                if (this.props.privacySetting === PrivacySetting.Private) {
                  return voting.isPrivate;
                } else if (this.props.privacySetting === PrivacySetting.Public) {
                  return !voting.isPrivate;
                } else return true;
              })
              .map((voting, index) => {
                return (
                  <ListGroupItem
                    key={voting.contract._address}
                    onClick={this.handleVotingClick}
                    {...(index === this.props.chosenVotingIndex ? { active: true } : null)}
                  >
                    {voting.question}
                  </ListGroupItem>
                );
              })}
          </ListGroup>
        ) : (
          <Panel.Body>Fetching data from blockchain...</Panel.Body>
        )}
      </Panel>
    );
  }
}
