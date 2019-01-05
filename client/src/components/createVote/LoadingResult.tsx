import React, { Component, Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import Loader from "react-loader-spinner";

interface ILoadingResultProps {
  getTransactionResult: () => void;
}

export default class LoadingResult extends Component<ILoadingResultProps> {
  public componentDidMount = async () => {
    await this.sleep(2000);

    this.props.getTransactionResult();
  };

  public sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public render() {
    return (
      <Fragment>
        <Row className="text-center">
          <Col sm={12}>
            <h1>Please wait</h1>
          </Col>
        </Row>
        <Row className="text-center" style={{ marginTop: "12px" }}>
          <Col sm={12}>
            <Loader type="Grid" color="#00BFFF" height="10%" width="10%" />
          </Col>
        </Row>
        <Row className="text-center">
          <Col sm={12}>
            <h3>Your transaction is being processed</h3>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
