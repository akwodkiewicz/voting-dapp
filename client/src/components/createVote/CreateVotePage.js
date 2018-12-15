import React, { Component } from "react";
import CreateVoteForm from "./CreateVoteForm";
import LoadingResult from "./LoadingResult";
import DisplayResult from "./DisplayResult";
import "react-datetime/css/react-datetime.css";
import ManagerContract from "../../build/ManagerContract.json";
import TruffleContract from "truffle-contract";
import Web3 from "web3";
class CreateVotePage extends Component {
  constructor() {
    super();

    this.state = {
      mode: "form",
      resultStatus: "success",
      formData: null,
    };

    this.getSubmitData = this.getSubmitData.bind(this);
    this.getTransactionResult = this.getTransactionResult.bind(this);
  }

  getSubmitData(formData) {
    this.setState(() => ({
      mode: "fetching",
      formData: formData,
    }));
  }

  getTransactionResult = async () => {
    const accounts = await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const Contract = TruffleContract(ManagerContract);
    Contract.setProvider(web3.currentProvider);
    Contract.defaults({ from: accounts[0] });
    const instance = await Contract.at("0xe5B6B31563C41d1de6C3a002F891104Fe5ea3171"); // change this address if you need to
    const result = await instance.createVotingWithNewCategory(
      web3.utils.fromUtf8(this.state.formData.category),
      this.state.formData.question,
      this.state.formData.answers.map((opt) => web3.utils.fromUtf8(opt)),
      this.state.formData.voteEndTime,
      this.state.formData.resultsViewingEndTime,
      this.state.formData.voteType,
      this.state.formData.privilegedVoters
    );

    console.log(result);
    this.setState(() => ({
      mode: "success",
    }));
  };

  render() {
    if (this.state.mode === "form") {
      return <CreateVoteForm getSubmitData={this.getSubmitData} />;
    } else if (this.state.mode === "fetching") {
      return <LoadingResult getTransactionResult={this.getTransactionResult} />;
    } else {
      return <DisplayResult status={this.state.resultStatus} />;
    }
  }
}

export default CreateVotePage;
