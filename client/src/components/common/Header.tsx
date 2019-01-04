import React, { Component, Fragment } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default class Header extends Component {
  public render() {
    return (
      <Fragment>
        {/* <h1>Decentralized Voting Platform</h1>
        <small>Fully anonymous and transparent voting platform powered by Ethereum blockchain</small> */}
        <Navbar fluid fixedTop={false} collapseOnSelect>
          <Nav bsStyle="tabs" justified>
            <LinkContainer to="/">
              <NavItem>Home</NavItem>
            </LinkContainer>
            <LinkContainer to="/createvote">
              <NavItem disabled={true}>Create new voting</NavItem>
            </LinkContainer>
            <LinkContainer to="/listvotings">
              <NavItem>List votingse</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>About</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar>
      </Fragment>
    );
  }
}
