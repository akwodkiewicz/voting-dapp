import React, { Component } from "react";
import { Col, Grid, Row } from "react-bootstrap";
import "react-datetime/css/react-datetime.css"; // tslint:disable-line
import { TransactionReceipt } from "web3/types"; // tslint:disable-line
import { BlockchainData, ContractAddress, VoteFormData } from "../../utils/types";
import CreateVoteForm, { ICreateVoteFormState } from "./CreateVoteForm";
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

export type VotingCreatedEventData = { creator: ContractAddress; votingAddress: ContractAddress; question: string };

interface ICreateVotePageProps {
  blockchainData: BlockchainData;
}

interface ICreateVotePageState {
  formData: VoteFormData;
  mode: PageMode;
  resultStatus: ResultStatus;
  txHash: ContractAddress;
  votingCreatedEventData: VotingCreatedEventData;
}

export default class CreateVotePage extends Component<ICreateVotePageProps, ICreateVotePageState> {
  constructor(props) {
    super(props);

    this.state = {
      formData: null,
      mode: PageMode.Form,
      resultStatus: ResultStatus.Success,
      txHash: "",
      votingCreatedEventData: null,
    };
  }

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
            this.state.formData.voteEndDateTime.unix(),
            this.state.formData.voteEndDateTime.unix() + this.state.formData.votingExpiryOption,
            this.state.formData.voteType === VoteType.Private ? true : false,
            this.state.formData.voteType === VoteType.Private ? this.state.formData.privilegedVoters : []
          )
          .send();
      } else {
        txResponse = await manager.methods
          .createVotingWithExistingCategory(
            this.state.formData.chosenCategory,
            this.state.formData.question,
            this.state.formData.answers.map((opt) => web3.utils.fromUtf8(opt)),
            this.state.formData.voteEndDateTime.unix(),
            this.state.formData.voteEndDateTime.unix() + this.state.formData.votingExpiryOption,
            this.state.formData.voteType === VoteType.Private ? true : false,
            this.state.formData.voteType === VoteType.Private ? this.state.formData.privilegedVoters : []
          )
          .send();
      }
      const txReceipt = txResponse as TransactionReceipt;
      const txHash = txReceipt.transactionHash;
      const votingCreatedEventData = web3.eth.abi.decodeLog(
        [
          {
            indexed: false,
            name: "creator",
            type: "address",
          },
          {
            indexed: false,
            name: "votingAddress",
            type: "address",
          },
          {
            indexed: false,
            name: "question",
            type: "string",
          },
        ],
        txReceipt.events.VotingCreated.raw.data,
        txReceipt.events.VotingCreated.raw.topics
      ) as VotingCreatedEventData;

      this.setState(() => ({
        resultStatus: ResultStatus.Success,
        txHash,
        votingCreatedEventData,
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
          {this.state.mode === PageMode.Form ? (
            <Col md={10} mdOffset={1}>
              <CreateVoteForm
                setSubmitData={this.setSubmitData}
                formData={this.state.formData}
                blockchainData={this.props.blockchainData}
              />
            </Col>
          ) : this.state.mode === PageMode.Fetching ? (
            <Col md={6} mdOffset={3}>
              <LoadingResult getTransactionResult={this.getTransactionResult} />
            </Col>
          ) : (
            <Col md={8} mdOffset={2}>
              <DisplayResult
                status={this.state.resultStatus}
                softReset={this.setModeToForm}
                hardReset={this.resetPage}
                votingCreatedEventData={this.state.votingCreatedEventData}
                txHash={this.state.txHash}
              />
            </Col>
          )}
        </Row>
      </Grid>
    );
  }

  private setSubmitData = (formState: ICreateVoteFormState) => {
    const formData: VoteFormData = {
      answers: formState.answers,
      categoryPanel: formState.categoryPanelProps.categoryPanel,
      chosenCategory: formState.categoryPanelProps.chosenCategory,
      privilegedVoters: formState.privilegedVoters,
      question: formState.question,
      voteEndDateTime: formState.voteDatesProps.endDateTime,
      voteType: formState.voteType,
      votingExpiryOption: formState.voteDatesProps.votingExpiryOption,
    };
    this.setState(() => ({
      formData,
      mode: PageMode.Fetching,
    }));
  };

  private setModeToForm = () => {
    this.setState(() => ({
      mode: PageMode.Form,
    }));
  };

  private resetPage = () => {
    this.setState(() => ({
      formData: null,
      mode: PageMode.Form,
      txHash: "",
      votingCreatedEventData: null,
    }));
  };
}
