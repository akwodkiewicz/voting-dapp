import React, { Component } from "react";

class DisplayResult extends Component {
  render() {
    if (this.props.status === "success") {
      return <h1>Congrats m8</h1>;
    } else if (this.props.status === "failed") {
      return (
        <div>
          <h1>Operation cancelled!</h1>
          <p>You did not submit your contract. Press the button below to fill the form again.</p>
          <button onClick={this.props.onClick}>Return</button>
        </div>
      );
    }
  }
}

export default DisplayResult;
