import React, { Component } from "react";
import { Col, Grid, Panel, Row } from "react-bootstrap";

export default class AboutPage extends Component {
  public render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <h3 style={{ textAlign: "center", marginTop: "2em", marginBottom: "2em" }}>
              Decentralized Voting Platform is a{" "}
              <span style={{ fontStyle: "italic" }}>decentralized, blockchain-based voting platform</span>
            </h3>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Panel>
              <Panel.Heading>
                <Panel.Title style={{ textAlign: "center" }}>Decentralized</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <p style={{ textAlign: "justify" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque
                  sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac
                  diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula
                  ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna
                  vulputate arcu, vel tempus metus leo non est.
                </p>
              </Panel.Body>
            </Panel>
          </Col>
          <Col md={4}>
            <Panel>
              <Panel.Heading>
                <Panel.Title style={{ textAlign: "center" }}>Blockchain-based</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <p style={{ textAlign: "justify" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque
                  sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac
                  diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula
                  ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna
                  vulputate arcu, vel tempus metus leo non est.
                </p>
              </Panel.Body>
            </Panel>
          </Col>

          <Col md={4}>
            <Panel>
              <Panel.Heading>
                <Panel.Title style={{ textAlign: "center" }}>Voting platform</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <p style={{ textAlign: "justify" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nibh augue, suscipit a, scelerisque
                  sed, lacinia in, mi. Cras vel lorem. Etiam pellentesque aliquet tellus. Phasellus pharetra nulla ac
                  diam. Quisque semper justo at risus. Donec venenatis, turpis vel hendrerit interdum, dui ligula
                  ultricies purus, sed posuere libero dui id orci. Nam congue, pede vitae dapibus aliquet, elit magna
                  vulputate arcu, vel tempus metus leo non est.
                </p>
              </Panel.Body>
            </Panel>{" "}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3
              style={{
                textAlign: "center",
                marginTop: "1em",
                marginBottom: "1em",
              }}
            >
              Application's genesis
            </h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <p>
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
