import React, { Component } from "react";
import CreateVoteForm from "./CreateVoteForm";
import LoadingResult from "./LoadingResult";
import DisplayResult from "./DisplayResult";
import "react-datetime/css/react-datetime.css";
import BlockchainData from "../common/BlockchainData";

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
    /** @type BlockchainData */
    const blockchainData = this.props.blockchainData;
    const web3 = blockchainData.web3;
    const manager = blockchainData.manager;
    try {
      const result = await manager.methods
        .createVotingWithNewCategory(
          web3.utils.fromUtf8(this.state.formData.category),
          this.state.formData.question,
          this.state.formData.answers.map((opt) => web3.utils.fromUtf8(opt)),
          this.state.formData.voteEndTime,
          this.state.formData.resultsViewingEndTime,
          this.state.formData.voteType,
          this.state.formData.privilegedVoters
        )
        .send();
      console.log(result);
      this.setState(() => ({
        resultStatus: "success",
      }));
    } catch (e) {
      console.error(e);
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
          blockchainData={this.props.blockchainData}
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
