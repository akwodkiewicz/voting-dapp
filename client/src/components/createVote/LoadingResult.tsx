import React, { Component, Fragment } from "react";
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
        <Loader type="Grid" color="#00BFFF" height="30%" width="30%" />
        <h1>Please wait, your transaction is being processed</h1>
      </Fragment>
    );
  }
}
