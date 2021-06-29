import React from "react";
import { compose, graphql } from "react-apollo";
import {
  BLOCK_USER,
  GET_CURRENT_USER,
  GET_USER,
  LOG_OUT,
  GET_CATEGORIES,
  ISOPEN,
  INACTIVE,
  GET_REASONS,
  UPDATE_USER_REPORT
} from "../../../queries";
import * as Toastr from "../Toast.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import Input from "@material-ui/core/Input";
import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import { withTranslation } from "react-i18next";
import { animateScroll as scroll } from "react-scroll";
import { Link } from "react-router-dom";
import prgd1 from "../../../assets/img/prgd1.gif";
import StarRatingComponent from "react-star-rating-component";
import { dateAdd } from "../../../helper.js";
import Modal from "react-modal";

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
    transform: "translate(-50%, -50%)",
    width: "30%",
    padding: "25px"
  }
};

class SellerDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: [],
      foundUser: {},
      ForSale: [],
      SoldOut: [],
      favourites: [],
      reviews: [],
      data: {},
      cUser: {},
      file: "",
      visible: 10,
      showScroll: false,
      userStatus: "",
      isBlocked: "",
      DeleteModelBlock: false,
      DeleteReportModel: false,
      rating: 1,
      reasonInfo: [],
      reasons: "",
      inputValue: "",
      choosenReportValue: "",
      reportForm: false,
      disableReportButton: false,
      activeItem: -1
    };

    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.setRef = this.setRef.bind(this);
    this.bRef = this.bRef.bind(this);
    this.handleCloseBlockModal = this.handleCloseBlockModal.bind(this);
    this.handleCloseReportModal = this.handleCloseReportModal.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  setRef(node) {
    this.wrapperRef = node;
  }
  bRef(node) {
    this.blockRef = node;
  }
  componentDidMount() {
    window.addEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
    const { match } = this.props;
    const id = match.params.userId;
    this.getData(id);
  }

  onStarClickHalfStar(nextValue, prevValue, name, e) {
    const xPos =
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.offsetWidth;

    if (xPos <= 0.5) {
      nextValue -= 0.5;
    }
    this.setState({ rating: nextValue, changeRating: true });
  }

  getData = id => {
    this.props.client
      .query({
        query: GET_USER,
        variables: { id: Number(id) }
      })
      .then(({ data, loading, error }) => {
        if (loading) return <div></div>;
        if (error) return <div>error...</div>;
        if (data) {
          let ResponseData = data.getUserDetails;
          this.setState({
            foundUser: ResponseData.foundUser,
            ForSale: ResponseData.ForSale,
            SoldOut: ResponseData.SoldOut,
            favourites: ResponseData.favourites,
            reviews: ResponseData.review,
            isBlocked: ResponseData.foundUser.isBlocked
          });
        }
      })
      .catch(e => {
        this.props.history.push("/");
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

  componentWillMount() {
    let { currentUser, reasons } = this.props;
    reasons.refetch();
    if (reasons && reasons.getReasons) {
      this.setState({
        reasonInfo: reasons.getReasons
      });
    }
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
  }

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

  handleActiveScreen(e) {
    e.preventDefault();
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.props.inActiveScreen({ variables: { inActive: false } });
    }
    if (this.blockRef && !this.blockRef.contains(e.target)) {
      this.props.isOpenScreen({ variables: { open: false } });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { currentUser, reasons } = nextProps;
    reasons.refetch();
    if (reasons && reasons.getReasons) {
      this.setState({
        reasonInfo: reasons.getReasons
      });
    }

    currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
    if (this.props.match.params.userId !== nextProps.match.params.userId) {
      this.getData(nextProps.match.params.userId);
    }
  }

  loadMore() {
    this.setState(prev => {
      return { visible: prev.visible + 10 };
    });
  }

  handleBlock(e, foundUser) {
    e.preventDefault();
    let { currentUser } = this.props;
    if (currentUser && currentUser.id !== foundUser.id) {
      this.props
        .blockUser({
          variables: { id: Number(foundUser.id) },
          refetchQueries: [
            { query: GET_USER, variables: { id: Number(foundUser.id) } }
          ]
        })
        .then(({ data }) => {
          //console.log("blocked status", data.blockUser.status);
          if (data.blockUser.status === "blocked") {
            this.setState({
              isBlocked: true
            });
          } else {
            this.setState({
              isBlocked: false
            });
          }
          this.setState({
            DeleteModelBlock: false
          });
        });
    }
  }

  handleBlockModel = () => {
    this.setState({
      DeleteModelBlock: true
    });
  };

  handleReportModel = () => {
    this.setState({
      DeleteReportModel: true
    });
  };

  handleCloseBlockModal = () => {
    this.setState({ ...this.state.DeleteModelBlock }, () => {
      this.setState({
        DeleteModelBlock: false
      });
    });
  };

  handleCloseReportModal = () => {
    this.setState({ ...this.state.DeleteReportModel }, () => {
      this.setState({
        DeleteReportModel: false,
        disableReportButton: false
      });
    });
  };

  productPage = () => {
    this.props.history.goBack();
  };
  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  // reasonChanged = (e) => {
  //   e.preventDefault();
  //   console.log(e.target)
  //   console.log(e.currentTarget)
  //   this.setState({
  //     reasons: e.currentTarget.value
  //     });
  // }

  reasonsClick = (e, name, index) => {
    this.setState({
      choosenReportValue: name,
      disableReportButton: true,
      activeItem: index
    });
  };

  updateInputReportValue = evt => {
    this.setState({
      inputValue: evt.target.value
    });
  };

  reportSubmit = (e, name, value) => {
    let id = this.props.match.params.userId;
    var result = {
      id: Number(id),
      reportId: Number(value),
      comments: name
    };
    this.props
      .updateUserReports({
        variables: result
      })
      .then(async ({ data }) => {
        // this.setState({
        //   getFeedBack: false
        // });
        if (data) {
          Toastr.success(
            <div className="msgg">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  style={{ fill: "green" }}
                >
                  <path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path>
                </svg>
              </div>
              <div>{this.props.t("Sellerdetails._ReportedSuccessfully")}</div>
            </div>
          );
          this.setState({
            DeleteReportModel: false,
            choosenReportValue: "",
            inputValue: "",
            disableReportButton: false
          });
        }
      })
      .catch(error => {
        console.log(error);
        var message = error.graphQLErrors.map(x => x.message);
        this.setState({
          DeleteReportModel: false,
          choosenReportValue: "",
          inputValue: "",
          disableReportButton: false
        });
        Toastr.success(
          <div className="msgg">
            <div>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                style={{ fill: "red" }}
              >
                <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
              </svg>
            </div>
            <div>{message[0]}</div>
          </div>
        );
      });
  };

  reportClosemodal = () => {
    this.setState({ DeleteReportModel: false });
  };

  render() {
    let { classes, t } = this.props;
    const timestamp = Date.now();
    const {
      showScroll,
      foundUser,
      ForSale,
      SoldOut,
      reviews,
      isBlocked,
      DeleteModelBlock,
      DeleteReportModel,
      reasonInfo
    } = this.state;

    const findTimeStamp = (d, t, lang) => {
      return dateAdd(d, t, lang);
    };

    return (
      <div onClick={this.handleActiveScreen} id="content">
        <div>
          {/* <Header
      match={match}
      setRef={this.setRef}
      location={location}
      history={history}
      currentUser={cUser}
    /> */}

          <div className="top-space">
            <div className={classes.container}>
              <div className="wrapper-edit">
                <div>
                  {/* <Query query={GET_USER} variables={{ id: Number(id) }}>
                    {({ data, loading, error }) => {
                      if (loading) return <div></div>;
                      if (error) return <div>error...</div>;
                      const userUnique = data.getUserDetails.foundUser;
                      const productUnique = data.getUserDetails.ForSale;
                      const soldUnique = data.getUserDetails.SoldOut;

                      return ( */}
                  <div>
                    <div className="googleadpr">
                      <img src={prgd1} className="img-fluid" alt="" />
                    </div>
                    <div className="wrappperclass">
                      <div className="float-left leftPart sellerreleftpart">
                        <div className="usRDea float-left resimgname">
                          <div className="editPr float-left profileimgsell">
                            <img src={foundUser.profileImage} alt="" />
                          </div>
                          <div className="editNme responsiveeed float-left sellenameres">
                            <h4> {foundUser.userName}</h4>
                            {foundUser.userRating >= 1 ? (
                              // <StarRatingComponent
                              //   name="rate1"
                              //   value={foundUser.userRating}
                              // />

                              <StarRatingComponent
                                name="app6"
                                //starColor="#ffb400"
                                // emptyStarColor="#ffb400"
                                value={foundUser.userRating}
                                onStarClick={this.onStarClickHalfStar.bind(
                                  this
                                )}
                                renderStarIcon={(index, value) => {
                                  return (
                                    <span>
                                      <i
                                        className={
                                          index <= value
                                            ? "fas fa-star"
                                            : "far fa-star"
                                        }
                                      />
                                    </span>
                                  );
                                }}
                                renderStarIconHalf={() => {
                                  return (
                                    <span>
                                      <span style={{ position: "absolute" }}>
                                        <i className="far fa-star" />
                                      </span>
                                      <span>
                                        <i className="fas fa-star-half" />
                                      </span>
                                    </span>
                                  );
                                }}
                              />
                            ) : (
                              <>
                                {" "}
                                <h6> {t("Editprofile._NoRatings")} </h6>{" "}
                              </>
                            )}
                            {/* <p> {foundUser.userRating}</p> */}
                          </div>
                        </div>
                      </div>

                      <div className="float-left rightPart selledreight">
                        <div
                          class="sc-fjdhpX jsvhtV selledetaa"
                          onClick={this.productPage}
                        >
                          <button
                            type="button"
                            //role="button"
                            class="sc-iwsKbI sc-gqjmRU jxllvb sellres"
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
                        <div
                          class="dropdown overpg drpDwnAdj"
                          style={{ position: "relative" }}
                        >
                          <div
                            onClick={this.handleOpen}
                            class=" dropdown-toggle aftercss"
                            data-toggle="dropdown"
                          >
                            {this.props.currentUser.getCurrentUser !== null && (
                              <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                className="sc-VigVT fEbzNV"
                                fill="#757575"
                              >
                                <path d="M11.785 17.139c1.375 0 2.5 1.125 2.5 2.5s-1.125 2.5-2.5 2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5zm0-2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5zm0-7.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5z"></path>
                              </svg>
                            )}
                          </div>
                          <div class="dropdown-menu chatbox selerrtlcss">
                            <div
                              ref={this.props.setRef}
                              className={classes.chatOperations}
                            >
                              <ul>
                                <li onClick={this.handleBlockModel}>
                                  <Modal
                                    isOpen={DeleteModelBlock}
                                    contentLabel="Minimal Modal Example"
                                    style={customStyles}
                                  >
                                    <section className="iHQQug">
                                      {!isBlocked && (
                                        <>
                                          <div className="bwXZIf">
                                            <header>
                                              {" "}
                                              <h1>
                                                {" "}
                                                {t(
                                                  "Sellerdetails._Blockuser"
                                                )}{" "}
                                              </h1>
                                            </header>
                                          </div>
                                          <article>
                                            <span>
                                              {t("Sellerdetails._goingtoblock")}
                                            </span>
                                          </article>
                                          <div class="sav_chang cancee">
                                            <button
                                              type="submit"
                                              onClick={e =>
                                                this.handleBlock(e, foundUser)
                                              }
                                              class="btn btn-danger btn-block"
                                            >
                                              {t("Sellerdetails._Blockuser")}
                                            </button>
                                          </div>
                                          <div class="sav_chang">
                                            <button
                                              type="submit"
                                              onClick={
                                                this.handleCloseBlockModal
                                              }
                                              class="btn iDhWYa btn-block"
                                            >
                                              {t("Productdetails._Cancel")}
                                            </button>
                                          </div>
                                        </>
                                      )}
                                      {isBlocked && (
                                        <>
                                          {" "}
                                          <div className="bwXZIf">
                                            <header>
                                              {" "}
                                              <h1>
                                                {" "}
                                                {t(
                                                  "Sellerdetails._UnBlockuser"
                                                )}{" "}
                                              </h1>
                                            </header>
                                          </div>
                                          <article>
                                            <span>
                                              {t(
                                                "Sellerdetails._goingtounblock"
                                              )}
                                            </span>
                                          </article>
                                          <div class="sav_chang cancee">
                                            <button
                                              type="submit"
                                              onClick={e =>
                                                this.handleBlock(e, foundUser)
                                              }
                                              class="btn btn-danger btn-block"
                                            >
                                              {t("Sellerdetails._UnBlockuser")}
                                            </button>
                                          </div>
                                          <div class="sav_chang">
                                            <button
                                              type="submit"
                                              onClick={
                                                this.handleCloseBlockModal
                                              }
                                              class="btn iDhWYa btn-block"
                                            >
                                              {t("Productdetails._Cancel")}
                                            </button>
                                          </div>{" "}
                                        </>
                                      )}
                                    </section>
                                  </Modal>
                                  {isBlocked
                                    ? t("Sellerdetails._UnBlockuser")
                                    : t("Sellerdetails._Blockuser")}
                                </li>
                              </ul>
                              <ul>
                                <li onClick={this.handleReportModel}>
                                  <Modal
                                    isOpen={DeleteReportModel}
                                    contentLabel="Minimal Modal Example"
                                    style={customStyles}
                                  >
                                    <section className="iHQQug">
                                      <div className="closebuttonissues">
                                        <div class="rtlarr">
                                          <button
                                            type="button"
                                            class=" float-left location-close ltn"
                                            onClick={
                                              this.handleCloseReportModal
                                            }
                                          >
                                            {" "}
                                            <span class="clsbtn"> × </span>
                                          </button>{" "}
                                          <span class="chng-loc">
                                            {" "}
                                            {t(
                                              "Sellerdetails._ReportReasons"
                                            )}{" "}
                                          </span>{" "}
                                        </div>
                                      </div>
                                      <div className="jJdLlm seller">
                                        {reasonInfo &&
                                          reasonInfo.map((reason, index) => (
                                            <div
                                              className="whpls"
                                              title={reason.name}
                                            >
                                              <div
                                                className={
                                                  this.state.activeItem ===
                                                  index
                                                    ? "category-deat active"
                                                    : "category-deat"
                                                }
                                                onClick={e =>
                                                  this.reasonsClick(
                                                    e,
                                                    reason.id,
                                                    index
                                                  )
                                                }
                                              >
                                                <div className="catrgyr">
                                                  <div>
                                                    <div className="activetickvalue">
                                                      {" "}
                                                    </div>
                                                    <img
                                                      src={reason.image}
                                                      alt=""
                                                    />
                                                  </div>
                                                  <div className="categoryname">
                                                    {reason.name}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                      <Input
                                        defaultValue={this.state.inputValue}
                                        placeholder={t(
                                          "Sellerdetails._addComment"
                                        )}
                                        className={classes.popsp}
                                        fullWidth
                                        inputProps={{
                                          onChange: e =>
                                            this.updateInputReportValue(e)
                                        }}
                                      />
                                      <div className="sesslesubmit sav_chang">
                                        <button
                                          disabled={
                                            !this.state.disableReportButton
                                          }
                                          className="btn btn-danger btn-block"
                                          onClick={e =>
                                            this.reportSubmit(
                                              e,
                                              this.state.inputValue,
                                              this.state.choosenReportValue
                                            )
                                          }
                                        >
                                          {t("Sellerdetails._addReportButton")}
                                        </button>
                                      </div>
                                    </section>
                                  </Modal>
                                  {t("Sellerdetails._rUser")}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="clearfix" />
                    {isBlocked && (
                      <div className="btn1-sm mt1">
                        {t("Sellerdetails._blockedthisuser")}
                      </div>
                    )}

                    <div className="float-left w-100 tabs-re">
                      <div className="row">
                        <div className="col-sm-12 ">
                          <nav>
                            <div
                              className="nav nav-tabs nav-fill"
                              id="nav-tab"
                              role="tablist"
                            >
                              <a
                                className="nav-item nav-link active"
                                id="nav-home-tab"
                                data-toggle="tab"
                                href="#nav-home"
                                role="tab"
                                aria-controls="nav-home"
                                aria-selected="true"
                              >
                                {t("Sellerdetails._Selling")}
                              </a>
                              <a
                                className="nav-item nav-link"
                                id="nav-contact-tab"
                                data-toggle="tab"
                                href="#nav-contact"
                                role="tab"
                                aria-controls="nav-contact"
                                aria-selected="false"
                              >
                                {t("Sellerdetails._Sold")}
                              </a>

                              <a
                                className="nav-item nav-link"
                                id="nav-contact-tab"
                                data-toggle="tab"
                                href="#nav-review"
                                role="tab"
                                aria-controls="nav-contact"
                                aria-selected="false"
                              >
                                {t("Sellerdetails._Reviews")}
                              </a>
                            </div>
                          </nav>

                          <div
                            className="tab-content py-3 px-3 px-sm-0"
                            id="nav-tabContent"
                          >
                            <div
                              className="tab-pane fade show active"
                              id="nav-home"
                              role="tabpanel"
                              aria-labelledby="nav-home-tab"
                            >
                              <div className="product-list">
                                <div>
                                  <div className={classes.NqLdW}>
                                    <div className={classes.lotuhp}>
                                      <div
                                        className={classes.NqLdW + " leftalsee"}
                                      >
                                        {ForSale != null &&
                                        ForSale.length < 1 ? (
                                          <div className="nolis">
                                            {" "}
                                            {t("Editprofile._NOLISTINGS")}
                                          </div>
                                        ) : (
                                          ForSale.slice(
                                            0,
                                            this.state.visible
                                          ).map(item => (
                                            <div className={classes.foIXbw}>
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
                                                        item.featured != null
                                                          ? 'classes.iOHpjI + "aasd'
                                                          : ""
                                                      }
                                                    >
                                                      <section
                                                        className={
                                                          item.featured != null
                                                            ? "bgcolor"
                                                            : "nobrpayment"
                                                        }
                                                      >
                                                        <Link
                                                          to={`/products/${item.id}/`}
                                                        >
                                                          <div
                                                            className={"inner"}
                                                            id="myId"
                                                          >
                                                            <img
                                                              src={
                                                                item.images[0]
                                                              }
                                                            />
                                                            {item.isFree && (
                                                              <div className="ribbon">
                                                                <div>
                                                                  {" "}
                                                                  {t(
                                                                    "Editprofile._Free"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                            {item.featured && (
                                                              <div className="urgent">
                                                                <div>
                                                                  {t(
                                                                    "Editprofile._Featured"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                          <div
                                                            className={"footer"}
                                                          >
                                                            <div className="foot-produ">
                                                              <h6>
                                                                {" "}
                                                                {
                                                                  item.title
                                                                }{" "}
                                                              </h6>
                                                              <p>
                                                                {" "}
                                                                {
                                                                  item.description
                                                                }
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </Link>
                                                      </section>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className={classes.bSJSSe}>
                                    {this.state.visible < ForSale.length && (
                                      <button
                                        onClick={this.loadMore}
                                        type="button"
                                        className={classes.jqJLdD}
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="nav-contact"
                              role="tabpanel"
                              aria-labelledby="nav-contact-tab"
                            >
                              <div className="product-list">
                                <div>
                                  <div className={classes.NqLdW}>
                                    <div className={classes.lotuhp}>
                                      <div
                                        className={classes.NqLdW + " leftalsee"}
                                      >
                                        {SoldOut != null &&
                                        SoldOut.length < 1 ? (
                                          <div className="nolis">
                                            {" "}
                                            {t("Editprofile._NOLISTINGS")}
                                          </div>
                                        ) : (
                                          SoldOut.slice(
                                            0,
                                            this.state.visible
                                          ).map(item => (
                                            <div className={classes.foIXbw}>
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
                                                        item.featured != null
                                                          ? 'classes.iOHpjI + "aasd'
                                                          : ""
                                                      }
                                                    >
                                                      <section
                                                        className={
                                                          item.featured != null
                                                            ? "bgcolor"
                                                            : "nobrpayment"
                                                        }
                                                      >
                                                        <Link
                                                          to={`/products/${item.id}/`}
                                                        >
                                                          <div
                                                            className={"inner"}
                                                            id="myId"
                                                          >
                                                            <img
                                                              src={
                                                                item.images[0]
                                                              }
                                                            />
                                                            {item.isFree && (
                                                              <div className="ribbon">
                                                                <div>
                                                                  {" "}
                                                                  {t(
                                                                    "Editprofile._Free"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                            {item.featured && (
                                                              <div className="urgent">
                                                                <div>
                                                                  {t(
                                                                    "Editprofile._Featured"
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                          <div
                                                            className={"footer"}
                                                          >
                                                            <div className="foot-produ">
                                                              <h6>
                                                                {" "}
                                                                {
                                                                  item.title
                                                                }{" "}
                                                              </h6>
                                                              <p>
                                                                {" "}
                                                                {
                                                                  item.description
                                                                }
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </Link>
                                                      </section>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className={classes.bSJSSe}>
                                    {this.state.visible < SoldOut.length && (
                                      <button
                                        onClick={this.loadMore}
                                        type="button"
                                        className={classes.jqJLdD}
                                      >
                                        {t("Editprofile._loadmore")}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="nav-review"
                              role="tabpanel"
                              aria-labelledby="nav-about-tab"
                            >
                              <div className="product-list">
                                <div className="reviwuser">
                                  {reviews != null && reviews.length < 1 ? (
                                    <div className="nolis">
                                      {" "}
                                      {t("Editprofile._NOLISTINGS")}
                                    </div>
                                  ) : (
                                    reviews
                                      .slice(0, this.state.reviewVisible)
                                      .map(item => (
                                        <div className="reusewraye ">
                                          <div className="border-bottomline">
                                            {/* <Link to={`/SellerDetails/${item.userFrom}`} > */}
                                            <div className="wholereviewwr">
                                              <img src={item.imageUrl} />
                                            </div>

                                            <div className="leftimgrev seller">
                                              <h6> {item.fromName}</h6>
                                              <div className="desrev">
                                                {/* <StarRatingComponent
                                                  name="rate1"
                                                  starCount={5}
                                                  value={item.ratings}
                                                  onStarClick={this.onStarClick.bind(
                                                    this
                                                  )}
                                                /> */}

                                                <StarRatingComponent
                                                  name="app6"
                                                  //starColor="#ffb400"
                                                  // emptyStarColor="#ffb400"
                                                  value={item.ratings}
                                                  onStarClick={this.onStarClickHalfStar.bind(
                                                    this
                                                  )}
                                                  renderStarIcon={(
                                                    index,
                                                    value
                                                  ) => {
                                                    return (
                                                      <span>
                                                        <i
                                                          className={
                                                            index <= value
                                                              ? "fas fa-star"
                                                              : "far fa-star"
                                                          }
                                                        />
                                                      </span>
                                                    );
                                                  }}
                                                  renderStarIconHalf={() => {
                                                    return (
                                                      <span>
                                                        <span
                                                          style={{
                                                            position: "absolute"
                                                          }}
                                                        >
                                                          <i className="far fa-star" />
                                                        </span>
                                                        <span>
                                                          <i className="fas fa-star-half" />
                                                        </span>
                                                      </span>
                                                    );
                                                  }}
                                                />

                                                <p className="maghbtm">
                                                  {" "}
                                                  {item.feedBack[0]}{" "}
                                                </p>
                                                <p>{item.comment}</p>
                                                <p className="timelinerew">
                                                  {" "}
                                                  {findTimeStamp(
                                                    item.createdAt,
                                                    timestamp,
                                                    t
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                            {/* </Link> */}
                                          </div>
                                        </div>
                                      ))
                                  )}
                                </div>

                                <div className={classes.bSJSSe}>
                                  {this.state.reviewVisible <
                                    reviews.length && (
                                    <button
                                      onClick={() => this.loadMore("review")}
                                      type="button"
                                      className={classes.jqJLdD}
                                    >
                                      {t("Editprofile._loadmore")}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {showScroll && (
                      <div className="anchor-fixed" onClick={this.scrollToTop}>
                        <a>
                          <span>
                            {" "}
                            <i class="fa fa-chevron-up" aria-hidden="true"></i>
                          </span>{" "}
                        </a>
                      </div>
                    )}
                  </div>
                  {/*  );
                    }}
                  </Query>  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var userAction = compose(
  graphql(GET_USER, { name: "getUser" }),
  graphql(GET_REASONS, { name: "reasons" }),
  graphql(UPDATE_USER_REPORT, { name: "updateUserReports" }),
  graphql(LOG_OUT, { name: "logOut" }),
  graphql(BLOCK_USER, { name: "blockUser" }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  })
)(SellerDetails);

export default withTranslation("common")(withStyles(styles)(userAction));