import React, { Component, Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import Loader from "react-loader-spinner";

interface ILoadingResultProps {
  getTransactionResult: () => void;
}

export default class LoadingResult extends Component<ILoadingResultProps> {
  public componentDidMount = async () => {
    this.props.getTransactionResult();
  };

  public render() {
    return (
      <Fragment>
        <Row className="text-center" style={{ marginTop: "-1em" }}>
          <Col sm={12}>
            <h2
              style={{
                fontFamily: "Roboto",
                marginBottom: "5vh",
                marginTop: "5vh",
              }}
            >
              Please wait
            </h2>
          </Col>
        </Row>
        <Row className="text-center">
          <Col sm={12}>
            <Loader style={{ marginTop: "20vh" }} type="Grid" color="#00BFFF" height="30%" width="30%" />
          </Col>
        </Row>
        <Row className="text-center">
          <Col sm={12}>
            <h2
              style={{
                fontFamily: "Roboto",
                marginBottom: "5vh",
                marginTop: "5vh",
                textAlign: "center",
              }}
            >
              Your transaction is being processed{" "}
            </h2>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
