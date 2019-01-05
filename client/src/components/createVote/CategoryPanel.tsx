import React, { Component } from "react";
import { FormControl, FormGroup } from "react-bootstrap";
import { Category, ContractAddress } from "../../utils/types";

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
          <FormGroup>
            <FormControl
              onChange={this.categoryHandler}
              componentClass="select"
              placeholder="select"
              value={this.props.chosenCategory ? this.props.chosenCategory : ""}
            >
              {this.props.categoriesList.map((category) => {
                return (
                  <option value={category.address} key={category.address}>
                    {category.name}
                  </option>
                );
              })}
            </FormControl>
          </FormGroup>
        );
      } else {
        return <h2>Loading categories from blockchain...</h2>;
      }
    } else {
      return (
        <FormGroup>
          <FormControl
            onChange={this.categoryHandler}
            id="answer"
            type="text"
            placeholder="Category name here"
            value={this.props.chosenCategory ? this.props.chosenCategory : ""}
          />
        </FormGroup>
      );
    }
  }
}
