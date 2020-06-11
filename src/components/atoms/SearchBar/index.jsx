//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { withRouter } from "react-router-dom";
// React PropTypes
import PropTypes from "prop-types";
//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
//> Fuzzysort
// Fast SublimeText-like fuzzy search for JavaScript
import * as fuzzysort from "fuzzysort";
//> CSS
import "./search.scss";
//#endregion

//#region > Components
/**
 * @class A component which contains a search bar
 */
class SearchBar extends React.Component {
  state = {
    filter: "",
    usernames: [],
  };

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.globalState.loading) {
      this.getUsernameList();
    }
  };

  handleSelection = (event, value) => {
    if (event === "user") {
      this.props.history.push("/u/" + value);
    } else if (event === "search_page") {
      this.props.history.push("/search?q=" + value);
    }
  };

  search = (event) => {
    const value = event.target.value;

    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.handleSelection("search_page", value);
    } else {
      this.setState({
        filter: value,
      });
    }
  };

  getUsernameList = () => {
    const { globalFunctions } = this.props;

    globalFunctions.users().then((usernames) => {
      this.setState({
        usernames,
      });
    });
  };

  render() {
    const { globalState } = this.props;

    //Select component does not support onChange event. Instead, you can use getValue or getTextContent methods.
    return (
      <MDBSelect
        id="search"
        onKeyUp={(e) => this.search(e)}
        getValue={(value) => this.handleSelection("user", value)}
        outline
      >
        <MDBSelectInput selected="Find a user" />
        <MDBSelectOptions search searchLabel="">
          {this.state.usernames ? (
            this.state.usernames.length > 0 && this.state.filter.length > 0 ? (
              fuzzysort
                .go(this.state.filter, this.state.usernames)
                .map((element, i) => {
                  return (
                    <MDBSelectOption
                      key={i}
                      icon={"https://octodex.github.com/images/nyantocat.gif"}
                    >
                      {element.target}
                    </MDBSelectOption>
                  );
                })
            ) : null
          ) : (
            <span>Loading</span>
          )}
        </MDBSelectOptions>
      </MDBSelect>
    );
  }
}
//#endregion

//#region > PropTypes
SearchBar.propTypes = {};
//#endregion

//#region > Exports
//> Default Class
export default withRouter(SearchBar);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Simon Prast
 */
