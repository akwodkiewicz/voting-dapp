import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import NoMetamaskAccess from "../../images/no-acceptance.png";
import NoMetamaskInstalled from "../../images/no-metamask.png";
import AboutPage from "../about/AboutPage";

interface INoAccessPageProps {
  title: string;
  firstParagraph: string;
  secondParagraph: string;
  imgChoice: number;
}

export default class NoAccessPage extends Component<INoAccessPageProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        <Route
          exact
          path="/"
          render={() => (
            <div style={{ width: "100vw", height: "100vh" }}>
              <h1
                style={{
                  fontFamily: "Roboto",
                  fontSize: "4em",
                  marginBottom: "5vh",
                  marginTop: "5vh",
                  textAlign: "center",
                }}
              >
                {this.props.title}
              </h1>
              <img
                style={{
                  display: "block",
                  height: "auto", // 2nd option: 50%
                  marginBottom: "5vh",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxHeight: "50%", // 2nd option: remove
                  maxWidth: "50%", // 2nd option: remove
                  width: "auto", // 2nd option: auto
                }}
                src={this.props.imgChoice === 1 ? NoMetamaskInstalled : NoMetamaskAccess}
              />
              <p style={{ fontSize: "2em", fontFamily: "Roboto", textAlign: "center" }}>{this.props.firstParagraph}</p>
              <p style={{ fontSize: "2em", fontFamily: "Roboto", textAlign: "center" }}>{this.props.secondParagraph}</p>
            </div>
          )}
        />
        <Route exact path="/about" component={AboutPage} />
        <Redirect path="*" to="/" />
      </div>
    );
  }
}
