import React, { Component } from "react";
import { FormControl, FormGroup, HelpBlock } from "react-bootstrap";
import { CategoryPanelType, Validation } from "../../utils/enums";
import { Category, ContractAddress } from "../../utils/types";

export interface ICategoryPanelProps {
  categoriesList: Category[];
  categoryPanel: CategoryPanelType;
  chosenCategory: string | ContractAddress;
  newCategoryExists: boolean;
  setCategoryInParent: (arg: string) => void;
  touched: boolean;
  valid: boolean;
}

export default class CategoryPanel extends Component<ICategoryPanelProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const categoryPanel = this.props.categoryPanel;
    if (categoryPanel === "existing") {
      if (this.props.categoriesList) {
        return (
          <FormGroup>
            <FormControl
              componentClass="select"
              id="categoryPanelExisting"
              onChange={this.categoryHandler}
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
        return <h2 id="categoryPanelFetchingMessage">Loading categories from blockchain...</h2>;
      }
    } else {
      return (
        <FormGroup
          validationState={this.props.touched ? (this.props.valid ? Validation.Success : Validation.Error) : null}
        >
          <FormControl
            onChange={this.categoryHandler}
            id="answer"
            type="text"
            placeholder="Category name here"
            value={this.props.chosenCategory ? this.props.chosenCategory : ""}
          />
          <FormControl.Feedback />
          {this.props.touched && !this.props.valid ? (
            this.props.chosenCategory.length === 0 ? (
              <HelpBlock id="categoryPanelValidationEmptyMessage">Category name cannot be empty</HelpBlock>
            ) : this.props.newCategoryExists ? (
              <HelpBlock>Category with this name already exists</HelpBlock>
            ) : (
              <HelpBlock id="categoryPanelValidationTooLongMessage">
                Category name cannot be larger than 32 bytes
              </HelpBlock>
            )
          ) : null}
        </FormGroup>
      );
    }
  }

  private categoryHandler = (chosenCategory) => {
    this.props.setCategoryInParent(chosenCategory.target.value);
  };
}
