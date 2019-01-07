import moment from "moment";
import React, { Component, Fragment } from "react";
import {
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Pagination,
  Panel,
  Tooltip,
} from "react-bootstrap";

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
  displayInaccessibleVotings: boolean;
  filterPhase: string;
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
  votingsForPage: Voting[];
}

export default class VotingList extends Component<IVotingListProps, IVotingListState> {
  private nrOfVotingsPerPage = 10; // TBD

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
      votingsForPage: [],
    };
  }

  public componentDidMount = async () => {
    if (this.props.blockchainData) {
      this.fetchVotingsAndSetState();
    }
  };

  public componentDidUpdate = async (prevProps: IVotingListProps) => {
    if (prevProps.category !== this.props.category) {
      this.setState({ areVotingsFetched: false });
    }
    if (prevProps.privacySetting !== this.props.privacySetting) {
      this.setState({ activePageIndex: 1 });
    }
    if (prevProps.displayInaccessibleVotings !== this.props.displayInaccessibleVotings) {
      this.setState({ activePageIndex: 1 });
    }
    if (prevProps.filterPhase !== this.props.filterPhase) {
      this.setState({ activePageIndex: 1 });
    }
    if (this.props.isDataRefreshRequested && this.props.blockchainData) {
      this.fetchVotingsAndSetState();
      this.props.dataRefreshRequestHandled();
    }
    if (!this.state.areVotingsFetched && this.props.blockchainData) {
      this.fetchVotingsAndSetState();
    }
    const pageInfo = document.getElementById("xd");
    if (pageInfo) pageInfo.focus();
  };

  public render() {
    const nrOfPages = Math.ceil(this.filteredVotings().length / this.nrOfVotingsPerPage);
    const votingsToDisplay = this.getVotingsForPage();
    return (
      <Fragment>
        {this.state.areVotingsFetched ? (
          <Fragment>
            <Panel>
              <ListGroup>
                {votingsToDisplay.length > 0 ? (
                  votingsToDisplay.map((voting) => {
                    if (voting.info.isPrivate && voting.info.isPrivileged) {
                      return (
                        <OverlayTrigger placement="right" overlay={this.privateVotingTooltip}>
                          <ListGroupItem
                            key={voting.contract._address}
                            onClick={this.handleVotingClick}
                            {...(voting.info.hasUserVoted ? { bsStyle: "success" } : null)}
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
                            bsStyle="danger"
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
                            {...(voting.info.hasUserVoted ? { bsStyle: "success" } : null)}
                          >
                            {voting.info.question}
                            <Glyphicon glyph="globe" className="pull-right" />
                          </ListGroupItem>
                        </OverlayTrigger>
                      );
                    }
                  })
                ) : (
                  <Fragment>
                    <HelpBlock style={{ textAlign: "center", fontSize: "1.5em", fontWeight: "bold" }}>
                      No votings found
                    </HelpBlock>{" "}
                    <HelpBlock style={{ textAlign: "center" }}>
                      Either your filters don't match any of the votings in the selected category or the category you
                      selected is empty :(
                    </HelpBlock>
                  </Fragment>
                )}
              </ListGroup>
            </Panel>
            <div style={{ width: "100%" }}>
              <div style={{ width: "50%", margin: "0 auto", textAlign: "center" }}>
                {nrOfPages > 1 && (
                  <Pagination>
                    <Pagination.First
                      onClick={this.state.activePageIndex !== 1 ? this.paginationFirst : null}
                      disabled={this.state.activePageIndex === 1 ? true : false}
                    />
                    <Pagination.Prev
                      onClick={this.state.activePageIndex > 1 ? this.paginationPrev : null}
                      disabled={this.state.activePageIndex === 1 ? true : false}
                    />
                    <Pagination.Item id="xd" autoFocus={true}>
                      Page {this.state.activePageIndex}/{nrOfPages}
                    </Pagination.Item>
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
                )}
              </div>
            </div>
          </Fragment>
        ) : (
          <Panel>
            <Panel.Body>Fetching data from blockchain...</Panel.Body>
          </Panel>
        )}
      </Fragment>
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
    let votings = this.props.votings;

    if (this.props.filterPhase !== "") {
      votings = votings.filter((voting) => {
        return voting.info.question.includes(this.props.filterPhase);
      });
    }
    return votings
      .filter((voting) => {
        if (!this.props.displayInaccessibleVotings) {
          return voting.info.isPrivileged === null || voting.info.isPrivileged;
        } else return true;
      })
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
    let index = this.state.activePageIndex - 1;
    const votings = this.filteredVotings();
    const dividedVotings: Voting[][] = [];

    for (let i = 0; i < votings.length; i += this.nrOfVotingsPerPage) {
      dividedVotings.push(votings.slice(i, i + this.nrOfVotingsPerPage));
    }
    if (dividedVotings.length === 1) index = 0;

    return dividedVotings.length > 0 ? dividedVotings[index] : [];
  }

  private handlePageClick(index: number) {
    if (this.state.activePageIndex !== index) {
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
