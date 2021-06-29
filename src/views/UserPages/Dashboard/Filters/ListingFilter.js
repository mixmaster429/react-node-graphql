import React from "react";
import { compose, graphql, Query } from "react-apollo";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { SORTBY,GET_SORTBY_DETAILS } from "../../../../queries";

const options = ["All Listings", "The last 24 hours", "The last 7 days", "The last 30 days"]

class ListingFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'All Listings'};
  }
  onChange(e) {
     this.setState({value: e.target.value});
     //this.props.getSortBy({variables:{sort :e.target.value}});
  }
  render() {
    return (
      <div className="form-group">
        <select value={this.state.value} onChange={this.onChange.bind(this)} className="location-filter most-recent">
        {options.map((option,index) => {
          return <option value={index} key={option} >{option}</option>
        })}
      </select>
      </div>
      
    )
  }
}

ListingFilter.propTypes = {
    onChange: PropTypes.func
  };

var LF=compose(
    graphql(SORTBY, {name: 'getSortBy'}),
    graphql(GET_SORTBY_DETAILS, {
      name: "getSortByData",
      options: () => ({
          fetchPolicy: 'cache-only'
        })
  }),
  )(ListingFilter);
  
  export default withStyles(styles)(LF);


