import React, { Component, Fragment } from "react";
import { ControlLabel, DropdownButton, FormGroup, HelpBlock, MenuItem } from "react-bootstrap";
import Loader from "react-loader-spinner";

import { fetchCategories } from "../../utils/eth";
import { BlockchainData, Category } from "../../utils/types";

interface ICategoryListProps {
  blockchainData: BlockchainData;
  categories: Category[];
  chosenCategoryIndex: number;
  setChosenCategoryInParent: (arg: number) => void;
  setCategoriesInParent: (arg: Category[]) => void;
}

interface ICategoryListState {
  areCategoriesFetched: boolean;
  buttonTitle: string;
}

export default class CategoryDropdown extends Component<ICategoryListProps, ICategoryListState> {
  constructor(props) {
    super(props);
    this.state = {
      areCategoriesFetched: false,
      buttonTitle: "Category",
    };
  }

  public componentDidMount = async () => {
    if (this.props.blockchainData) {
      const categories = await fetchCategories(this.props.blockchainData);
      this.props.setCategoriesInParent(categories);
      this.setState({ areCategoriesFetched: true });
    }
  };

  public componentDidUpdate = async () => {
    // If blockchainData was initialized after this component had mounted
    if (!this.state.areCategoriesFetched && this.props.blockchainData) {
      const categories = await fetchCategories(this.props.blockchainData);
      this.props.setCategoriesInParent(categories);
      this.setState({ areCategoriesFetched: true });
    }
  };

  public handleOnClick = (chosenCategoryName: string) => {
    this.setState({ buttonTitle: chosenCategoryName });
    let chosenCategoryIndex: number;
    this.props.categories.forEach((category, index) => {
      if (category.name === chosenCategoryName) {
        chosenCategoryIndex = index;
      }
    });
    this.props.setChosenCategoryInParent(chosenCategoryIndex);
  };

  public render() {
    return (
      <Fragment>
        <FormGroup>
          <ControlLabel style={{ fontSize: "1.5em" }}>Category</ControlLabel>
          <HelpBlock>Select an existing category from the list</HelpBlock>
          {this.state.areCategoriesFetched ? (
            <DropdownButton id="categories" title={this.state.buttonTitle} bsStyle="default">
              {this.props.categories.map((cat, index) => {
                return (
                  <MenuItem
                    key={cat.name}
                    eventKey={cat.name}
                    onSelect={() => this.handleOnClick(cat.name)}
                    {...(index === this.props.chosenCategoryIndex ? { active: true } : null)}
                  >
                    {cat.name}
                  </MenuItem>
                );
              })}
            </DropdownButton>
          ) : (
            <div>
              <Loader type="Grid" color="#00BFFF" height="10%" width="10%" />

              <h2>Fetching data from blockchain...</h2>
            </div>
          )}
        </FormGroup>
      </Fragment>
    );
  }
}
