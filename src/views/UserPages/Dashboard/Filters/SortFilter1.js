import React from "react";
import { compose, graphql } from "react-apollo";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { SORTBY, GET_SORTBY_DETAILS } from "../../../../queries";
import { withTranslation } from "react-i18next";
import DoneIcon from "@material-ui/icons/Done";

class SortFilter1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: "Most Recent" };
  }
  change = e => {
    const i = e.target.getAttribute("keyy");
    const value = e.target.getAttribute("data");
    this.setState({ value: value });
    this.props.value(value);
    this.props.getSortBy({ variables: { sort: i } });
  };

  componentWillReceiveProps(nextprops) {
    if (nextprops.resetSort !== this.props.resetSort) {
      const val = "Most Recent";
      this.setState({
        value: val
      });
      this.props.value(val);
      this.props.getSortBy({ variables: { sort: val } });
    }

    if (nextprops.reset !== true) {
      const val = "Most Recent";
      this.setState({ value: val });
      this.props.getSortBy({ variables: { sort: val } });
    }
  }

  render() {
    let { t } = this.props;
    const options = [
      "Homepagefilter._MostRecent",
      "Homepagefilter._lowtohigh",
      "Homepagefilter._hightolow",
      "Homepagefilter._ClosestFirst"
    ];
    return (
      <>
        {options.map((option, i) => (
          <div onClick={this.change} keyy={i} key={i} data={option}>
            {t(option)} {this.state.value === t(option) && <DoneIcon />}
          </div>
        ))}
      </>
    );
  }
}

SortFilter1.propTypes = {
  change: PropTypes.func
};

var SF = compose(
  graphql(SORTBY, { name: "getSortBy" }),
  graphql(GET_SORTBY_DETAILS, {
    name: "getSortByData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  })
)(SortFilter1);

export default withTranslation("common")(withStyles(styles)(SF));
