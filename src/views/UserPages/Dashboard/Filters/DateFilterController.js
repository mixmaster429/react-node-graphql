import React from 'react';
import { compose, graphql, Query } from 'react-apollo';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent";
import { DATEBY,GET_DATEBY_DETAILS } from '../../../../queries/index';

import { withTranslation, Trans } from 'react-i18next';

import DoneIcon from '@material-ui/icons/Done';



class DateFilterController extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { value: 'All listings'};
  }

  change = (e) => {
     const i = e.target.getAttribute('keyy');
     const value = e.target.getAttribute('data');
    this.setState({value: value});
    this.props.value(value);
    this.props.getDateBy({variables:{sortDate: i}});
  }

  componentWillReceiveProps(nextprops) {

    if(nextprops.resetDate !== this.props.resetDate){
      const val = 'All listings';
      this.setState({
        value: val
      })
      this.props.value(val);      
      this.props.getDateBy({variables:{sortDate: val}});
    }

    if(nextprops.reset !== true){
      const val = 'All listings';
      this.setState({value: val});
      this.props.getDateBy({variables:{sortDate: val}});
    }
  }

  render() {
    const options = [this.props.t('Homepagefilter._AllLisings'),  this.props.t('Homepagefilter._last24'), this.props.t('Homepagefilter._last7'), this.props.t('Homepagefilter._last30')]

    return (
      <>
      {options.map((option, i) => <div onClick={this.change} keyy={i} key={i} data={option} >
      {option} {this.state.value === option && <DoneIcon/>}
      </div>)} 
      </>
    )
  }
}

DateFilterController.propTypes = {
  change: PropTypes.func
};

var SF=compose(
    graphql(DATEBY, {name: 'getDateBy'}),
    graphql(GET_DATEBY_DETAILS, {
    name: "getDateByData",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
}),
)(DateFilterController);
  
export default withTranslation('common')(withStyles(styles)(SF));
