import React, { Component } from "react";
import { FormControl } from "react-bootstrap";

class CategoryPanel extends Component {
  constructor(props) {
    super(props);
  }

  categoryHandler = (chosenCategory) => {
    this.props.setCategoryInParent(chosenCategory.target.value);
  };

  render() {
    const categoryPanel = this.props.categoryPanel;
    if (categoryPanel === "existing") {
      if (this.props.categoriesList) {
        return (
          <React.Fragment>
            <FormControl
              onChange={this.categoryHandler}
              componentClass="select"
              placeholder="select"
              value={this.props.chosenCategory}
            >
              {this.props.categoriesList.map((category) => {
                return <option value={category.address}>{category.name}</option>;
              })}
            </FormControl>
          </React.Fragment>
        );
      } else {
        return <h2>Loading categories from blockchain...</h2>;
      }
    } else {
      return (
        <React.Fragment>
          <FormControl
            onChange={this.categoryHandler}
            id="answer"
            type="text"
            placeholder="Enter new category"
            value={this.props.chosenCategory}
          />
        </React.Fragment>
      );
    }
  }
}

export default CategoryPanel;
