import React, { Component, Fragment } from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { IndexLinkContainer, LinkContainer } from "react-router-bootstrap";

interface IHeaderProps {
  block: number;
}

export default class Header extends Component<IHeaderProps> {
  public render() {
    return (
      <Fragment>
        {/* <h1>Decentralized Voting Platform</h1>
        <small>Fully anonymous and transparent voting platform powered by Ethereum blockchain</small> */}
        <Navbar fluid fixedTop={false} collapseOnSelect={false}>
          <Nav bsStyle="tabs" justified>
            <IndexLinkContainer to="/" disabled={this.props.block === 4 ? true : false}>
              <NavItem>Home</NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/createvote" disabled={this.props.block > 0 ? true : false}>
              <NavItem disabled={true}>Create new voting</NavItem>
            </LinkContainer>
            <LinkContainer to="/listvotings" disabled={this.props.block > 0 ? true : false}>
              <NavItem>List votings</NavItem>
            </LinkContainer>
            <LinkContainer to="/about" disabled={this.props.block === 4 ? true : false}>
              <NavItem>About</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar>
      </Fragment>
    );
  }
}
