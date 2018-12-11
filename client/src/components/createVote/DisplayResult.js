import React, { Component } from "react";

class DisplayResult extends Component {
  render() {
    if(this.props.status === 'success') {
      return (
        <h1>Congrats m8</h1>
      )
    }
    else {
      return (
        <h1>Better luck next time m8</h1>
      )
    }    
  }
}

export default DisplayResult;