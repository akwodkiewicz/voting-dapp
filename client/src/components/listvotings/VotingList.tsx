import React, { Component, Fragment } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { fetchVotings } from "../../utils/eth";
import { BlockchainData, Category, Voting } from "../common/types";

interface IVotingListProps {
  blockchainData: BlockchainData;
  chosenVotingIndex: number;
  category: Category;
  votings: Voting[];
  setVotingsInParent: (arg: Voting[]) => void;
  setChosenVotingIndexInParent: (arg: number) => void;
}

interface IVotingListState {
  areVotingsFetched: boolean;
}

export default class VotingList extends Component<IVotingListProps, IVotingListState> {
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
      <Fragment>
        <h2>Votings</h2>
        <ListGroup>
          {this.props.votings.map((voting) => {
            return (
              <ListGroupItem key={voting.contract._address} onClick={this.handleVotingClick}>
                {voting.question}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </Fragment>
    );
  }
}
