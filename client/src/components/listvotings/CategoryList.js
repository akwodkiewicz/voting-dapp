import React, { Component } from "react";
import { fetchCategories } from "../../utils/eth";
import { ListGroupItem, ListGroup } from "react-bootstrap";

class CategoryList extends Component {
  constructor() {
    super();
    this.state = {
      areCategoriesFetched: false,
    };
  }

  componentDidMount = async () => {
    if (this.props.blockchainData) {
      const categories = await fetchCategories(this.props.blockchainData);
      this.props.setCategoriesInParent(categories, null);
      this.setState({ areCategoriesFetched: true });
    }
  };

  componentDidUpdate = async (prevProps) => {
    // If blockchainData was initialized after this component had mounted
    if (!this.state.areCategoriesFetched && this.props.blockchainData) {
      const categories = await fetchCategories(this.props.blockchainData);
      this.props.setCategoriesInParent(categories, null);
      this.setState({ areCategoriesFetched: true });
    }
  };

  handleOnClick = (event) => {
    const chosenCategoryName = event.target.innerText;

    let chosenCategoryIndex;
    for (let i = 0; i < this.props.categories.length; i++) {
      if (this.props.categories[i].name === chosenCategoryName) {
        chosenCategoryIndex = i;
      }
    }
    this.props.setChosenCategoryInParent(chosenCategoryIndex);
  };

  render() {
    return (
      <React.Fragment>
        <h2>Categories</h2>
        {this.state.areCategoriesFetched ? (
          <ListGroup>
            {this.props.categories.map((cat, index) => {
              return (
                <ListGroupItem
                  onClick={this.handleOnClick}
                  {...(index == this.props.chosenCategoryIndex ? { active: true } : null)}
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

export default CategoryList;
