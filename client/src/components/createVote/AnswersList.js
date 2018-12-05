import React, { Component } from "react";

class AnswersList extends Component {
  render() {
    return (
      <div className="container">
            <ul className="list-group text-center">
              {
                Object.keys(this.props.answers).map(function(key) {
                  return <li className="list-group-item">{this.props.answers[key]}</li>
                }.bind(this))
              }
            </ul>
           </div>
    );
  }
}


export default AnswersList;