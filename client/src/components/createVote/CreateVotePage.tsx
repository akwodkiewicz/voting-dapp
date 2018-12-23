import { Component } from "react";
// import "react-datetime/css/react-datetime.css";
import { BlockchainData } from "../common/types";
import CreateVoteForm, { VoteFormData } from "./CreateVoteForm";
import DisplayResult from "./DisplayResult";
import LoadingResult from "./LoadingResult";

enum PageMode {
  Form = "form",
  Fetching = "fetching",
  Finalized = "finalized",
}

enum ResultStatus {
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

class CreateVotePage extends Component<ICreateVotePageProps, ICreateVotePageState> {
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
            this.state.formData.resultsViewingEndTime,
            this.state.formData.voteType,
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
            this.state.formData.resultsViewingEndTime,
            this.state.formData.voteType,
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
    if (this.state.mode === "form") {
      return (
        <CreateVoteForm
          setSubmitData={this.setSubmitData}
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
export { ResultStatus };
