import React from "react";
import { compose, graphql,ApolloConsumer } from "react-apollo";
import {
  GET_ALL_PRODUCTS,
  GET_CATEGORIES,
  UPDATE_CHAT_GROUP,
  GET_CURRENT_USER,
  GET_CACHE_STATE,
  ISOPEN,
  INACTIVE,
  GET_CATEGORY_ID,
  CATEGORY_ID,
  GET_SEARCH_INPUT,
  SEARCH_INPUT,
  GET_LOCATION,
  GET_SITE_INFO,
  LOCATION,
  PRICE,
  GET_PRICE_DETAILS,
  SORTBY,
  GET_SORTBY_DETAILS,
  DATEBY,
  GET_DATEBY_DETAILS,
  GET_REDIRECT_STATE,
  GET_REDIRECTFILTER_STATE,
  GET_CURRENCIES,
  RADIUS,
  GET_RADIUS,
} from "../../queries";
import Products from "./Dashboard/Products.jsx";
import CategoryFilter from "./Dashboard/Filters/Category.jsx";
import Chat from "./Chat/index.jsx";
import Header from "./Header/index.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import pagesStyle from "../../assets/jss/material-dashboard-pro-react/layouts/pagesStyle.jsx";
import HomeFilter from "./home_filter.js";
import Footer from "./Footer/Footer.jsx";
import { animateScroll as scroll } from "react-scroll";
import Slider from "react-slick";
import topad from "../../assets/img/topad.png";

import smart_banner2 from "../../assets/img/smart_banner_shape_2.svg";
import smart_banner1 from "../../assets/img/smart_banner_shape_1.svg";

import "react-sliding-pane/dist/react-sliding-pane.css";
import { ProviderRefech, ProductConsumer } from "./ProductContext.js";
import googleplay from "../../assets/img/badge_googleplay.svg";
import appstroe from "../../assets/img/badge_appstore.svg";
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

// const style = {
//   marginTop: "15px",
//   marginBottom: "20px"
// };

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cUser: {},
      openHandler: false,
      showScroll: false,
      bannerVisible: true,
      bannerVisibleFirst: true,
      title: "",
      favicon: "",
      iosLink: "",
      androidLink: "",
      isPaneOpen: false,
      clearFilter: false,
      bannerImages: [],
      bannerUrl: "",
      categoryList: "",
      currency: ""
    };
    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
    this.setRef = this.setRef.bind(this);
    this.bRef = this.bRef.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);

    this.bannerLink = this.bannerLink.bind(this);
  }
  setRef(node) {
    this.wrapperRef = node;
  }
  bRef(node) {
    this.blockRef = node;
  }
  componentWillMount() {
    let { currentUser, siteInfo, categoryInfo } = this.props;
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });

    siteInfo.refetch();

    if (siteInfo.getSiteInfo) {
      let { iosLink, androidLink, favicon, name } = siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon: favicon,
        iosLink: iosLink,
        androidLink: androidLink
      });
    }

    let bannerImages = [];
    let bannerUrl = "";
    categoryInfo
      .refetch()
      .then(({ data }) => {
        if (data) {
          bannerImages =
            data.getCategoryDetails && data.getCategoryDetails.adBannerDetails;
          this.setState({
            bannerImages: bannerImages,
            bannerUrl: bannerUrl
          });
        }
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    window.addEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
    const storage = localStorage.getItem("evnt");
    const storageTop = localStorage.getItem("banne");
    if (storage === 1) {
      this.setState({
        bannerVisible: false
      });
    }
    if (storageTop === 2) {
      this.setState({
        bannerVisibleFirst: false
      });
    }
  }

  closeBannerEvent = () => {
    localStorage.setItem("evnt", 1);
    this.setState({
      bannerVisible: false
    });
  };

  closeBannerEventtop = () => {
    localStorage.setItem("banne", 2);
    this.setState({
      bannerVisibleFirst: false
    });
  };
  componentWillUnmount() {
    window.removeEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
  }

  setCategory = data => {
    const categoryData =
      data.getCategoryDetails && data.getCategoryDetails.category
        ? data.getCategoryDetails.category
        : [];
    this.setState({
      categoryList: categoryData
    });
  };

  componentScroll = () => {
    const scope = this;
    var winheight =
      window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
    var D = document;
    var docheight = Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight
    );
    var scrollTop =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
    var trackLength = docheight - winheight;
    var pctScrolled = Math.floor((scrollTop / trackLength) * 100);
    // console.log(pctScrolled);
    if (pctScrolled > 10) {
      scope.setState({
        showScroll: true
      });
    } else {
      scope.setState({
        showScroll: false
      });
    }
  };

  scrollToTop() {
    scroll.scrollToTop();
  }

  componentWillReceiveProps(nextProps) {
    let {
      currentUser,
      getCacheData,
      getCacheCategorytypeData,
      getCacheCategoryData,
      getCacheSearchInput,
      getCacheLocationData,
      getPriceData,
      getSortByData,
      getDateByData,
      getLoadCount,
      getLoadCountFilter,
      //getCacheRadiusData
    } = nextProps;
    if (
      nextProps.getCacheData !== this.props.getCacheData ||
      nextProps.getCacheCategoryData !== this.props.getCacheCategoryData ||
      nextProps.getCacheSearchInput !== this.props.getCacheSearchInput ||
      nextProps.getCacheLocationData !== this.props.getCacheLocationData ||
      nextProps.getPriceData !== this.props.getPriceData ||
      nextProps.getDateByData != this.props.getDateByData ||
      nextProps.getSortByData !== this.props.getSortByData ||
      nextProps.getLoadCount !== this.props.getLoadCount ||  
      nextProps.getLoadCountFilter !== this.props.getLoadCountFilter 
     // || nextProps.getCacheRadiusData !== this.props.getCacheRadiusData
    ) {
      this.setState({
        inActive: getCacheData.inActive,
        categoryId: getCacheCategoryData.categoryId,
        searchInput: getCacheSearchInput.searchInput,
        lat_lon: getCacheLocationData.lat_lon,
        min_max: getPriceData,
        sortDate: getDateByData.sortDate,
        min:getPriceData && getPriceData.min,
        max:getPriceData && getPriceData.max,
        sort: getSortByData.sort,
        pageCount: getLoadCount.pageCount,
        pageCountFilter : getLoadCountFilter.pageCountFilter
      });
    }

    currentUser.refetch();

    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {
        iosLink,
        androidLink,
        name,
        favicon
      } = nextProps.siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon: favicon,
        iosLink: iosLink,
        androidLink: androidLink
      });
    }
  }

  handleActiveScreen(e) {
    e.preventDefault();
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.props.inActiveScreen({ variables: { inActive: false } });
    }
    if (this.blockRef && !this.blockRef.contains(e.target)) {
      this.props.isOpenScreen({ variables: { open: false } });
    }
  }
  handleClick(e, id) {
    e.preventDefault();
    this.props.getCategoryId({ variables: { categoryId: id } });
  }

  handleChange(event) {
    event.preventDefault();
    this.props.searchResult({ variables: { searchInput: event } });
  }
  handlePlacesChanged() {
    // this.props.getLocation({variables:{lat_lon:getCacheLocationData.lat_lon}})
  }

  gooApp = link => {
    window.open(link, "_blank");
  };

  bannerLink(bannerUrl, e) {
    window.open(bannerUrl, "_blank");
  }

  clearFilter = cng => {
    this.setState({
      clearFilter: cng
    });
  };

  // head() {
  //   return (
  //     <Helmet>
  //       <title>Home</title>
  //       <link rel="shortcut icon" href={this.state.favicon} />
  //     </Helmet>
  //   );
  // }

  playStore = link => {
    window.open(link, "_blank");
  };

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };

    const { showScroll, bannerImages } = this.state;
    let { classes, match, history, location } = this.props;
    let {
      inActive,
      cUser,
      categoryId,
      searchInput,
      lat_lon,
      min_max,
      sort,
      sortDate,
      bannerVisibleFirst,
      pageCount,
      pageCountFilter, 
      radius, 
      androidLink,
      iosLink,
      min,
      max
    } = this.state;
    let inActiveStyle = inActive ? classes.inActive : "";

    return (
      <div id="content">
        <ProviderRefech>
          {/* {this.head()} */}
          <div className="dynamcss">
            {bannerVisibleFirst && (
              <div className="AtavF">
                <div className="enEXqW">
                  <div className="hqhhAk" onClick={this.closeBannerEventtop}>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      class="SmartBannerstyle__CrossStyled-sc-12kihzo-4 joVGli sc-jTzLTM fznnpf"
                    >
                      <path
                        d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"
                        fill="rgb(255, 255, 255)"
                      ></path>
                    </svg>
                  </div>
                  <div className="hRKplV">
                    <div className="hXHgcm">
                      <span>
                        {" "}
                        Download the free app to get the full experience
                      </span>
                    </div>
                   
                      {/* <span> Android </span>{" "} */}
                  {this.state.androidLink !== "" ? ( <img src={googleplay} alt="" className="cfjxVa" onClick={() =>     this.playStore(androidLink)}/>) : "" }
                  {this.state.iosLink !== "" ? (   <img src={appstroe} alt="" className="cfjxVa" onClick={() =>         this.playStore(iosLink)}/> ) : "" }
                  
                  </div>
                  <div className="gSnPVw">
                    <div className="hmzaZs">
                      <img src={smart_banner1} className="gmsWds" alt="" />
                      <img src={smart_banner2} className="dFLsJo" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={classes.wrap + " " + inActiveStyle}>
              <ProductConsumer>
                {value => (
                  <>
                    {/* <p>{value.mystate} mystate</p> */}
                    <div
                      class={
                        this.state.bannerVisibleFirst === true
                          ? "topbannev"
                          : "unvisible"
                      }
                    >
                      <Header
                        clearFilter={this.clearFilter}
                        stuffImage={value.stuffImage}
                        categorySubmitted={value.categorySubmitted}
                        CategoryWithImage={value.CategoryWithImage}
                        discardStuffStatus={value.discardStuff}
                        discardYourStuff={value.discardYourStuff}
                        manageBeforeLogin={value.stuffValue}
                        refetchValue={value}
                        match={match}
                        setRef={this.setRef}
                        location={location}
                        history={history}
                        currentUser={cUser}
                        postAnotherListing={value.postAnotherListing}
                        contextConsumerInner={value}
                        getCacheCategoryData={categoryId}
                        clickPosting={value.clickPosting}
                        clearValue={value.clearValue}
                        showValue={value.showValue}
                        postDone={value.postDone}
                      />
                    </div>
                  </>
                )}
              </ProductConsumer>

              {location.pathname === "/chat/conversation" ? (
                <Chat
                  setRef={this.bRef}
                  history={history}
                  currentUser={cUser}
                />
              ) : (
                <div>
                  <div
                    class={bannerImages.length > 0 ? "fKpnSY btFx" : "dfsdg"}
                  >
                    {/* <button type="button" role="button" class="SGfuc  gnzmKg" onClick={this.closeBannerEvent}>
                          <svg viewBox="0 0 24 24" width="24" height="24" class="sc-iRbamj dvYpcv"><path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path></svg>
                      </button> */}
                    {bannerImages.length > 0 && (
                      <Slider {...settings}>
                        {bannerImages
                          .filter(item => item.status !== "Inactive")
                          .map((item, i) => (
                            <>
                              <div key={i} data-id={item.id}>
                                <p
                                  onClick={this.bannerLink.bind(
                                    this,
                                    item.bannerUrl
                                  )}
                                >
                                  {" "}
                                  <img src={item.webBannerImage} alt="" />{" "}
                                </p>
                              </div>
                            </>
                          ))}
                      </Slider>
                    )}
                  </div>

                  <div className={classes.container}>
                    <div
                      class={
                        bannerImages.length > 0
                          ? "top-add dUMWSw"
                          : "nobannerdyanamic"
                      }
                    >
                      <img src={topad} className="img-fluid" alt="" />
                    </div>

                 <ProductConsumer>
                      { value => (
                        <CategoryFilter
                            clearFilter={this.state.clearFilter}
                            getLoadCount={pageCount}
                            categoryList={this.state.categoryList}
                            AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                            FilterValue={value.FilterValue}
                            />
                       )}
                  </ProductConsumer>
                    <div className="rermode">
                      <HomeFilter
                        clearFilter={this.state.clearFilter}
                        getCacheCategoryData={categoryId}
                        getLoadCount={pageCount}
                        getPriceData={min_max}
                        getSortByData={sort}
                        getDateByData={sortDate}
                        getCacheLocationData={lat_lon}
                      />
                    </div>
                    <ApolloConsumer>
                    { client => (
                    <ProductConsumer>
                      {value => (
                        <Products
                          clearbyLocation={this.state.clearFilter}
                          currentUser={cUser}
                          client={client}
                          getCacheCategoryData={categoryId}
                          getCacheSearchInput={searchInput}
                          getCacheLocationData={lat_lon}
                          getPriceData={min_max}
                          min={min}
                          max={max}
                          getSortByData={sort}
                          getDateByData={sortDate}
                          getLoadCount={pageCount}
                          getCacheRadiusData={radius}
                          getLoadCountFilter={pageCountFilter}
                          history={history}
                          allproductsValue={value.mystate}
                          userEditClicked={value.userEditClicked}
                          userEditActivated={value.userEditActivated}
                          PostProduct={value.PostProduct}
                          postAnotherListing={value.postAnotherListing}
                          CategorySubmittedinProducts={
                            value.CategorySubmittedinProducts
                          }
                          categorySubmitted={value.categorySubmitted}
                          stuffImage={value.stuffImage}
                          stuffImageEdit={value.stuffImageEdit}
                          AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                          FilterValue={value.FilterValue}
                          AdvancedFilter={value.AdvancedFilter}
                          showValue={value.showValue}
                          postDone={value.postDone}
                        />
                      )}
                    </ProductConsumer>
                      )}
                      </ApolloConsumer>
                  </div>
                  <ApolloConsumer>
                    { client => (
                        <ProductConsumer>
                            {value => (
                              <Footer 
                                getCategory={this.setCategory}  
                                AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                                FilterValue={value.FilterValue}
                                AdvancedFilter={value.AdvancedFilter}
                                client={client}
                              />
                            )}
                          </ProductConsumer>
                    )}
                   </ApolloConsumer>
                  {showScroll && (
                    <div className={cUser && cUser.id ? "anchor-fixed cls_loganchor" : "anchor-fixed"} onClick={this.scrollToTop}>
                      <a>
                        <span>
                          {" "}
                          <i class="fa fa-chevron-up" aria-hidden="true"></i>
                        </span>{" "}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* <SlidingPane
                          className="some-custom-class"
                          overlayClassName="some-custom-overlay-class"
                          isOpen={ this.state.isPaneOpen }
                          title="What are you selling"
                      onRequestClose={ () => {
                            this.setState({ isPaneOpen: false });
                          } }>
                          <div>{<Category />}</div>
                      </SlidingPane> */}
        </ProviderRefech>
      </div>
    );
  }
}

var DashboardComponent = compose(
  graphql(GET_ALL_PRODUCTS, {
    name: "productsInfo",
    options: () => ({
      variables: {
        filter: {}
      }
    })
  }),
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),

  graphql(UPDATE_CHAT_GROUP, "updateChatGroup"),
  graphql(GET_CURRENT_USER, {
    name: "currentUser"
  }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(GET_CACHE_STATE, {
    name: "getCacheData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(SEARCH_INPUT, { name: "searchResult" }),
  graphql(GET_CATEGORY_ID, {
    name: "getCacheCategoryData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),

  graphql(GET_SEARCH_INPUT, {
    name: "getCacheSearchInput",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_REDIRECT_STATE, {
    name: "getLoadCount",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),

  graphql(LOCATION, { name: "getLocation" }),
  graphql(GET_LOCATION, {
    name: "getCacheLocationData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(PRICE, { name: "getPrice" }),
  graphql(GET_PRICE_DETAILS, {
    name: "getPriceData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_CURRENCIES, { name: "currencyInfo" }),
  graphql(SORTBY, { name: "getSortBy" }),
  graphql(GET_SORTBY_DETAILS, {
    name: "getSortByData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
graphql(DATEBY, { name: 'getDateBy' }),
graphql(GET_DATEBY_DETAILS, {
  name: "getDateByData",
  options: () => ({
    fetchPolicy: 'cache-only'
  })
}),
graphql(GET_REDIRECTFILTER_STATE, {
  name: "getLoadCountFilter",
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
)(Dashboard);

export default withStyles(pagesStyle)(DashboardComponent);