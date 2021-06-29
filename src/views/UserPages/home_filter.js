import React, { Component } from 'react'
import Filter from "./Dashboard/Filters/Filter";
import PriceFilter from "./Dashboard/Filters/PriceFilter";
import SortFilter from './Dashboard/Filters/SortFilter';
import DateFilter from "./Dashboard/Filters/DateFilter";
import DistanceFilter from "./Dashboard/Filters/DistanceFilter";
import { withTranslation, Trans } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import { getSymbol } from '../../helper.js';
import { compose, graphql } from "react-apollo";
import {
    REDIRECT_HOME, REDIRECT_HOME_FILTER,GET_REDIRECTFILTER_STATE,PRICE,GET_PRICE_DETAILS,SORTBY,GET_SORTBY_DETAILS,DATEBY,GET_DATEBY_DETAILS,LOCATION_NAME, GET_LOCATION_NAME,RADIUS,GET_RADIUS,LOCATION,GET_LOCATION, GET_RESET_BUTTON, UPDATE_RESET_BUTTON,CATEGORY_ID,
    GET_CATEGORY_ID,SEARCH_INPUT,GET_SEARCH_INPUT
} from "../../queries/index";

class Home_filter extends Component {

    state = {
        resetBtn: false,
        price: { min: '', max: '' },
        sort: '',
        sortDate: '',
        resetPrice: false,
        resetDate: false,
        resetSort: false,
        location: false,
        disabledPriceFilter: false
    }

    componentDidMount() {
        // filter fixed in search bar
        var el = document.getElementById('srcFil');
        var el1 = document.getElementById('hdrFx');
        var elTop = el.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        window.addEventListener('scroll', function () {
            if (document.documentElement.scrollTop > elTop) {
                el.classList.add('fxFilt');
                el1.classList.add('bxShdwnon');
            }
            else {
                el1.classList.remove('bxShdwnon');
                el.classList.remove('fxFilt');
            }
        });
    }


    cng0 = () => {
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        }

    cng = (a) => {
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        if (a.min === '') {
            this.setState({
                price: a
            });

            if (this.state.sort === '' && this.state.sortDate === '' ) {
                this.setState({ resetBtn: false })
            }
        } else {
            this.setState({
                resetBtn: true,
                price: a
            });
        }
    }

    cng1 = (a) => {
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        if (a === 'Most Recent') {
            this.setState({
                sort: ''
            });

            if (this.state.price.min === ''  && this.state.sortDate === '') {
                this.setState({ resetBtn: false })
            }

        } else {
            this.setState({
                resetBtn: true,
                sort: a
            });
        }
    }

    // cng2 = (a) => {
    //     this.props.redirectHomeFilter({ variables: { pageCountFilter : true } })
    //     if (a === 'All listings') {
    //         this.setState({
    //             sortDate : ''
    //         });

    //         if (this.state.price.min === '' && this.state.sort === '') {
    //             this.setState({ resetBtn: false })
    //         }

    //     } else {
    //         this.setState({
    //             resetBtn: true,
    //             sortDate : a
    //         });
    //     }
    // }

    resetPrice = () => {
        this.props.getPrice({ variables: { max: 0, min: 0 } });
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        this.setState({
            price: { min: '', max: '' },
            resetPrice: !this.state.resetPrice,
        });
    }

    resetSort = () => {
        const val = "Most Recent";
        this.props.getSortBy({ variables: { sort: val } });
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        this.setState({
            sort: '',
            resetSort: !this.state.resetSort,
        });
    }

    // resetDate = () => {
    //     const val = 'All listings';
    //     this.props.getDateBy({variables:{sortDate: val}});
    //     this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
    //     this.setState({
    //         sortDate: '',
    //         resetDate : !this.state.resetDate,
    //     });
    // }

    resetAll = () => {
        this.props.getSortBy({ variables: { sort: 0 } });
        this.props.getPrice({ variables: { max: 0, min: 0 } });
        this.props.getLocationName({variables:{locationName: "" }})
        //this.props.getLocation({variables: {lat_lon: []}});
        //this.props.redirectHome({ variables: { pageCount: true } })
        this.setState({
            resetBtn: !this.state.resetBtn,
            sort: '',
            sortDate: "",
            price: { min: '', max: '' }
        });
    }


   

    componentWillReceiveProps(nxt) {
        if (nxt.clearFilter !== this.props.clearFilter) {
            const val = "Most Recent";
            const DateVal = "All listings";
            this.setState({
                resetBtn: false,
                sort: '',
                sortDate: "",
                price: { min: '', max: '' },
                location: !this.state.location
            });
            this.props.getPrice({ variables: { max: 0, min: 0 } });
            this.props.getSortBy({ variables: { sort: val } });
            this.props.getDateBy({variables:{sortDate: DateVal}});
            this.props.getLocationName({variables:{locationName: "" }});
            this.props.searchResult({ variables: { searchInput: ""}});
            //this.props.getLocation({variables: {lat_lon: []}});
            //this.props.getRadius({variables:{radius:""}})
            //this.props.redirectHome({ variables: { pageCount: true } })
        }
        if (nxt.getCacheCategoryData === '3') {
            this.setState({
                disabledPriceFilter: true
            })
        } else if (nxt.getCacheCategoryData || nxt.getCacheCategoryData == '') {
            this.setState({
                disabledPriceFilter: false
            })
        }
    }

    render() {
        const {getPriceData,getSortByData,getDateByData,getCacheLocationData,getCacheResetButton,t} = this.props;
        const minL = getPriceData && getPriceData.min;
        const maxL = getPriceData && getPriceData.max;

        const minC =
        getPriceData && getPriceData.min
            ? getSymbol(localStorage.getItem("currencySymbol")) + getPriceData.min
            : "";
        const maxC =
        getPriceData && getPriceData.max
            ? " -" + getSymbol(localStorage.getItem("currencySymbol")) + getPriceData.max
            : "";
        const price = (minL > 0 || maxL > 0) && (((minL === 0)|| (minL === "")) ? "Negotiable" : "") + minC + maxC;

        const options = [
        "Homepagefilter._MostRecent",
        "Homepagefilter._lowtohigh",
        "Homepagefilter._hightolow",
        "Homepagefilter._ClosestFirst"
        ];
    
        const sortValue = getSortByData &&  getSortByData.sort 
        ? options.find((e,i) => i == getSortByData.sort) 
        : options.find((e,i) => i == getSortByData)

        const Dateoptions = [
            'Homepagefilter._AllLisings',  
            'Homepagefilter._last24', 
            'Homepagefilter._last7', 
            'Homepagefilter._last30'
        ]

        const sortDateValue = getDateByData &&  getDateByData.sortDate 
        ? Dateoptions.find((e,i) => i == getDateByData.sortDate) 
        : Dateoptions.find((e,i) => i == getDateByData)


        return (
            <div id="srcFil">
                <div className="flx" >
                    <div className="overall-filt">
                        <div className="respfile">
                            <div class="comonw locrespgh">
                                <div className="filterhover-eff">
                                    <Filter 
                                        location={this.state.location} 
                                        getCacheLocationData={this.props.getCacheLocationData} 
                                        change={this.cng0}
                                    />
                                  
                                </div>
                            </div>
                            
                            {/* { 
                              (getCacheLocationData && getCacheLocationData.lat_lon) ? 
                                <div class="comonw locrespgh distanceFilter cls_res_dist">
                                   <span>{this.props.t("Homepagefilter._Distance")}</span>
                                    <div className="filterhover-eff">
                                         <DistanceFilter /> 
                                    </div>
                                </div> 
                            : ""  } */}
                             
                            <div class="comonw pricseee">
                                <div className="filterhover-eff" >
                                    <div className={this.state.disabledPriceFilter === true ? "disabled" : ""}>
                                        <PriceFilter 
                                         getPriceData={this.props.getPriceData}
                                         resetPrice={this.state.resetPrice} 
                                         change={this.cng} 
                                         reset={this.state.resetBtn} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="comonw sortfillee">
                                <div className="filterhover-eff">
                                    <SortFilter
                                        getSortByData={this.props.getSortByData} 
                                        change={this.cng1} 
                                        resetSort={this.state.resetSort} 
                                        reset={this.state.resetBtn} />
                                </div>
                            </div>
                            {/* <div class="comonw sortfillee">
                                <div className="filterhover-eff">
                                    <DateFilter
                                    getDateByData={this.props.getDateByData} 
                                    change={this.cng2} 
                                    resetDate={this.state.resetDate} 
                                    reset={this.state.resetBtn} />
                                </div>
                            </div> */}
                        </div>
                    </div>
                    {this.state.resetBtn && <button onClick={this.resetAll} type="button" className="reset resposnreset">
                        {this.props.t('Homepagefilter._Reset')}
                    </button>}
                </div>

                <div className="filterBx cls_onlyboth">
                    {(minL > 0 || maxL > 0) && <span>{price} <CloseIcon onClick={this.resetPrice} /></span>}
                    {(sortValue != undefined) && <span>{t(sortValue)} <CloseIcon onClick={this.resetSort} /></span>}
                    {/* {(sortDateValue != undefined) && <span>{t(sortDateValue)} <CloseIcon onClick={this.resetDate} /></span>} */}
                </div>
            </div>
        )
    }
}

var homeFilter = compose(
    graphql(REDIRECT_HOME_FILTER, {
        name: "redirectHomeFilter"
    }),
    graphql(GET_REDIRECTFILTER_STATE, {
        name: "pageCountFilter",
        options: () => ({
          fetchPolicy: 'cache-only'
        })
      }),
    graphql(PRICE, { name: "getPrice" }),
    graphql(SEARCH_INPUT, { name: "searchResult" }),
    graphql(GET_SEARCH_INPUT, {
        name: "getCacheSearchInput",
        options: () => ({
          fetchPolicy: "cache-only"
        })
      }),

    graphql(GET_PRICE_DETAILS, {
            name: "getPriceData",
            options: () => ({
            fetchPolicy: "cache-only"
            })
        }),
    graphql(SORTBY, { name: "getSortBy" }),
    graphql(GET_SORTBY_DETAILS, {
        name: "getSortByData",
        options: () => ({
        fetchPolicy: "cache-only"
        })
    }),
    graphql(DATEBY, {name: 'getDateBy'}),
    graphql(GET_DATEBY_DETAILS, {
        name: "getDateByData",
        options: () => ({
        fetchPolicy: 'cache-only'
        })
    }),
    graphql(LOCATION_NAME, {name: 'getLocationName'}),
    graphql(GET_LOCATION_NAME, {
    name: "getLoactionNameData",
    options: () => ({
        fetchPolicy: 'cache-only'
        })
    }),
    graphql(RADIUS, {name: 'getRadius'}),
    graphql(GET_RADIUS, {
      name: "getCacheRadiusData",
      options: () => ({
          fetchPolicy: 'cache-only'
        })
    }),
    graphql(LOCATION, {name: 'getLocation'}),
    graphql(GET_LOCATION, {
      name: "getCacheLocationData",
      options: () => ({
          fetchPolicy: 'cache-only'
        })
    }),
    graphql(UPDATE_RESET_BUTTON, {name: 'updateResetButton'}),
    graphql(GET_RESET_BUTTON, {
      name: "getCacheResetButton",
      options: () => ({
          fetchPolicy: 'cache-only'
        })
    }),
    graphql(CATEGORY_ID, { name: 'getCategoryId' }),
    graphql(GET_CATEGORY_ID, { name: "getCacheCategoryData", options: () => ({ fetchPolicy: 'cache-only' }) })
)(Home_filter);

export default withTranslation('common')(homeFilter);