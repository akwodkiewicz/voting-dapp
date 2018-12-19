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
  }

  setSubmitData = (formData) => {
    this.setState(() => ({
      mode: "fetching",
      formData: formData,
    }));
  };

  setModeToForm = () => {
    this.setState(() => ({
      mode: "form",
    }));
  };

  getTransactionResult = async () => {
    const accounts = await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const Contract = TruffleContract(ManagerContract);
    Contract.setProvider(web3.currentProvider);
    Contract.defaults({ from: accounts[0] });
    const instance = await Contract.at("0x457D31982A783280F42e05e22493e47f8592358D"); // change this address if you need to
    try {
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
        resultStatus: "success",
      }));
    } catch {
      this.setState(() => ({
        resultStatus: "failed",
      }));
    } finally {
      this.setState(() => ({
        mode: "finalized",
      }));
    }
  };

  render() {
    if (this.state.mode === "form") {
      return (
        <CreateVoteForm
          setSubmitData={this.setSubmitData}
          setFormData={this.setFormData}
          formData={this.state.formData}
        />
      );
    } else if (this.state.mode === "fetching") {
      return <LoadingResult getTransactionResult={this.getTransactionResult} />;
    } else if (this.state.mode === "finalized") {
      return <DisplayResult status={this.state.resultStatus} onClick={this.setModeToForm} />;
    }
  }
}

export default CreateVotePage;
