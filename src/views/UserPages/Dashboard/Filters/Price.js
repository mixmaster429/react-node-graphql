import React from "react";
import PropTypes from "prop-types";
import InputRange from "react-input-range";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import {graphql, compose } from "react-apollo";
import { GET_PRICE_DETAILS,PRICE } from "../../../../queries";

class Price extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: { min: 0, max: 10 },
    };
  }
  
  handleChange = (value) =>{
    this.setState({value})
    this.props.getPrice({variables:{max:value.max,min:value.min}});
  }
  
  render() {
    return (
      <InputRange
        maxValue={20}
        minValue={0}
        value={this.state.value}
        onChange={value =>{this.handleChange(value)}} />
    );
  }
}

Price.propTypes = {
  onChange: PropTypes.func
};

var PriceDetails=compose(
  graphql(PRICE, {name: 'getPrice'}),
  graphql(GET_PRICE_DETAILS, {
    name: "getPriceData",
    options: () => ({
        fetchPolicy: 'cache-only'
      })
}),
)(Price);


export default withStyles(styles)(PriceDetails);
