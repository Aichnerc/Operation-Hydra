//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React, { lazy, Suspense } from "react";
// DOM bindings for React Router
import { Link, withRouter } from "react-router-dom";
// React PropTypes
import PropTypes from "prop-types";

//> MDB Sortable
// MDB plugin for sortable item lists
import MDBSortable from "mdb-react-sortable";

//> SCSS
import "./movableboundary.scss";
//#endregion

//#region > Components
/**
 * @class This enables implememntation of horizontally or vertically movable items into a page.
 */
class MovableBoundary extends React.Component {
  state = {
    items: this.props.items ? this.props.items : null,
    indexArray: null,
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      items: nextProps.items ? nextProps.items : null,
    });

    // If props.edit changes to false, save indexArray.
    if (!nextProps.edit && this.props.edit) {
      this.saveItemOrder();
    }
  };

  componentDidMount() {
    // Load item order after mounting.
    this.loadItemOrder();
  }

  // Load the indexArray from storage.
  // If there's no indexArray,
  // default indexArray [0, 1, 2, 3, ...] will be generated.
  loadItemOrder() {
    let indexArray = localStorage.getItem([this.props.uid]);

    if (!indexArray) {
      let baseIndexArray = [];

      this.state.items.map((item, i) => {
        baseIndexArray = [...baseIndexArray, i];
      });

      indexArray = baseIndexArray;
    } else {
      indexArray = JSON.parse(indexArray);
    }

    this.setState({ indexArray });
  }

  // Returns items ordered by indexArray.
  reorderItems() {
    let orderedItems = [];

    this.state.indexArray.map((index) => {
      orderedItems = [...orderedItems, this.state.items[index]];
    });

    return orderedItems;
  }

  // Store indexArray.
  saveItemOrder() {
    localStorage.setItem(
      [this.props.uid],
      JSON.stringify(this.state.indexArray)
    );
  }

  // Returns items to be rendered in the Sortable.
  renderItems(edit) {
    const items = this.reorderItems();

    return items.map((item) => {
      if (edit) {
        return <div className="SortableItem">{item}</div>;
      } else {
        return (
          <div className="SortableItem unsortable" disabled>
            {item}
          </div>
        );
      }
    });
  }

  // Swaps indexArray position of element.
  swap = (newIndex, oldIndex) => {
    let indexArray = this.state.indexArray;

    if (newIndex >= indexArray.length) {
      let k = newIndex - indexArray.length + 1;

      while (k--) {
        indexArray.push(undefined);
      }
    }

    indexArray.splice(newIndex, 0, indexArray.splice(oldIndex, 1)[0]);

    this.setState({ indexArray });
  };

  render() {
    return (
      <div>
        {this.state.items && this.state.indexArray && (
          <>
            <MDBSortable
              axis={this.props.movementAxis}
              items={this.renderItems(this.props.edit ? true : false)}
              itemClassName={
                this.props.edit ? "SortableItem" : "SortableItem unsortable"
              }
              listClassName="SortableList"
              onSortEnd={(obj, e) => {
                // When item is let go of, change indexArray position of Item.
                this.swap(obj.newIndex, obj.oldIndex);
              }}
            />
          </>
        )}
      </div>
    );
  }
}
//#endregion

//#region > PropTypes
MovableBoundary.propTypes = {
  movementAxis: PropTypes.string,
  items: PropTypes.array.isRequired,
  uid: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};
//#endregion

//#region > Exports
export default MovableBoundary;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
