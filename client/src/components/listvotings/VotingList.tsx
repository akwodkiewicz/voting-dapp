import moment from "moment";
import React, { Component, Fragment } from "react";
import { Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Pagination, Panel, Tooltip } from "react-bootstrap";

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
  isDataRefreshRequested: boolean;
  dataRefreshRequestHandled: () => void;
  setVotingsInParent: (arg: Voting[]) => void;
  setChosenVotingAddressInParent: (arg: ContractAddress) => void;
}

interface IVotingListState {
  activePageIndex: number;
  areVotingsFetched: boolean;
  filteredVotings: Voting[];
}

export default class VotingList extends Component<IVotingListProps, IVotingListState> {
  private nrOfVotingsPerPage = 4; // TBD

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
      activePageIndex: 1,
      areVotingsFetched: false,
      filteredVotings: [],
    };
  }

  public componentDidMount = async () => {
    if (this.props.blockchainData) {
      this.fetchVotingsAndSetState();
      this.getVotingsForPage();
    }
  };

  public componentDidUpdate = async (prevProps: IVotingListProps) => {
    if (prevProps.category !== this.props.category) {
      this.setState({ areVotingsFetched: false });
    }
    if (this.props.isDataRefreshRequested && this.props.blockchainData) {
      this.fetchVotingsAndSetState();
      this.props.dataRefreshRequestHandled();
    }
    if (!this.state.areVotingsFetched && this.props.blockchainData) {
      this.fetchVotingsAndSetState();
    }
  };

  public render() {
    const pageVotings = this.state.filteredVotings;
    const nrOfPages = Math.ceil(pageVotings.length / this.nrOfVotingsPerPage);
    return (
      <Panel>
        {this.state.areVotingsFetched ? (
          <Fragment>
            <ListGroup>
              {this.getVotingsForPage().map((voting) => {
                if (voting.info.isPrivate && voting.info.isPrivileged) {
                  return (
                    <OverlayTrigger placement="right" overlay={this.privateVotingTooltip}>
                      <ListGroupItem
                        //style={{ height: "10vh" }}
                        key={voting.contract._address}
                        onClick={this.handleVotingClick}
                        {...(voting.info.hasUserVoted ? { bsStyle: "success" } : null)}
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
                        //style={{ height: "10vh" }}
                        key={voting.contract._address}
                        onClick={this.handleVotingClick}
                        bsStyle="danger"
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
                        //style={{ height: "10vh" }}
                        key={voting.contract._address}
                        onClick={this.handleVotingClick}
                        {...(voting.info.hasUserVoted ? { bsStyle: "success" } : null)}
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
            <Pagination>
              <Pagination.First
                onClick={this.state.activePageIndex !== 1 ? this.paginationFirst : null}
                disabled={this.state.activePageIndex === 1 ? true : false}
              />
              <Pagination.Prev
                onClick={this.state.activePageIndex > 1 ? this.paginationPrev : null}
                disabled={this.state.activePageIndex === 1 ? true : false}
              />
            </Pagination>
            <span>
              Page {this.state.activePageIndex}/{nrOfPages}
            </span>
            <Pagination>
              <Pagination.Next
                onClick={this.state.activePageIndex !== nrOfPages ? this.paginationNext : null}
                disabled={this.state.activePageIndex === nrOfPages ? true : false}
              />
              <Pagination.Last
                onClick={
                  this.state.activePageIndex !== nrOfPages
                    ? () => {
                        this.paginationLast(nrOfPages);
                      }
                    : null
                }
                disabled={this.state.activePageIndex === nrOfPages ? true : false}
              />
            </Pagination>
          </Fragment>
        ) : (
          <Panel.Body>Fetching data from blockchain...</Panel.Body>
        )}
      </Panel>
    );
  }

  private handleVotingClick = (event: React.MouseEvent<ListGroupItem & HTMLInputElement>) => {
    const question = event.currentTarget.innerText;
    let chosenVotingIndex: number;
    this.props.votings.forEach((voting, index) => {
      if (voting.info.question === question) {
        chosenVotingIndex = index;
      }
    });
    this.props.setChosenVotingAddressInParent(this.props.votings[chosenVotingIndex].contract._address);
  };

  private fetchVotingsAndSetState = async () => {
    const votings = await fetchVotings(this.props.blockchainData, this.props.category, this.props.votingState);
    this.props.setVotingsInParent(votings);
    const filteredVotings = this.filteredVotings();
    this.setState({
      areVotingsFetched: true,
      filteredVotings,
    });
  };

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

  private getVotingsForPage() {
    const votings = this.filteredVotings();
    const dividedVotings: Voting[][] = [];

    for (let i = 0; i < votings.length; i += this.nrOfVotingsPerPage) {
      dividedVotings.push(votings.slice(i, i + this.nrOfVotingsPerPage));
    }

    return dividedVotings[this.state.activePageIndex - 1];
  }

  private handlePageClick(index: number) {
    if (this.state.activePageIndex !== index) {
      console.log(index);
      this.setState({
        activePageIndex: index,
      });
    }
  }

  private paginationFirst = () => {
    this.setState({
      activePageIndex: 1,
    });
    this.handlePageClick(1);
  };

  private paginationNext = () => {
    const newIndex = this.state.activePageIndex + 1;
    this.setState({
      activePageIndex: newIndex,
    });
    this.handlePageClick(newIndex);
  };

  private paginationPrev = () => {
    const newIndex = this.state.activePageIndex - 1;
    this.setState({
      activePageIndex: newIndex,
    });
    this.handlePageClick(newIndex);
  };

  private paginationLast = (length: number) => {
    this.setState({
      activePageIndex: length,
    });
    this.handlePageClick(length);
  };
}
