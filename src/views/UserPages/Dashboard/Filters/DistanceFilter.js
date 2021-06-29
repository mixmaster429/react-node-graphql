import React, { Component } from 'react'
import InputRange from 'react-input-range';
import {graphql, compose } from 'react-apollo';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// style component
import { cardTitle } from "../../../../assets/jss/material-dashboard-pro-react.jsx";

import { withTranslation, Trans } from 'react-i18next';
import {RADIUS,GET_RADIUS} from '../../../../queries';

import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
};

class DistanceFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    distanceChanged = (value) => {
        this.props.getRadius({ variables: { radius: value } })
    }

 
    render() {
        let { getCacheRadiusData, t } = this.props;

        return (
            <div className='slider cls_locslider'>

                {/* <InputRange
                    step={100}
                    maxValue={500}
                    minValue={0}
                    value={(getCacheRadiusData && getCacheRadiusData.radius) ? getCacheRadiusData.radius : 500}
                    onChange={value => this.distanceChanged(value)}
                /> */}
                {/* {(getCacheRadiusData && getCacheRadiusData.radius) ? getCacheRadiusData.radius : 500} - {t("Carfilter._km")} */}

                <div className="col-lg-1 col-3 col-md-2"><i className="fa fa-home"></i></div>
                <Slider
                    min={0}
                    max={500}
                    tooltip={true}
                    labels={{0: '0',  500: '500'}}
                    value={(getCacheRadiusData && getCacheRadiusData.radius) ? getCacheRadiusData.radius : 500}
                    onChange={value => this.distanceChanged(value)}
                    className="col-lg-10 col-6 col-md-8"
                />
                {/* <div className='value'>
                    {(getCacheRadiusData && getCacheRadiusData.radius) ? getCacheRadiusData.radius : 500} - {
                        t("Carfilter._km")}
                </div> */}
                <div  className="col-lg-1 col-3 col-md-2"><i className="fa fa-road"></i></div>
            </div>

        )
    }
}

var DF = compose(
    graphql(RADIUS, { name: 'getRadius' }),
    graphql(GET_RADIUS, {
        name: "getCacheRadiusData",
        options: () => ({
            fetchPolicy: 'cache-only'
        })
    }),
)(DistanceFilter);

export default withTranslation('common')(withStyles(styles)(DF));
