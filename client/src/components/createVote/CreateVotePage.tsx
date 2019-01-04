import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";
import "react-datetime/css/react-datetime.css"; // tslint:disable-line
import { BlockchainData, VoteFormData } from "../../utils/types";
import CreateVoteForm from "./CreateVoteForm";
import DisplayResult from "./DisplayResult";
import LoadingResult from "./LoadingResult";
import { VoteType } from "./VoteTypePanel";

enum PageMode {
  Form = "form",
  Fetching = "fetching",
  Finalized = "finalized",
}

export enum ResultStatus {
  Success = "success",
  Failure = "failure",
}
interface ICreateVotePageProps {
  blockchainData: BlockchainData;
}

interface ICreateVotePageState {
  formData: VoteFormData;
  mode: PageMode;
  resultStatus: ResultStatus;
}

export default class CreateVotePage extends Component<ICreateVotePageProps, ICreateVotePageState> {
  constructor(props) {
    super(props);

    this.state = {
      formData: null,
      mode: PageMode.Form,
      resultStatus: ResultStatus.Success,
    };
  }

  public setSubmitData = (formData) => {
    this.setState(() => ({
      formData,
      mode: PageMode.Fetching,
    }));
  };

  public setModeToForm = () => {
    this.setState(() => ({
      mode: PageMode.Form,
    }));
  };

  public getTransactionResult = async () => {
    const blockchainData = this.props.blockchainData;
    const web3 = blockchainData.web3;
    const manager = blockchainData.manager;
    try {
      let txResponse;
      if (this.state.formData.categoryPanel === "new") {
        txResponse = await manager.methods
          .createVotingWithNewCategory(
            web3.utils.fromUtf8(this.state.formData.chosenCategory),
            this.state.formData.question,
            this.state.formData.answers.map((opt) => web3.utils.fromUtf8(opt)),
            this.state.formData.voteEndTime,
            this.state.formData.voteEndTime + this.state.formData.votingExpiryOption,
            this.state.formData.voteType === VoteType.Private ? true : false,
            this.state.formData.privilegedVoters
          )
          .send();
      } else {
        txResponse = await manager.methods
          .createVotingWithExistingCategory(
            this.state.formData.chosenCategory,
            this.state.formData.question,
            this.state.formData.answers.map((opt) => web3.utils.fromUtf8(opt)),
            this.state.formData.voteEndTime,
            this.state.formData.voteEndTime + this.state.formData.votingExpiryOption,
            this.state.formData.voteType === VoteType.Private ? true : false,
            this.state.formData.privilegedVoters
          )
          .send();
      }

      console.log(txResponse);
      this.setState(() => ({
        resultStatus: ResultStatus.Success,
      }));
    } catch (e) {
      console.error(e);
      this.setState(() => ({
        resultStatus: ResultStatus.Failure,
      }));
    } finally {
      this.setState(() => ({
        mode: PageMode.Finalized,
      }));
    }
  };

  public render() {
    return (
      <Grid>
        <Row>
          <Col md={6} mdOffset={3}>
            {this.state.mode === PageMode.Form ? (
              <CreateVoteForm
                setSubmitData={this.setSubmitData}
                formData={this.state.formData}
                blockchainData={this.props.blockchainData}
              />
            ) : this.state.mode === PageMode.Fetching ? (
              <LoadingResult getTransactionResult={this.getTransactionResult} />
            ) : (
              <DisplayResult status={this.state.resultStatus} onClick={this.setModeToForm} />
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}
