import React, { Component } from "react";
import { ListGroup, ListGroupItem, Panel } from "react-bootstrap";
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

  public handleOnClick = (event: React.MouseEvent<ListGroupItem & HTMLInputElement>) => {
    const chosenCategoryName = event.currentTarget.innerText;

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
      <Panel>
        <Panel.Heading>Categories</Panel.Heading>
        {this.state.areCategoriesFetched ? (
          <ListGroup>
            {this.props.categories.map((cat, index) => {
              return (
                <ListGroupItem
                  key={cat.address}
                  onClick={this.handleOnClick}
                  {...(index === this.props.chosenCategoryIndex ? { active: true } : null)}
                >
                  {cat.name}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        ) : (
          <Panel.Body>Fetching data from blockchain...</Panel.Body>
        )}
      </Panel>
    );
  }
}
