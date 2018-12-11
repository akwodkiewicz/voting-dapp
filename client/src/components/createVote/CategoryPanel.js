import React, { Component } from "react";
import { FormControl }from 'react-bootstrap';


class CategoryPanel extends Component {
  constructor(props) {
    super(props);

    this.getCategoryHandler = this.getCategoryHandler.bind(this);
  }

  getCategoryHandler(categoryName) {
    this.props.getCategory(categoryName.target.value);
  }

  render() {
    const categoryPanel = this.props.categoryPanel;
    if (categoryPanel === 'existing') {
      return (
        <React.Fragment>
          <FormControl onChange={this.getCategoryHandler} componentClass="select" placeholder="select">
            <option value="arts">Arts</option>
            <option value="politics">Business</option>
            <option value="computer-science">Computer science</option>
          </FormControl>
        </React.Fragment>
      )
    }
    else {
      return(      
        <React.Fragment >
          <FormControl onChange={this.getCategoryHandler} id="answer" type="text" placeholder="Enter new category"/>
        </React.Fragment>      
      )
    }
  }
}

export default CategoryPanel;