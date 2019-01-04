import React from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <Navbar fixedTop={false} inverse>
        <Navbar.Header>
          <Navbar.Brand href="#home">{" React Bootstrap"}</Navbar.Brand>{" "}
        </Navbar.Header>
        <Nav>
          <NavItem>
            <Link to="/">Home</Link>
          </NavItem>
          <NavItem>
            <Link to="/createvote">Create vote</Link>
          </NavItem>
          <NavItem>
            <Link to="/listvotings">List votings</Link>
          </NavItem>
          <NavItem>
            <Link to="/about">About</Link>
          </NavItem>
        </Nav>
      </Navbar>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/createvote">Create vote</Link>
        {" | "}
        <Link to="/listvotings">List votings</Link>
        {" | "}
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
};
export default Header;
