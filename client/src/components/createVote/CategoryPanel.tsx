import React, { Component, Fragment } from "react";
import { FormControl } from "react-bootstrap";
import { Category, ContractAddress } from "../common/types";

export enum CategoryPanelType {
  Existing = "existing",
  New = "new",
}

interface ICategoryPanelProps {
  categoriesList: Category[];
  categoryPanel: CategoryPanelType;
  chosenCategory: string | ContractAddress;
  setCategoryInParent: (arg: string) => void;
}

export default class CategoryPanel extends Component<ICategoryPanelProps> {
  constructor(props) {
    super(props);
  }

  public categoryHandler = (chosenCategory) => {
    this.props.setCategoryInParent(chosenCategory.target.value);
  };

  public render() {
    const categoryPanel = this.props.categoryPanel;
    if (categoryPanel === "existing") {
      if (this.props.categoriesList) {
        return (
          <Fragment>
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
          </Fragment>
        );
      } else {
        return <h2>Loading categories from blockchain...</h2>;
      }
    } else {
      return (
        <Fragment>
          <FormControl
            onChange={this.categoryHandler}
            id="answer"
            type="text"
            placeholder="Enter new category"
            value={this.props.chosenCategory}
          />
        </Fragment>
      );
    }
  }
}
