import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import defaultImg from "../../../assets/img/default.png";
import Button from "../../../components/CustomButtons/Button.jsx";
import Magnify from "@material-ui/icons/Search";
import ChatBubble from "@material-ui/icons/ChatOutlined";
import Dehaze from "@material-ui/icons/Dehaze";
import Camera from "@material-ui/icons/CameraAlt";
import { compose, graphql, Query } from "react-apollo";
import {
  GET_SITE_INFO,
  POPUP_STATE_UPDATE,
  GET_LOGIN_POPUP_STATE,
  INACTIVE,
  UPDATE_PRODUCT,
  GET_CATEGORIES,
  GET_CURRENT_USER,
  GET_CACHE_STATE,
  LOG_OUT,
  SEARCH_INPUT,
  GET_SEARCH_INPUT,
  CATEGORY_ID,
  REDIRECT_HOME_FILTER,
  GET_REDIRECTFILTER_STATE
} from "../../../queries";
import LoginComponent from "../Login/index.jsx";
import "../css/style.css";
import Modal from "react-modal";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Category from "./Category.jsx";
import { Link } from "react-router-dom";
import { ProductConsumer } from "../ProductContext.js";
import { withTranslation } from "react-i18next";
import HomeFilter from "../home_filter.js";
import CategoryFilter from "../Dashboard/Filters/Category.jsx";
import DynamicFilter from "../Dashboard/DynamicFilter.jsx";

const initialState = {
  image: "",
  openPopup: false,
  currentUser: {},
  resultData: [],
  isPaneOpen: false,
  srch: "",
  city: "",
  filterData:[]
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

const customStyles1 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "600px"
  }
};

const customStyles3 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px"
  }
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      modalIsOpen: false,
      discardStuff: Math.floor(Math.random() * 10000),
      showDiscard: false,
      headerStuffClicked: true,
      aboutModal: false,
      sellingTitle: this.props.t("Homepageheader._Whatselling"),
      clearFilter: true,
      showModal: false,
      modalIsOpencategory: false,
      responsiveCategory: "All",
      responsiveCategoryimage: ""
    };
    this.handleChat = this.handleChat.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    //this.closeActiveScreen=this.closeActiveScreen.bind(this);
    this.redirect = this.redirect.bind(this);

    this.aboutPage = this.aboutPage.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.openModalcategory = this.openModalcategory.bind(this);
    this.handleCloseModal2 = this.handleCloseModal2.bind(this);
  }

  openModalcategory() {
    this.setState({ modalIsOpencategory: true });
  }

  handleCloseModal2() {
    this.setState({ modalIsOpencategory: false });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  componentDidMount() {
    let {getCacheSearchInput} = this.props;
    //this.getGeoInfo();
    Modal.setAppElement(this.el);
    if(getCacheSearchInput && getCacheSearchInput.searchInput !== undefined && getCacheSearchInput.searchInput){
      this.setState({
          srch : getCacheSearchInput.searchInput
      })
    }
  }
  handleChange = event => {
    let resultData = event.target.value;
    this.setState({ srch: resultData });
  };
  goHome = e => {
    if (e.keyCode === 32 && e.target.value.length <= 1) {
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (window.location.pathname !== "/") {
        //this.props.searchResult({ variables: { searchInput: ""}});
        this.props.history.push("/");
      }
      setTimeout(
        () =>
          this.props.searchResult({
            variables: { searchInput: this.state.srch.trim() }
          }),
        1000
      );
    }
  };
  clr = () => {
    //clear search
    this.setState({ srch: "" });
    this.props.searchResult({ variables: { searchInput: "" } });
  };
  componentWillMount() {
    let { siteInfo, currentUser } = this.props;
    let image;
    this.setState({
      currentUser
    });
    siteInfo
      .refetch()
      .then(({ data }) => {
        if (data) {
          image = data.getSiteInfo && data.getSiteInfo.image;
          this.setState({
            image: image
          });
        }
      })
      .catch(e => console.log(e));
  }

  componentWillReceiveProps(nxt) {
    let {getCacheCategoryData,categoryInfo} = nxt
    this.setState({
      inActive: nxt.getCacheData.inActive,
      currentUser: nxt.currentUser
    });
    if (nxt.discardStuffStatus !== this.props.discardStuffStatus) {
      this.setState({ isPaneOpen: false });
    }

    if (nxt.stuffImage !== this.props.stuffImage) {
      this.setState({
        showDiscard: true
      });
    }

    if (nxt.categorySubmitted !== this.props.categorySubmitted) {
      this.setState({
        showDiscard: false,
        sellingTitle: ""
      });
    }
    if (
      nxt.contextConsumerInner.stuffImage !==
      this.props.contextConsumerInner.stuffImage
    ) {
      this.setState({
        showDiscard: true
      });
    }

    if (nxt.clearValue !== this.props.clearValue) {
      this.setState({
        sellingTitle: ""
      });
    }

    if (nxt.postDone !== this.props.postDone) {
      this.setState({
        sellingTitle: this.props.t("Homepageheader._Whatselling")
      });
    }

    // if(nxt.postAnotherListing === this.props.postAnotherListing) {
    //   this.setState({
    //     sellingTitle: "What are you selling?"
    //   })
    // }

    if (
      nxt.getCacheSearchInput.searchInput !==
      this.props.getCacheSearchInput.searchInput
    ) {
      this.setState({
        srch: nxt.getCacheSearchInput.searchInput
      });
    }
    if(getCacheCategoryData !== undefined && getCacheCategoryData !== ""){
      categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.filter(x => x.id == getCacheCategoryData).map(v => {
        this.setState({
          filterData: v.fields
        })
      })
    }
  }

  handleChat() {
    this.props.history.push("/chat/conversation");
  }
  redirect(e, val) {
    e.preventDefault();
    //e.stopPropagation();
    //this.props.inActiveScreen({variables: { inActive: false }});
    switch (val.key) {
      case "logout":
        this.props.logOut({ variables: { type: "user" } }).then(({ data }) => {
          if (data.logOut) {
            this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
            sessionStorage.clear();
          }
        });
        this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
        break;
      default:
        break;
    }
  }

  //   componentWillUpdate(nextProps, nextState) {
  //     let { loggedUser } = this.props
  //     if(nextProps.location.pathname == "/chat"){
  //       loggedUser.refetch();
  //     }
  //  }

  aboutPage = () => {
    this.setState({
      aboutModal: true
    });
  };
  // closeModal() {
  //   this.setState({ aboutModal: false });
  // }

  handleLogin(open, isLogged) {
    let { updateLoginPopupStatus, loggedUser } = this.props;
    updateLoginPopupStatus({ variables: { isOpen: open } });
    if (isLogged) {
      loggedUser.refetch();
      this.setState({
        currentUser: loggedUser.getCurrentUser && loggedUser.getCurrentUser
      });

      //console.log("currentUser", currentUser);
    }
    // this.handleActiveScreen()
  }
  handleActiveScreen() {
    document.body.classList.toggle("scrollDisable");
    this.state.inActive
      ? this.props.inActiveScreen({ variables: { inActive: false } })
      : this.props.inActiveScreen({ variables: { inActive: true } });
  }

  /* afterOpenModal = () => {
    // references are now sync"d and can be accessed.
    this.subtitle.style.color = "#f00";
  } */

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

  closeSlidingPanel = discardType => {
    if (discardType === true) {
      this.setState({ modalIsOpen: true, isPaneOpen: true, showDiscard: false });
    } else {
      this.setState({ isPaneOpen: false });
      document.body.style = "overflow-y:auto !important";
    }
  };

  redirectURl = () => {
    if (window.location.pathname === "/") {
      const clear = this.state.clearFilter;
      this.setState({
        clearFilter: !clear,
        srch: ""
      });
      this.props.clearFilter(this.state.clearFilter);
      this.props.redirectHomeFilter({ variables: { pageCountFilter: true } });
    }
    else{
      this.props.history.push("/");
    }
  };

  openHeaderModel = () => {
    this.setState({ isPaneOpen: true });
  };

  // getGeoInfo = () => {
  //   axios
  //     .get("https://ipapi.co/json/")
  //     .then(response => {
  //       let data = response.data;
  //       this.setState({
  //         city: data.city
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  openProfile = () => {
    this.props.history.push(`/EditProfile/${this.state.currentUser.id}`);
    this.handleActiveScreen();
  };
  closePanle = () => {
    this.handleActiveScreen();
  };

  afterOpenModal() {
    // this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ modalIsOpen: false, aboutModal: false });
  }

  categortResponsiveFilter = (type, image) => {
    //console.log("object", type, image)
    this.setState({
      responsiveCategory: type,
      responsiveCategoryimage: image
    });
  };

  saveFilter = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    let {
      inActive,
      srch,
      discardStuff,
      showDiscard,
      headerStuffClicked,
      sellingTitle,
      filterData
    } = this.state;
     let {history} = this.props;
    let {contextConsumerInner} = this.props
    const profileList = [
      {
        key: "discover",
        name: this.props.t("Homepageheader.Discover"),
        icon: "fa fa-home",
        needLogin: false,
        path: "/"
      },
      {
        key: "chat",
        name: this.props.t("Homepageheader.Chat"),
        icon: "fa fa-commenting",
        needLogin: true,
        path: "/chat/conversation"
      },
      {
        key: "profile",
        name: this.props.t("Homepageheader.MyProfile"),
        icon: "fa fa-user",
        needLogin: true,
        path: "/EditProfile"
      },
      {
        key: "logout",
        name: this.props.t("Editprofile._Logout"),
        icon: "fa fa-sign-out",
        needLogin: true,
        path: "/"
      },
      //{key: "about", name:"About Passup", icon:"fa fa-info", needLogin: false, path: "about"},
      {
        key: "terms",
        name: this.props.t("footer._termsandConditions"),
        icon: "fa fa-bookmark",
        needLogin: false,
        path: "/pages/terms_and_conditions"
      },
      {
        key: "policy",
        name: this.props.t("footer._privacypolicy"),
        icon: "fa fa-building",
        needLogin: false,
        path: "/pages/privacy_policy"
      }
    ];

    let { classes, currentUser, t } = this.props;
    let currenList =
      currentUser && currentUser.id
        ? profileList
        : profileList.filter(f => !f.needLogin);

    return (
      <div>
        <ProductConsumer>
          {ContextValue => (
            <>
              <Modal
                isOpen={this.state.aboutModal}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                contentLabel="Minimal Modal Example"
                style={customStyles1}
              >
                <section className="iHQQug">
                  <div className="closeabou">
                    <button
                      type="button"
                      onClick={this.closeModal}
                      class=" float-left location-close ltn"
                    >
                      <span class="clsbtn" data-dismiss="modal">
                        {" "}
                        ×{" "}
                      </span>
                    </button>
                  </div>
                  <div className="listitempas">
                    <ul>
                      <li> About Passup</li>
                      <li> Help</li>
                      <li> Jobs</li>
                      <li> Safety Tips</li>
                      <li> Passup Community details </li>
                      <li> Terms and Condition</li>
                      <li> Best Practices</li>
                    </ul>
                  </div>
                </section>
              </Modal>

              <Modal
                isOpen={this.state.modalIsOpen}
                //onAfterOpen={this.afterOpenModal}
                //onRequestClose={this.closeModalSlide}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <div className="discardPopup">
                  <h3>{t("Homepageheader._notposted")}</h3>
                  <hr />
                  <section>
                    <article>
                      <p>{t("Homepageheader._postit")}</p>
                    </article>
                  </section>
                  <footer>
                    <button
                      className="btn1 btn-block"
                      onClick={() => this.closeModalSlide("PostList")}
                    >
                      {" "}
                      {t("Homepageheader._Continue")}
                    </button>
                    <button
                      className="btn2 btn-block"
                      onClick={() => this.closeModalSlide("Discard")}
                    >
                      {" "}
                      {t("Homepageheader._Discard")}
                    </button>
                  </footer>
                </div>
              </Modal>
              <header>
                <div className={classes.topPanel}>
                  <nav
                    id="hdrFx"
                    className={
                      classes.navbar +
                      " " +
                      classes.flexNoWrap +
                      " " +
                      classes.dMdFlex +
                      " " +
                      classes.navbarLight +
                      " " +
                      classes.alignItemsCenter
                    }
                  >
                    <div className={classes.logo}>
                      <a
                        className={
                          classes.navbarBrand +
                          " " +
                          classes.dInlineBlock +
                          " " +
                          classes.themeColor
                        }
                        onClick={this.redirectURl}
                      >
                        <img
                          className={classes.imgFluid}
                          src={this.state.image}
                        />
                      </a>
                    </div>
                    <div
                      className={
                        classes.headerSearch +
                        " " +
                        classes.dFlex +
                        " " +
                        classes.alignItemsCenter +
                        " " +
                        classes.mrmd3
                      }
                    >
                      <Magnify
                        className={
                          classes.iconMagnifyingGlass + " " + classes.icon
                        }
                      />
                      <input
                        className={classes.Input}
                        type="text"
                        name=""
                        placeholder={this.props.t(
                          "Homepageheader._Whatlooking"
                        )}
                        onChange={this.handleChange}
                        value={this.state.srch}
                        onKeyDown={this.goHome}
                      />
                      {srch.length > 0 && (
                        <button onClick={this.clr} className="clsIco">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    <i
                      className={
                        classes.filterButton +
                        " " +
                        classes.dBlock +
                        " " +
                        classes.dMdNone +
                        " " +
                        classes.mx2
                      }
                    />

                    {currentUser && currentUser.id ? (
                      ""
                    ) : (
                      <div className="reslogin">
                        <Button
                          onClick={e => this.handleLogin(true)}
                          className={
                            classes.btn1 +
                            " " +
                            classes.btnSecondary +
                            " " +
                            classes.dMdBlock +
                            " " +
                            classes.dNone +
                            " " +
                            classes.mr2
                          }
                        >
                          {this.props.t("Homepageheader._login")}
                        </Button>
                      </div>
                    )}
                    <Query query={GET_LOGIN_POPUP_STATE}>
                      {({ loading, data }) => (
                        <div className="reslogin">
                          {!loading && data && data.isOpen ? (
                            <LoginComponent
                              onClick={this.handleLogin}
                              open={data.isOpen}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </Query>
                    <div className="responssell" ref={ref => (this.el = ref)}>
                      <Button
                        onClick={() => this.openHeaderModel()}
                        className={
                          classes.btn1 +
                          " " +
                          classes.btnPrimary +
                          " " +
                          classes.btn +
                          " " +
                          classes.textNoWrap
                        }
                      >
                        {this.props.t("Homepageheader._Sellstuff")}
                        <Camera
                          className={
                            classes.mx2 +
                            " " +
                            classes.icon +
                            " " +
                            classes.iconCamera
                          }
                        />
                      </Button>
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
                        title={sellingTitle}
                        onRequestClose={() => {
                          //console.log("test")
                          //this.setState({ isPaneOpen: false });
                        }}
                      >
                        <div>
                          {
                            <Category
                              headerStuffClicked={headerStuffClicked}
                              discardStuffValue={discardStuff}
                              manageBeforeLogin={ContextValue.stuffValue}
                              refetchValue={ContextValue}
                              clickPosting={this.props.clickPosting}
                              clearValue={this.props.clearValue}
                              showValue={this.props.showValue}
                              postDone={this.props.postDone}
                              closeSlidingPanel={this.closeSlidingPanel}
                            />
                          }
                        </div>
                      </SlidingPane>
                    </div>

                    <div className="resfilte">
                      <button
                        type="button"
                        //role="button"
                        onClick={this.handleOpenModal}
                        class="sc-iwsKbI sc-gqjmRU cDiii"
                        data-test="filter"
                        data-testid="filter"
                      >
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path
                            fill="rgb(189, 189, 189)"
                            d="M17.724 18.5c-.577 1.515-2.03 2.59-3.729 2.59-1.7 0-3.152-1.075-3.729-2.59h-6.85c-.755 0-1.369-.672-1.369-1.5s.614-1.5 1.37-1.5h6.885c.6-1.467 2.027-2.5 3.693-2.5s3.094 1.033 3.693 2.5h2.99c.756 0 1.37.672 1.37 1.5s-.614 1.5-1.37 1.5h-2.954zM5.312 5.5C5.912 4.033 7.34 3 9.006 3s3.094 1.033 3.693 2.5h7.885c.756 0 1.37.672 1.37 1.5s-.614 1.5-1.37 1.5h-7.85c-.577 1.515-2.028 2.59-3.728 2.59-1.7 0-3.152-1.075-3.73-2.59H3.324c-.756 0-1.37-.672-1.37-1.5s.614-1.5 1.37-1.5h1.99zm3.694 3.307c.939 0 1.712-.783 1.712-1.762 0-.98-.773-1.762-1.712-1.762-.94 0-1.712.783-1.712 1.762 0 .98.773 1.762 1.712 1.762zm4.99 10c.938 0 1.711-.783 1.711-1.762 0-.98-.773-1.762-1.712-1.762-.94 0-1.712.783-1.712 1.762 0 .98.773 1.762 1.712 1.762z"
                          ></path>
                        </svg>
                      </button>
                      <div className="clsoeres">
                        <Modal
                          isOpen={this.state.showModal}
                          onAfterOpen={this.afterOpenModal}
                          onRequestClose={this.closeModal}
                          className="Modal11"
                          style={customStyles3}
                          contentLabel="Example Modal"
                        >
                          <div className="popfilltegh">
                            <div className="border-btm">
                              <div className="jsvhtV">
                                <button
                                  type="button"
                                  //role="button"
                                  onClick={this.handleCloseModal}
                                  class="sc-iwsKbI sc-gqjmRU jxllvb"
                                  data-test="filters.cancel"
                                  data-testid="filters.cancel"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    class="sc-jTzLTM fznnpf"
                                  >
                                    <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z"></path>
                                  </svg>
                                </button>
                              </div>
                              <div className="fXFqhW">
                                <h2 className="iVJeIQ">
                                  {" "}
                                  {this.props.t(
                                    "Homepageheader._Fillters"
                                  )}{" "}
                                </h2>
                              </div>
                            </div>
                            <div className="overallpaddpp">
                              <div className="fcxopb">
                                <h1>
                                  {" "}
                                  <span>
                                    {" "}
                                    {this.props.t("Homepageheader._Categories")}
                                  </span>{" "}
                                </h1>
                              </div>
                              <CategoryFilter  getCacheCategoryData={this.props.getCacheCategoryData} />
                              <HomeFilter />

                              {((this.props.getCacheCategoryData) && filterData.length > 0) ? (
                                <ProductConsumer>
                                  {value => (
                                  <DynamicFilter 
                                    categoryId={this.props.getCacheCategoryData}
                                    AdvancedFiltersubmit={value.AdvancedFiltersubmit}
                                    handleCloseModal={this.handleCloseModal}
                                    filterValue={contextConsumerInner.AdvancedFilter}
                                    filterData={filterData}
                                  />
                                  )}
                                </ProductConsumer>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </Modal>
                      </div>
                    </div>

                    {currentUser && currentUser.id ? (
                      <div
                        onClick={this.handleChat}
                        className={
                          classes.icon +
                          " " +
                          classes.iconChatBubbles +
                          " " +
                          classes.msgIcon +
                          " " +
                          classes.dMdBlock +
                          " " +
                          classes.dNone
                        }
                      >
                        <div className="pos_rel">
                          {currentUser.unreadMessage > 0 &&
                            <div className="notification homepgheade">
                            </div>}

                        </div>
                        <div className="chat-bu">
                          <ChatBubble
                            className={
                              classes.chatBubble +
                              " " +
                              classes.ml2 +
                              " " +
                              classes.icon
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className={classes.mainMenu}>
                      <div className={classes.navOverlay} />
                      <Button
                        onClick={this.handleActiveScreen}
                        className={
                          classes.navbarToggler + " " + "resposvbtnvwe"
                        }
                      >
                        {currentUser && currentUser.id ? (
                          <img
                            src={currentUser.profileImage}
                            width={"40px"}
                            height={"40px"}
                            className="circleover"
                          />
                        ) : (
                          <Dehaze />
                        )}
                      </Button>
                      {inActive ? (
                        <div
                          className={classes.headerProfileList + " homePopup"}
                          ref={this.props.setRef}
                        >
                          <div>
                            {currentUser && currentUser.id ? (
                              <div
                                className={
                                  classes.profileSet + " rtlprofileset "
                                }
                              >
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={this.openProfile}
                                >
                                  <img
                                    className="sidebarprofile"
                                    src={currentUser.profileImage}
                                    width={"40px"}
                                    height={"40px"}
                                  />
                                </div>
                                <div
                                  className={
                                    classes.profileName + " rtlprofilename "
                                  }
                                  onClick={this.openProfile}
                                >
                                  {currentUser.userName}
                                </div>
                                <div
                                  className={classes.profilePlace}
                                  onClick={this.openProfile}
                                >
                                  {/* {city} */}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={
                                  classes.profileSet + " rtlprofileset "
                                }
                              >
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={e => this.handleLogin(true)}
                                >
                                  <img
                                    src={defaultImg}
                                    width={"40px"}
                                    height={"40px"}
                                  />
                                </div>
                                <div
                                  className={classes.profileName}
                                  onClick={e => this.handleLogin(true)}
                                >
                                  {this.props.t("Homepageheader._Logininnow")}
                                </div>
                                <div
                                  className={classes.profilePlace}
                                  onClick={e => this.handleLogin(true)}
                                >
                                  {this.props.t(
                                    "Homepageheader._yourenotlogged"
                                  )}
                                </div>
                              </div>
                            )}

                            <nav className="bgresclg">
                              {currenList.map((m, i) => {
                                return (
                                  <div
                                    onClick={e => this.redirect(e, m)}
                                    key={i}
                                  >
                                    <span className="menu-icon">
                                      <div>
                                        {" "}
                                        {m.path === "/EditProfile" ? (
                                          <Link
                                            className="sideMenu"
                                            onClick={this.handleActiveScreen}
                                            to={`${m.path}/${currentUser.id}`}
                                          >
                                            <span className="menu-subicon">
                                              <i class={m.icon}></i>
                                            </span>{" "}
                                            <span>{m.name}</span>
                                          </Link>
                                        ) : (
                                          <>
                                            {m.path === "about" ? (
                                              <div
                                                className="sideMenu"
                                                onClick={this.aboutPage}
                                                data-toggle="modal"
                                              >
                                                <span className="menu-subicon">
                                                  <i class={m.icon}></i>
                                                </span>
                                                <span className="aboupop">
                                                  {m.name}
                                                </span>
                                              </div>
                                            ) : (
                                              <Link
                                                className="sideMenu"
                                                onClick={
                                                  this.handleActiveScreen
                                                }
                                                to={m.path}
                                              >
                                                <span className="menu-subicon">
                                                  <i class={m.icon}></i>
                                                </span>
                                                <span>{m.name}</span>
                                              </Link>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </span>
                                  </div>
                                );
                              })}
                            </nav>
                          </div>
                          <div onClick={this.closePanle} className="bg_layer" />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </nav>
                </div>
              </header>
             { 
                  currentUser && currentUser.id  && (history.location.pathname !== "/chat/conversation") ?
                      <div className="mesg_conver">
                        <Link  to={`/chat/conversation`}>
                          <div className="pos_rel">
                              {currentUser && currentUser.unreadMessage > 0 &&
                                <div className="notification homepgheade">
                                </div>}
                          </div>
                          <ChatBubble
                                  className={
                                    classes.chatBubble +
                                    " " +
                                    classes.ml2 +
                                    " " +
                                    classes.icon
                                  }
                                />
                        </Link>
                      </div> : ""
                }
            </>
          )}
        </ProductConsumer>
      </div>
    );
  }
}

Header.propTypes = {
  onClick: PropTypes.func
};

var HeaderComponent = compose(
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(LOG_OUT, { name: "logOut" }),
  graphql(GET_CURRENT_USER, { name: "loggedUser" }),
  graphql(POPUP_STATE_UPDATE, { name: "updateLoginPopupStatus" }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(SEARCH_INPUT, { name: "searchResult" }),
  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
      name: "pageCountFilter",
      options: () => ({
        fetchPolicy: 'cache-only'
      })
    }),
  graphql(GET_CACHE_STATE, {
    name: "getCacheData",
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

  graphql(UPDATE_PRODUCT, { name: "updateProduct" }),
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(CATEGORY_ID, { name: "getCategoryId" })
)(Header);

export default withTranslation("common")(withStyles(styles)(HeaderComponent));