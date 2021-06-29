import React from "react";
import { compose, graphql, ApolloConsumer } from "react-apollo";
import {
  GET_ALL_PRODUCTS,
  LIKES_UPDATE,
  GET_CURRENT_USER,
  POPUP_STATE_UPDATE,
  GET_PRODUCT,
  CATEGORY_ID,
  GET_CATEGORIES,
  REDIRECT_HOME_FILTER,
  GET_REDIRECTFILTER_STATE
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import ChatInput from "./ChatInput.jsx";
import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { Link } from "react-router-dom";
import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Category from "../Header/Category.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import empt from "../../../assets/img/empty.svg";
import skleton from "../../../assets/img/pro_skleton.png"; //preload image
import Ads from "./Ads.js"; //preload image
import tenProduct from "../../../assets/img/posting_card_1.svg";
import { Mutation } from "react-apollo";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import { getSymbol } from "../../../helper.js";
import { ProductConsumer } from "../ProductContext.js";
import Modal from "react-modal";
import { withTranslation } from "react-i18next";
import DynamicFilter from "./DynamicFilter.jsx";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

var styles = {
  ...loginStyles,
  ...headerStyles(),
  customBtn: {
    borderColor: "white !important",
    "&:hover": {
      borderColor: "white !important"
    }
  }
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      filterData: [],
      openChatInput: {},
      isPaneOpen: false,
      productState: [],
      progress: false,
      preLoadr: false,
      modalIsOpen: false,
      showDiscard: false,
      editSellUrStuff: false,
      editProductData: {},
      pageCount: 1,
      filterCount: 1,
      loadOff: false,
      updateAds: false,
      headerStuffClicked: false,
      postListing: this.props.t("Homepageheader._Whatselling"),
      copied: false,
      userEditClicked: "",
      preventScroll: true,
      carfillter: false,
      preventScrollSprt: 0,
      yearsForCar: { min: "1940", max: 2019 },
      milageForCar: { min: 0, max: 300000 },
      seatsForCar: { min: 0, max: 10 },
      selectedOption: null,
      loadCategoryData: "",
      loadSearchInput: "",
      loadLocationData: "",
      loadPriceData: "",
      loadSortByData: "",
      visible: 20,
      clickLoadMore: false,
      bodyType: "",
      transmission: [],
      fuelType: "",
      driveTrain: "",
      make: "",
      model: "",
      bodyTypeId: "",
      years: [],
      handleCarFilter: false,
      preventSpeedClick: true,
      selectedBodyType: [],
      transmissionType: [],
      selectedFuelType: [],
      selectedDriveTrain: [],
      transmissionId: [],
      modelView: false,
      spacing: "0"
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChat = this.handleChat.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }


  componentWillMount() {
    let { productsInfo } = this.props;
    productsInfo.refetch({ filter: {} }).then(({ data }) => {
      if (data) {
        this.setState({
          allProducts: data.getAllProducts
        });
      } else {
        this.setState({
          preLoadr: false
        });
      }
    });
  }

  handleLogin(e, open, isLogged) {
    e.preventDefault();
    let { updateLoginPopupStatus, loggedUser } = this.props;
    updateLoginPopupStatus({ variables: { isOpen: open } });
    if (isLogged) {
      loggedUser.refetch();
      this.setState({
        currentUser: loggedUser.getCurrentUser && loggedUser.getCurrentUser
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    let {
      productsInfo,
      categoryInfo,
      getCacheCategoryData,
      getCacheSearchInput,
      getCacheLocationData,
      getPriceData,
      getSortByData,
      AdvancedFilter,
      client,
      min,
      max
    } = nextProps;

  
    this.setState({
      loadCategoryData: nextProps.getCacheCategoryData,
      loadSearchInput: nextProps.getCacheSearchInput,
      loadLocationData: nextProps.getCacheLocationData,
      loadPriceData: nextProps.getPriceData,
      loadmin:min,
      loadmax:max,
      loadDateData: nextProps.getDateByData,
      loadSortByData: nextProps.getSortByData,
      loadFieldChild: AdvancedFilter &&  AdvancedFilter.fieldChild,
      loadRangeFilter: AdvancedFilter && AdvancedFilter.rangeFilter
    });

    if(getCacheCategoryData !== undefined && getCacheCategoryData !== ""){
      categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.filter(x => x.id == getCacheCategoryData).map(v => {
        this.setState({
          filterData: v.fields
        })
      })
    }
 
    if (nextProps.categorySubmitted !== this.props.categorySubmitted) {
      this.setState({
        postListing: "",
        showDiscard: false
      });
    }
    if (nextProps.postAnotherListing !== this.props.postAnotherListing) {
      this.setState({
        postListing: this.props.t("Homepageheader._Whatselling")
      });
    }
    /*  if(nextProps.stuffImage !== this.props.stuffImage) {
      this.setState({
        showDiscard: true
      });
    } */
    if (nextProps.stuffImageEdit !== this.props.stuffImageEdit) {
      this.setState({
        showDiscard: true
      });
    }
    if (nextProps.allproductsValue !== this.props.allproductsValue) {
        let key = parseInt(getSortByData);
        let rateFrom = parseInt(min);
        let rateTo = parseInt(max);
        let id = parseInt(getCacheCategoryData);
        let searchKey = getCacheSearchInput;
        let locationKey = getCacheLocationData;
        let fieldChildData = [];
        let rangeFilterData = [];
        if(AdvancedFilter && AdvancedFilter.fieldChild){
          fieldChildData = AdvancedFilter.fieldChild
        }
  
        if(AdvancedFilter && AdvancedFilter.rangeFilter){
          rangeFilterData = AdvancedFilter.rangeFilter
        }
          const { data } = await client.query({
            query: GET_ALL_PRODUCTS,
            variables: { filter: {
              sortBy: key,
              rateFrom: rateFrom,
              rateTo: rateTo,
              categoryId: id,
              title: searchKey,
              location: { lat_lon: locationKey },
              fieldChild: fieldChildData,
              rangeFilter: rangeFilterData 
            }},
             fetchPolicy: "network-only"
          });
            if(data && data.getAllProducts){
              this.setState({
                allProducts : data.getAllProducts,
                progress : false
              })
            }else{
              this.setState({ progress: false });
            }
            if (this.state.preventScroll) {
            window.scrollTo(0, 0);
            } else if (this.state.preventScroll === false) {
            let not = this.state.preventScrollSprt;
            this.setState({ preventScrollSprt: ++not });
            if (this.state.preventScrollSprt === 2) {
              this.setState({ preventScrollSprt: 0, preventScroll: true });
            }
          }
    }

  if (
      nextProps.max !==  this.props.max ||
      nextProps.min !==  this.props.min ||
      nextProps.getSortByData !== this.props.getSortByData ||
      nextProps.getCacheCategoryData !== this.props.getCacheCategoryData ||
      nextProps.getCacheSearchInput !== this.props.getCacheSearchInput ||
      nextProps.getCacheLocationData !== this.props.getCacheLocationData ||
      nextProps.AdvancedFilter !== this.props.AdvancedFilter
    ) {
      let key = parseInt(getSortByData);
      let rateFrom = parseInt(min);
      let rateTo = parseInt(max);
      let id = parseInt(getCacheCategoryData);
      let searchKey = getCacheSearchInput;
      let locationKey = getCacheLocationData;
      let fieldChildData = [];
      let rangeFilterData = [];
      if(AdvancedFilter && AdvancedFilter.fieldChild){
        fieldChildData = AdvancedFilter.fieldChild
      }

      if(AdvancedFilter && AdvancedFilter.rangeFilter){
        rangeFilterData = AdvancedFilter.rangeFilter
      }
        const { data } = await client.query({
          query: GET_ALL_PRODUCTS,
          variables: { filter: {
            sortBy: key,
            rateFrom: rateFrom,
            rateTo: rateTo,
            categoryId: id,
            title: searchKey,
            location: { lat_lon: locationKey },
            fieldChild: fieldChildData,
            rangeFilter: rangeFilterData 
          }},
           fetchPolicy: "network-only"
        });
          if(data && data.getAllProducts){
            this.setState({
              allProducts : data.getAllProducts,
              pageCount:1,
              filterCount:1,
              visible:20,
              progress : false
            })
          }else{
            this.setState({ progress: false,pageCount:1,
              filterCount:1,  visible:20  });
          }
          if (this.state.preventScroll) {
          window.scrollTo(0, 0);
          } else if (this.state.preventScroll === false) {
          let not = this.state.preventScrollSprt;
          this.setState({ preventScrollSprt: ++not });
          if (this.state.preventScrollSprt === 2) {
            this.setState({ preventScrollSprt: 0, preventScroll: true });
          }
        }
    }

 
    if (nextProps.allProducts && nextProps.allProducts) {
      let { images } = nextProps.allProducts;
      this.setState({
        images: images
      });
    }
  }

  handleClick(e, id) {
    e.preventDefault();
    let openChatInput = {};
    openChatInput[id] = !this.state.openChatInput[id];

    this.setState({
      openChatInput,
      chatId: id
    });
  }
  handleChat() {
    this.setState({
      openChatInput: {}
    });
  }

  loadMore = async client => {
    let {
      loadCategoryData,
      loadSearchInput,
      loadLocationData,
      loadmin,
      loadmax,
      loadDateData,
      loadSortByData,
      loadFieldChild,
      loadRangeFilter
    } = this.state;
    let key = parseInt(loadSortByData);
    let rateFrom = parseInt(loadmin);
    let rateTo = parseInt(loadmax);
    let id = parseInt(loadCategoryData);
    let searchKey = loadSearchInput;
    let locationKey = loadLocationData;
    let fieldChildData = [];
    let rangeFilterData = [];
    if(loadFieldChild && loadFieldChild){
      fieldChildData = loadFieldChild
    }

    if(loadRangeFilter && loadRangeFilter){
      rangeFilterData =loadRangeFilter
    }


    if(!loadSortByData || !loadCategoryData || !searchKey || !locationKey || !fieldChildData || !rangeFilterData) {
      this.setState({
        progress: true
      });

      this.setState(prev => {
        return { visible: prev.visible + 20 };
      });

      let cnt = this.state.pageCount;
      ++cnt;
      const { data } = await client.query({
        query: GET_ALL_PRODUCTS,
        variables: { filter: {}, pageNumber: cnt.toString() }
      });
      this.setState({
        allProducts: [...this.state.allProducts, ...data.getAllProducts],
        pageCount: cnt,
        progress: false
      });
     
      this.setState({
        updateAds: !this.state.updateAds
      });
    } else {
      this.setState({
        progress: true
      });

      this.setState(prev => {
        return { visible: prev.visible + 20 };
      });
      let cnt = this.state.filterCount;
      ++cnt;
      const { data } = await client.query({
        query: GET_ALL_PRODUCTS,
        variables: {
          filter: {
            sortBy: key,
            rateFrom: rateFrom,
            rateTo: rateTo,
            categoryId: id,
            title: searchKey,
            location: { lat_lon: locationKey },
            fieldChild: fieldChildData,
            rangeFilter: rangeFilterData

          },
          pageNumber: cnt.toString()
        }
      });
      if (data) {
        this.setState({
          allProducts: [...this.state.allProducts, ...data.getAllProducts],
          filterCount: cnt
        });
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } });
      } else {
        this.setState({
          progress: false
        });
      }

      this.setState({
        updateAds: !this.state.updateAds
      });
    }
  };

  handleLike = (e, likesUpdate, id, index) => {
    e.target.classList.toggle("toggled");
    this.setState({ preventScroll: false });
    likesUpdate().then(({ data }) => {
      let { /*selectIndex,*/ productState } = this.state;

      if (productState.includes(id)) {
        let filletrLike = productState.filter(element => {
          return element != id;
        });
        this.setState({
          productState: filletrLike
        });
      } else {
        this.setState(prevstate => ({
          productState: [...prevstate.productState, id]
        }));
      }
    });
  };

  copyData = () => {
    this.setState({
      copied: true
    });
  };

  ModalClose = () => {
    this.setState({
      copied: false
    });
  };

  closeSlidingPanel = discardType => {
    if (discardType === true) {
      this.setState({ modalIsOpen: true, isPaneOpen: true });
    } else {
      this.setState({ isPaneOpen: false });
    }
  };

  editSellYourStuff = async (client, id, productData) => {
    await client
      .query({
        query: GET_PRODUCT,
        variables: { id: Number(id) },
        fetchPolicy: "network-only"
      })
      .then(({ data }) => {
        if (data) {
          this.setState({
            editProductData: data.getProduct[0]
          });
        }
      })
      .catch(err => {
        console.log("catch", err);
      });
    await this.setState({
      isPaneOpen: true,
      editSellUrStuff: true,
      headerStuffClicked: false,
      postListing: this.props.t("Homepageheader._EditListing")
    });
    this.props.userEditActivated();
    this.setState({
      userEditClicked: Math.floor(Math.random() * 10000)
    });
  };

  newPostListingProducts = () => {
    this.setState({
      isPaneOpen: true,
      headerStuffClicked: true,
      editProductData: false,
      postListing: this.props.t("Homepageheader._Whatselling")
    });
  };

  closeModalSlide = async type => {
    if (type === "Discard") {
      await this.setState({
        modalIsOpen: false,
        showDiscard: false,
        isPaneOpen: false
      });
    } else {
      this.setState({ modalIsOpen: false, showDiscard: true });
    }
  };

  imageClick = () => {
    if (this.state.preventSpeedClick) {
      this.setState({
        clicked: true
      });
      this.props.getCategoryId({ variables: { categoryId: "" } });
      this.setState({ categoryId: "" });
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    let { getSortByData,min,max,getCacheCategoryData,getCacheLocationData,getCacheSearchInput,AdvancedFilter,client } = this.props;
   
    if (this.props.getLoadCountFilter !== prevProps.getLoadCountFilter) {
      let fieldChildData = [];
      let rangeFilterData = [];

      if (
        prevProps.max !==  this.props.max ||
        prevProps.min !==  this.props.min ||
        prevProps.getSortByData !== this.props.getSortByData ||
        prevProps.getCacheCategoryData !== this.props.getCacheCategoryData ||
        prevProps.getCacheSearchInput !== this.props.getCacheSearchInput ||
        prevProps.getCacheLocationData !== this.props.getCacheLocationData ||
        prevProps.AdvancedFilter !== this.props.AdvancedFilter
      ) {

      if(AdvancedFilter && AdvancedFilter.fieldChild){
        fieldChildData = AdvancedFilter.fieldChild
      }

      if(AdvancedFilter && AdvancedFilter.rangeFilter){
        rangeFilterData = AdvancedFilter.rangeFilter
      }

      const { data } = await client.query({
        query: GET_ALL_PRODUCTS,
        variables: { filter: {
          sortBy: parseInt(getSortByData),
          rateFrom:parseInt(min),
          rateTo: parseInt(max) ,
          categoryId: parseInt(getCacheCategoryData),
          title: getCacheSearchInput,
          location: { lat_lon: getCacheLocationData },
          fieldChild: fieldChildData,
          rangeFilter: rangeFilterData
        }},
      });
        if(data && data.getAllProducts){
          this.setState({
            allProducts: data.getAllProducts,
            pageCount: 1,
            filterCount: 1,
            visible: 20
          })
          this.props.redirectHomeFilter({ variables: { pageCountFilter: false } });
        }else{
          this.setState({ progress: false,pageCount: 1,
            filterCount: 1,
            visible: 20 });
          this.props.redirectHomeFilter({ variables: { pageCountFilter: false } });
        }
      }else{
        this.setState({ progress: false,pageCount: 1,
          filterCount: 1,
          visible: 20 });
      }
    }
  }
render() {
    let { classes, currentUser, history, t,getCacheCategoryData } = this.props;
    let {
      allProducts,
      editSellUrStuff,
      carfillter,
      editProductData,
      headerStuffClicked,
      showDiscard,
      filterData
    } = this.state;
    const { spacing } = this.state;

    return (
      <div className="">
        <div className={classes.NqLdW + " nomarginhm"}>
          <div className={classes.lotuhp}>
            <div className={classes.NqLdW}>
              <GridContainer spacing={0}>
                <GridItem xs={12} sm={12} md={10}>
                  <div className={classes.lpmTFP + " homepageiss"}>
                    <>
                      {((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData.length > 0)) ? (
                        <div className="sads">
                          {" "}
                      
                          <div className="d-flex justify-content-center">
                            <span
                              className="cls_themeclr"
                            >
                              {" "}
                              <i aria-hidden="true"></i>{" "}
                              {/* {t("Homepageheader._CarFilter")} */}
                                {t("Homepageheader._AdvancedSearch")}
                            </span></div>{" "}
                
                          <DynamicFilter 
                            categoryId={getCacheCategoryData} 
                            AdvancedFiltersubmit={this.props.AdvancedFiltersubmit}
                            filterData={filterData}
                          />{" "}
                        </div>
                      ) : ""}
                      <div
                        className={
                          ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData.length > 0))
                            ? "filtervw"
                            : classes.lpmTFP
                        }
                      >
                        {allProducts.map((p, index) => {
                          const newIndex = index + 1;
                          return (
                            <>
                              {(getCacheCategoryData === undefined || getCacheCategoryData === "") ? (
                                <div className={classes.foIXbw + " paddd"}>
                                  <div className={classes.GUWDi}>
                                    <div className={classes}>
                                      <div
                                        className={
                                          classes.vbiXn +
                                          " " +
                                          classes.ijFtv +
                                          " " +
                                          classes.fOiDZW
                                        }
                                      >
                                        <div
                                          className={
                                            p.featured != null
                                              ? 'classes.iOHpjI + "aasd'
                                              : ""
                                          }
                                        >
                                          {/* <Link to={`/product/${p.id}`} key={p.id} {...p}> */}

                                          <section
                                            className={
                                              p.featured != null
                                                ? "bgcolor"
                                                : "nobrpayment"
                                            }
                                          >
                                            <Link
                                              title={`${p.title} ${
                                                p.location.city
                                                  ? p.location.city
                                                  : ""
                                              }, ${
                                                p.location.pincode
                                                  ? p.location.pincode
                                                  : ""
                                              }`}
                                              to={{
                                                pathname: `/products/${p.id}`
                                              }}
                                              className="Nounderline cls_homproduct"
                                            >
                                              <div className="inner" id="myId">
                                                <img src={p.images[0]} />
                                                {p.isFree && (
                                                  <div className="ribbon">
                                                    <div>
                                                      {" "}
                                                      {t("Editprofile._Free")}
                                                    </div>
                                                  </div>
                                                )}

                                                {p.featured && (
                                                  <div className="urgent">
                                                    <div>
                                                      {" "}
                                                      {t(
                                                        "Editprofile._Featured"
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div className={"footer"}>
                                                <div
                                                  className={
                                                    classes.iBigWB +
                                                    " " +
                                                    "main"
                                                  }
                                                >
                                                  <p className={classes.idbXKU}>
                                                    <strong>{p.title}</strong>
                                                  </p>
                                                </div>
                                                <div
                                                  className={
                                                    classes.lkKZlA +
                                                    " " +
                                                    "secondary"
                                                  }
                                                >
                                                  <p className={classes.jVEKGa}>
                                                    {p.location.city}
                                                    {p.location.pincode &&
                                                      ","}{" "}
                                                    {p.location.pincode}
                                                  </p>
                                                </div>
                                              </div>
                                            </Link>
                                            <div className={classes.hIHtqB}>
                                              <div className={classes.rqHAf}>
                                                
                                                {currentUser.getCurrentUser &&
                                                p.userId ==
                                                  currentUser.getCurrentUser
                                                    .id ? (
                                                  <div
                                                    className={
                                                      classes.exWZiu +
                                                      " EditBtn"
                                                    }
                                                  >
                                                    <ApolloConsumer>
                                                      {client => (
                                                        <button
                                                          onClick={() =>
                                                            this.editSellYourStuff(
                                                              client,
                                                              p.id,
                                                              p
                                                            )
                                                          }
                                                        >
                                                          {t(
                                                            "Productdetails._Edit"
                                                          )}
                                                        </button>
                                                      )}
                                                    </ApolloConsumer>
                                                  </div>
                                                ) : (
                                                  <div
                                                    className={classes.exWZiu}
                                                  >
                                                    <div
                                                      className={
                                                        classes.RlATG +
                                                        " " +
                                                        classes.jdjXhR +
                                                        " trldeg"
                                                      }
                                                    >
                                                      <button
                                                        onClick={e =>
                                                          this.handleClick(
                                                            e,
                                                            p.id
                                                          )
                                                        }
                                                        className={
                                                          classes.gyDxPI +
                                                          " " +
                                                          classes.jrOmri +
                                                          " " +
                                                          classes.btnSecondary +
                                                          " " +
                                                          classes.customBtn
                                                        }
                                                      >
                                                        <span>
                                                          <svg
                                                            viewBox="0 0 24 24"
                                                            width="24"
                                                            height="24"
                                                            class="sc-jTzLTM eWXXCS"
                                                            fill="#ff3f55"
                                                          >
                                                            <path d="M7.249 21.204v-1.902c0-.58-.47-1.05-1.05-1.05A4.2 4.2 0 0 1 2 14.053v-5.86A4.194 4.194 0 0 1 6.193 4h11.734a4.193 4.193 0 0 1 4.193 4.193v5.866a4.193 4.193 0 0 1-4.193 4.193h-5.013c-.444 0-.87.177-1.185.49l-3.05 3.048c-.525.526-1.424.158-1.43-.586zm.617-8.828a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm8.383 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm-4.191 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512z"></path>
                                                          </svg>
                                                        </span>
                                                      </button>
                                                      {p.id ===
                                                        this.state.chatId &&
                                                      this.state.openChatInput[
                                                        p.id
                                                      ] ? (
                                                        <ChatInput
                                                          key={index}
                                                          productInfo={p}
                                                          onClick={
                                                            this.handleChat
                                                          }
                                                          currentUser={
                                                            currentUser
                                                          }
                                                          history={history}
                                                        />
                                                      ) : (
                                                        ""
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* conditionally show Favorite icons start */}
                                                {!(
                                                  currentUser.getCurrentUser &&
                                                  p.userId ==
                                                    currentUser.getCurrentUser
                                                      .id
                                                ) && (
                                                  <>
                                                    {this.props.currentUser
                                                      .getCurrentUser !=
                                                      null && (
                                                      <Mutation
                                                        mutation={LIKES_UPDATE}
                                                        variables={{
                                                          id: Number(p.id)
                                                        }}
                                                        refetchQueries={[
                                                          {
                                                            query: GET_PRODUCT,
                                                            variables: {
                                                              id: Number(p.id)
                                                            }
                                                          }
                                                        ]}
                                                      >
                                                        {(
                                                          likesUpdate,
                                                          { data }
                                                        ) => (
                                                          <div>
                                                            <button
                                                              onClick={e =>
                                                                this.handleLike(
                                                                  e,
                                                                  likesUpdate,
                                                                  p.id,
                                                                  index
                                                                )
                                                              }
                                                              className={
                                                                classes.egQXgJ +
                                                                " " +
                                                                classes.kk +
                                                                " favBtn" +
                                                                (p.likedUsers.filter(
                                                                  x =>
                                                                    x ==
                                                                    currentUser
                                                                      .getCurrentUser
                                                                      .id
                                                                ).length > 0
                                                                  ? " toggled"
                                                                  : "")
                                                              }
                                                            >
                                                              <svg
                                                                viewBox="0 0 24 24"
                                                                width="24"
                                                                height="24"
                                                                // className={ "button" + (selectIndex.includes(index)? " toggled": "")}
                                                                className="button"
                                                                style={{
                                                                  fill:
                                                                    "currentcolor",
                                                                  userSelect:
                                                                    "none",
                                                                  display:
                                                                    "inline-block",
                                                                  verticalAlign:
                                                                    "middle",
                                                                  lineHeight:
                                                                    "1",
                                                                  transition:
                                                                    "fill 0.25s ease 0s"
                                                                }}
                                                              >
                                                                <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                                              </svg>
                                                            </button>
                                                          </div>
                                                        )}
                                                      </Mutation>
                                                    )}
                                                  </>
                                                )}
                                                {/* conditionally show Favorite icons end */}

                                                {this.props.currentUser
                                                  .getCurrentUser == null && (
                                                  <div>
                                                    {" "}
                                                    <button
                                                      onClick={e =>
                                                        this.handleLogin(
                                                          e,
                                                          true
                                                        )
                                                      }
                                                      className={
                                                        classes.egQXgJ +
                                                        " " +
                                                        classes.kk
                                                      }
                                                    >
                                                      <svg
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                        style={{
                                                          fill: "currentcolor",
                                                          userSelect: "none",
                                                          display:
                                                            "inline-block",
                                                          verticalAlign:
                                                            "middle",
                                                          lineHeight: "1",
                                                          transition:
                                                            "fill 0.25s ease 0s"
                                                        }}
                                                      >
                                                        <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                                      </svg>
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </section>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              {newIndex % 10 === 0 && (
                                <div className={classes.foIXbw}>
                                  <div className={classes.GUWDi}>
                                    <div
                                      className={
                                        classes.vbiXn +
                                        " " +
                                        classes.ijFtv +
                                        " " +
                                        classes.fOiDZW
                                      }
                                    >
                                      <div className="">
                                        <div
                                          className={
                                            (getCacheCategoryData !== undefined && getCacheCategoryData !== "")
                                              ? "noneedfillter"
                                              : ""
                                          }
                                        >
                                          <div className="iGPEND">
                                            <div className="mak-monry">
                                              <img
                                                className="responsive"
                                                src={tenProduct}
                                              />
                                              <div className="taxt-mal">
                                                <span className="make-mon">
                                                  {this.props.t(
                                                    "Homepageheader._make"
                                                  )}
                                                  <br />
                                                  {this.props.t(
                                                    "Homepageheader._Money"
                                                  )}
                                                </span>
                                                <br />{" "}
                                                {this.props.t(
                                                  "Homepageheader._SellingPassup"
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="post-nw">
                                            <div
                                              className={
                                                classes.iBigWB + " " + "main"
                                              }
                                            ></div>
                                            <div
                                              className={
                                                classes.lkKZlA +
                                                " " +
                                                "secondary"
                                              }
                                            ></div>
                                          </div>
                                          <div className={classes.hIHtqB}>
                                            <div className={classes.rqHAf}>
                                              <button
                                                onClick={() =>
                                                  this.newPostListingProducts()
                                                }
                                                type="button"
                                                className="pstnw"
                                              >
                                                {this.props.t(
                                                  "Homepageheader._Postnow"
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {(getCacheCategoryData !== undefined && getCacheCategoryData !== "") && (
                                
                                <div className={
                          ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData.length > 0))
                            ? "car-daea col-lg-4 col-md-4 col-12"
                            : "car-daea col-lg-3 col-md-4 col-12"
                        }>
                                  {/*staart leftpart*/}

                                  {/*end leftpart*/}
                                   <div
                                        className={
                                          classes.vbiXn +
                                          " " +
                                          classes.ijFtv +
                                          " " +
                                          classes.fOiDZW
                                        }
                                      >
                                        <div
                                          className={
                                            p.featured != null
                                              ? 'classes.iOHpjI + "aasd'
                                              : ""
                                          }
                                        >
                                
                                <section
                                            className={
                                              p.featured != null
                                                ? "bgcolor"
                                                : "nobrpayment"
                                            }
                                          >
                                            <Link
                                              title={`${p.title} ${
                                                p.location.city
                                                  ? p.location.city
                                                  : ""
                                              }, ${
                                                p.location.pincode
                                                  ? p.location.pincode
                                                  : ""
                                              }`}
                                              to={{
                                                pathname: `/products/${p.id}`
                                              }}
                                              className="Nounderline cls_homproduct"
                                            >
                                              <div className="inner" id="myId">
                                                <img src={p.images[0]} />
                                                {p.isFree && (
                                                  <div className="ribbon">
                                                    <div>
                                                      {" "}
                                                      {t("Editprofile._Free")}
                                                    </div>
                                                  </div>
                                                )}

                                                {p.featured && (
                                                  <div className="urgent">
                                                    <div>
                                                      {" "}
                                                      {t(
                                                        "Editprofile._Featured"
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div className={"footer"}>
                                                <div
                                                  className={
                                                    classes.iBigWB +
                                                    " " +
                                                    "main"
                                                  }
                                                >
                                                  <p className={classes.idbXKU}>
                                                    <strong>{p.title}</strong>
                                                  </p>
                                                </div>
                                                <div
                                                  className={
                                                    classes.lkKZlA +
                                                    " " +
                                                    "secondary"
                                                  }
                                                >
                                                  <p className={classes.jVEKGa}>
                                                    <svg viewBox="0 0 24 24" width="16px" height="16px" class="sc-jTzLTM fznnpf"><path d="M12.364 2c2.204 0 4.327.865 5.915 2.463a8.4 8.4 0 0 1 2.448 5.939 8.4 8.4 0 0 1-2.448 5.942c-2.669 2.684-5.094 5.445-5.383 5.561a1.326 1.326 0 0 1-.532.095c-.19 0-.358-.024-.544-.1-.305-.123-2.767-2.937-5.372-5.556-3.264-3.282-3.264-8.6 0-11.88A8.319 8.319 0 0 1 12.364 2zm.091 11.91A3.455 3.455 0 1 0 9 10.455a3.455 3.455 0 0 0 3.455 3.455z"></path></svg>{p.location.city}
                                                    {p.location.pincode &&
                                                      ","}{" "}
                                                    {p.location.pincode}
                                                  </p>
                                                </div>
                                              </div>
                                            </Link>
                                            <div className={classes.hIHtqB}>
                                              <div className={classes.rqHAf}>
                                                
                                                {currentUser.getCurrentUser &&
                                                p.userId ==
                                                  currentUser.getCurrentUser
                                                    .id ? (
                                                  <div
                                                    className={
                                                      classes.exWZiu +
                                                      " EditBtn"
                                                    }
                                                  >
                                                    <ApolloConsumer>
                                                      {client => (
                                                        <button
                                                          onClick={() =>
                                                            this.editSellYourStuff(
                                                              client,
                                                              p.id,
                                                              p
                                                            )
                                                          }
                                                        >
                                                          {t(
                                                            "Productdetails._Edit"
                                                          )}
                                                        </button>
                                                      )}
                                                    </ApolloConsumer>
                                                  </div>
                                                ) : (
                                                  <div
                                                    className={classes.exWZiu}
                                                  >
                                                    <div
                                                      className={
                                                        classes.RlATG +
                                                        " " +
                                                        classes.jdjXhR +
                                                        " trldeg"
                                                      }
                                                    >
                                                      <button
                                                        onClick={e =>
                                                          this.handleClick(
                                                            e,
                                                            p.id
                                                          )
                                                        }
                                                        className={
                                                          classes.gyDxPI +
                                                          " " +
                                                          classes.jrOmri +
                                                          " " +
                                                          classes.btnSecondary +
                                                          " " +
                                                          classes.customBtn
                                                        }
                                                      >
                                                        <span>
                                                          <svg
                                                            viewBox="0 0 24 24"
                                                            width="24"
                                                            height="24"
                                                            class="sc-jTzLTM eWXXCS"
                                                            fill="#ff3f55"
                                                          >
                                                            <path d="M7.249 21.204v-1.902c0-.58-.47-1.05-1.05-1.05A4.2 4.2 0 0 1 2 14.053v-5.86A4.194 4.194 0 0 1 6.193 4h11.734a4.193 4.193 0 0 1 4.193 4.193v5.866a4.193 4.193 0 0 1-4.193 4.193h-5.013c-.444 0-.87.177-1.185.49l-3.05 3.048c-.525.526-1.424.158-1.43-.586zm.617-8.828a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm8.383 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm-4.191 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512z"></path>
                                                          </svg>
                                                        </span>
                                                      </button>
                                                      {p.id ===
                                                        this.state.chatId &&
                                                      this.state.openChatInput[
                                                        p.id
                                                      ] ? (
                                                        <ChatInput
                                                          key={index}
                                                          productInfo={p}
                                                          onClick={
                                                            this.handleChat
                                                          }
                                                          currentUser={
                                                            currentUser
                                                          }
                                                          history={history}
                                                        />
                                                      ) : (
                                                        ""
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* conditionally show Favorite icons start */}
                                                {!(
                                                  currentUser.getCurrentUser &&
                                                  p.userId ==
                                                    currentUser.getCurrentUser
                                                      .id
                                                ) && (
                                                  <>
                                                    {this.props.currentUser
                                                      .getCurrentUser !=
                                                      null && (
                                                      <Mutation
                                                        mutation={LIKES_UPDATE}
                                                        variables={{
                                                          id: Number(p.id)
                                                        }}
                                                        refetchQueries={[
                                                          {
                                                            query: GET_PRODUCT,
                                                            variables: {
                                                              id: Number(p.id)
                                                            }
                                                          }
                                                        ]}
                                                      >
                                                        {(
                                                          likesUpdate,
                                                          { data }
                                                        ) => (
                                                          <div>
                                                            <button
                                                              onClick={e =>
                                                                this.handleLike(
                                                                  e,
                                                                  likesUpdate,
                                                                  p.id,
                                                                  index
                                                                )
                                                              }
                                                              className={
                                                                classes.egQXgJ +
                                                                " " +
                                                                classes.kk +
                                                                " favBtn" +
                                                                (p.likedUsers.filter(
                                                                  x =>
                                                                    x ==
                                                                    currentUser
                                                                      .getCurrentUser
                                                                      .id
                                                                ).length > 0
                                                                  ? " toggled"
                                                                  : "")
                                                              }
                                                            >
                                                              <svg
                                                                viewBox="0 0 24 24"
                                                                width="24"
                                                                height="24"
                                                                // className={ "button" + (selectIndex.includes(index)? " toggled": "")}
                                                                className="button"
                                                                style={{
                                                                  fill:
                                                                    "currentcolor",
                                                                  userSelect:
                                                                    "none",
                                                                  display:
                                                                    "inline-block",
                                                                  verticalAlign:
                                                                    "middle",
                                                                  lineHeight:
                                                                    "1",
                                                                  transition:
                                                                    "fill 0.25s ease 0s"
                                                                }}
                                                              >
                                                                <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                                              </svg>
                                                            </button>
                                                          </div>
                                                        )}
                                                      </Mutation>
                                                    )}
                                                  </>
                                                )}
                                                {/* conditionally show Favorite icons end */}

                                                {this.props.currentUser
                                                  .getCurrentUser == null && (
                                                  <div>
                                                    {" "}
                                                    <button
                                                      onClick={e =>
                                                        this.handleLogin(
                                                          e,
                                                          true
                                                        )
                                                      }
                                                      className={
                                                        classes.egQXgJ +
                                                        " " +
                                                        classes.kk
                                                      }
                                                    >
                                                      <svg
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                        style={{
                                                          fill: "currentcolor",
                                                          userSelect: "none",
                                                          display:
                                                            "inline-block",
                                                          verticalAlign:
                                                            "middle",
                                                          lineHeight: "1",
                                                          transition:
                                                            "fill 0.25s ease 0s"
                                                        }}
                                                      >
                                                        <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                                                      </svg>
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </section>
                                          </div>
                                          </div>
                                          </div>

                              )}
                            </>
                          );
                        })}
                      </div>
                      {this.state.preLoadr && (
                        <>
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>
                          <div className={classes.foIXbw}>
                            <img src={skleton} alt="loading" width="100%" />
                          </div>
                        </>
                      )}
                    </>
                  </div>

                  <div className={classes.bSJSSe}>
                    {this.state.visible === this.state.allProducts.length && (
                      <ApolloConsumer>
                        {client => (
                          <button
                            onClick={() => this.loadMore(client)}
                            type="button"
                            className={classes.jqJLdD}
                          >
                          {t("Editprofile._loadmore")}</button>
                        )}
                      </ApolloConsumer>
                    )}
                  </div>

                  <div
                    className={
                      ((getCacheCategoryData !== undefined) && (getCacheCategoryData !== "") && (filterData.length > 0)) ? "seacrfillet" : ""
                    }
                  >
                    {allProducts.length <= 0 && !this.state.preLoadr && (
                      <div className="notFound">
                        <img src={empt} alt="empty" />
                        <h5> {t("Homepageheader._OOPS")}</h5>
                        <span>{t("Homepageheader._something")}</span>
                      </div>
                    )}{" "}
                  </div>
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={2}
                  spacing={Number(spacing)}
                  className="sdddf"
                >
                  <div className="kalzYq"></div>
                  <div className="cJjEXi">
                    <Ads
                      length={allProducts.length}
                      update={this.state.updateAds}
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </div>

            <Modal
              isOpen={this.state.modalIsOpen}
              //onAfterOpen={this.afterOpenModal}
              //onRequestClose={this.closeModalSlide}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div className="discardPopup">
                {/* <h3>Listing not posted</h3>
                                <hr /> */}
                <section>
                  <article>
                    <p>Are you sure you want to discard these changes?</p>
                  </article>
                </section>
                <footer>
                  <button
                    className="btn1 btn-block"
                    onClick={() => this.closeModalSlide("Discard")}
                  >
                    {" "}
                    Discard{" "}
                  </button>
                  <button
                    className="btn2 btn-block"
                    onClick={() => this.closeModalSlide("PostList")}
                  >
                    {" "}
                    Cancel{" "}
                  </button>
                </footer>
              </div>
            </Modal>
            <SlidingPane
              closeIcon={
                <div
                  onClick={() => this.closeSlidingPanel(showDiscard)}
                  class="slide-pane__close lol"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                  </svg>
                </div>
              }
              className="some-custom-class"
              overlayClassName="some-custom-overlay-class"
              isOpen={this.state.isPaneOpen}
              title={this.state.postListing}
            >
              <div>
                <ProductConsumer>
                  {value => (
                    <Category
                      stuffImage={value.stuffImage}
                      CategoryWithImage={value.CategoryWithImage}
                      discardStuffStatus={value.discardStuff}
                      discardYourStuff={value.discardYourStuff}
                      manageBeforeLogin={value.stuffValue}
                      refetchValue={value}
                      userEditStuff={editSellUrStuff}
                      editProductData={editProductData}
                      userEditActivated={value.userEditActivated}
                      userEditClicked={value.userEditClicked}
                      headerStuffClicked={headerStuffClicked}
                      closeSlidingPanel={this.closeSlidingPanel}
                      showValue={value.showValue}
                      postDone={value.postDone}
                    />
                  )}
                </ProductConsumer>
              </div>
            </SlidingPane>
          </div>
        </div>
      </div>
    );
  }
}

var products = compose(
  graphql(GET_ALL_PRODUCTS, {
    name: "productsInfo",
    options: () => ({
      variables: {
        filter: {}
      }
    })
  }),
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(LIKES_UPDATE, { name: "likesUpdate" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(POPUP_STATE_UPDATE, { name: "updateLoginPopupStatus" }),
  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
    name: "pageCountFilter",
    options: () => ({
      fetchPolicy: 'cache-only'
    })
  }),
  graphql(GET_CATEGORIES, { name: "categoryInfo" })
)(Products);

export default withTranslation("common")(withStyles(styles)(products));