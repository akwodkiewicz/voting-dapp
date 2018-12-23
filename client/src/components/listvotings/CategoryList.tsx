import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { fetchCategories } from "../../utils/eth";
import { BlockchainData, Category } from "../common/types";

interface ICategoryListProps {
  blockchainData: BlockchainData;
  categories: Category[];
  chosenCategoryIndex: number;
  setChosenCategoryInParent: (arg: number) => void;
  setCategoriesInParent: (arg: Category[]) => void;
}
interface ICategoryListState {
  areCategoriesFetched: boolean;
}

export default class CategoryList extends Component<ICategoryListProps, ICategoryListState> {
  constructor(props) {
    super(props);
    this.state = {
      areCategoriesFetched: false,
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

  public handleOnClick = (event) => {
    const chosenCategoryName = event.target.innerText;

    let chosenCategoryIndex;
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name === chosenCategoryName) {
        chosenCategoryIndex = i;
      }
    }
    this.props.setChosenCategoryInParent(chosenCategoryIndex);
  };

  public render() {
    return (
      <React.Fragment>
        <h2>Categories</h2>
        {this.state.areCategoriesFetched ? (
          <ListGroup>
            {this.props.categories.map((cat, index) => {
              return (
                <ListGroupItem
                  onClick={this.handleOnClick}
                  {...(index === this.props.chosenCategoryIndex ? { active: true } : null)}
                >
                  {cat.name}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        ) : (
          <h3>Fetching data from blockchain...</h3>
        )}
      </React.Fragment>
    );
  }
}
