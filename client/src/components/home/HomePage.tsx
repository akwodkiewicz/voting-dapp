import { Component } from "react";
import { Link } from "react-router-dom";

class HomePage extends Component {
  public render() {
    return (
      <div className="jumbotron">
        <h1>Testing routing</h1>
        <p>This app is the future</p>
        <Link to="/about" className="btn btn-primary btn-lg">
          About us
        </Link>
      </div>
    );
  }
}

export default HomePage;
