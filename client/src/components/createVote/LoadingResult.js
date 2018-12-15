import React, { Component } from "react";
import Loader from "react-loader-spinner";

class LoadingResult extends Component {
  componentDidMount = async () => {
    await this.sleep(2000);

    this.props.getTransactionResult();
  };

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  render() {
    return (
      <React.Fragment>
        <Loader type="Grid" color="#00BFFF" height="30%" width="30%" />
        <h1>Please wait, your transaction is being processed</h1>
      </React.Fragment>
    );
  }
}

export default LoadingResult;
