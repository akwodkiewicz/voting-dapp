import React, { Component } from "react";
import { Button, Col, Grid, Pagination, Row } from "react-bootstrap";

// interface IVotingListProps {

// }

interface ICustomPaginatorState {
  activePageIndex: number;
}

export default class CustomPaginator extends Component<any, ICustomPaginatorState> {
  constructor(props) {
    super(props);

    this.state = {
      activePageIndex: 1,
    };
  }
  public render() {
    const nrOfPages = 10;

    return (
      <Grid fluid>
        <Row>
          <div>
            <Pagination style={{ display: "inline" }}>
              <Pagination.First
                onClick={this.state.activePageIndex !== 1 ? this.paginationFirst : null}
                disabled={this.state.activePageIndex === 1 ? true : false}
              />
              <Pagination.Prev
                onClick={this.state.activePageIndex > 1 ? this.paginationPrev : null}
                disabled={this.state.activePageIndex === 1 ? true : false}
              />
            </Pagination>

            <p style={{ display: "inline" }}>
              Page {this.state.activePageIndex}/{nrOfPages}
            </p>
            <Pagination style={{ display: "inline" }}>
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
          </div>
        </Row>
        <Row>
          <Col md={5}>
            <Button style={{ float: "right" }}>Default</Button>
          </Col>
          <Col md={1}>
            <p style={{ textAlign: "center" }}>
              Page {this.state.activePageIndex}/{nrOfPages}
            </p>
          </Col>
          <Col md={5}>
            <Pagination style={{ float: "left" }}>
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
          </Col>
        </Row>
      </Grid>
    );
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
