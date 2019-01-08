import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";
import DVPLogo from "../../images/distributed-voting-platform.png";
import EthereumLogo from "../../images/ethereum-logo.png";
import MetaMaskLogo from "../../images/metamask-logo.png";
export default class AboutPage extends Component {
  public render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <h2 style={{ fontWeight: "bold", marginBottom: "2em", marginTop: "2em", textAlign: "center" }}>
              Distributed Voting Platform is a{" "}
              <span style={{ fontStyle: "italic" }}>distributed, blockchain-based voting platform</span>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Distributed</h3>
            <p style={{ fontSize: "1.1em", textAlign: "justify" }}>
              This system is running on thousands of nodes at the same time, thus eliminating a single point of failure.
            </p>
            <p style={{ fontSize: "1.1em", textAlign: "justify" }}>
              But distribution serves not only as a way of providing high availability. The lack of central server
              ensures that the platform has no single authority, which could manage all the operations internally
              without other participants' consent.
            </p>
          </Col>
          <Col md={4}>
            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Blockchain-based</h3>
            <p style={{ fontSize: "1.1em", textAlign: "justify" }}>
              This platform is created on top of a public blockchain, a distributed ledger technology.
            </p>
            <br />
            <p style={{ fontSize: "1.1em", textAlign: "justify" }}>
              This means blockchain is used as a database for logging all the events that occur in the system. It is
              also used as a network protocol for connecting to and sharing data with other nodes around the world. The
              cryptography behind blockchain protects the stored records from alteration and makes them persistent. And
              there is no registration process, so all the transactions made in the network are anonymous.
            </p>
          </Col>

          <Col md={4}>
            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Voting platform</h3>
            <p style={{ fontSize: "1.1em", textAlign: "justify" }}>
              Create ballots and polls, and participate in other's people votings.
            </p>
            <br />
            <p style={{ fontSize: "1.1em", textAlign: "justify" }}>
              This platform allows you to participate in public votings created by people from all around the world. Do
              you want to learn someone else's stance on the matter of your choice – just create your own voting. Or
              maybe you want only <em>some</em> people to be able to participate? If you do, you can create a{" "}
              <em>private voting</em> by defining a list of privileged voters.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h2
              style={{
                fontWeight: "bold",
                marginBottom: "2em",
                marginTop: "2em",
                textAlign: "center",
              }}
            >
              How does it work?
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <img
              style={{
                display: "block",
                maxHeight: "100%", // 2nd option: 50%
                maxWidth: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={EthereumLogo}
            />
            <ul style={{ fontSize: "1.2em", marginTop: "2em" }}>
              <li>Votings stored as smart contracts</li>
              <li>Validates user's actions based on his adress' permissions </li>
              <li>Transaction (voting) history visible for anyone</li>
            </ul>
          </Col>
          <Col md={4}>
            <img
              style={{
                display: "block",
                maxHeight: "100%", // 2nd option: 50%
                maxWidth: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={DVPLogo}
            />
            <ul style={{ fontSize: "1.2em", marginTop: "2em" }}>
              <li>Connected to Ethereum blockchain via Metamask</li>
              <li>Clear and intuitive interface for voting creation, results displaying and voting</li>
            </ul>
          </Col>
          <Col md={4}>
            <img
              style={{
                display: "block",
                maxHeight: "100%", // 2nd option: 50%
                maxWidth: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={MetaMaskLogo}
            />
            <ul style={{ fontSize: "1.2em", marginTop: "2em" }}>
              <li>Web browser plugin storing user's wallet</li>
              <li>Responsible for communication with blockchain</li>
            </ul>
          </Col>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <Col md={8} mdOffset={2}>
            <p style={{ fontSize: "1.2em", textAlign: "justify" }}>
              (Optional) Lorum ipsum main description Lorum ipsum main description Lorum ipsum main description Lorum
              ipsum main description
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h2
              style={{
                fontWeight: "bold",
                marginBottom: "2em",
                marginTop: "2em",
                textAlign: "center",
              }}
            >
              Application's genesis
            </h2>
          </Col>
        </Row>
        <Row style={{ marginBottom: "4em" }}>
          <Col md={8} mdOffset={2}>
            <p style={{ fontSize: "1.2em", textAlign: "justify" }}>
              Decentralized Voting Platform was created by Andrzej Wódkiewicz and Gustaw Żyngiel, final year students
              pursuing the BSc in Computer Science programme at Warsaw University of Technology, Faculty of Mathematics
              and Information Science. The application is their thesis project, developed under the guidance of Senior
              Lecturer Paweł Kotowski, their thesis supervisor.
            </p>
          </Col>
        </Row>
      </Grid>
    );
  }
}
