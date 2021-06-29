import React from "react";
import { compose, graphql, Mutation } from "react-apollo";
import {
  EDIT_USER,
  GET_CURRENT_USER,
  GET_USER,
  LOG_OUT,
  GET_CATEGORIES,
  ISOPEN,
  INACTIVE,
  GET_REVIEW,
  UPDATE_REVIEW
} from "../../../queries";

import { dateAdd } from "../../../helper.js";
import { withTranslation } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import prgd1 from "../../../assets/img/prgd1.gif";
import { Link } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import TextField from "@material-ui/core/TextField";
import { animateScroll as scroll } from "react-scroll";
import Modal from "react-modal";
import * as Toastr from "../Toast.jsx";

const initialState = {
  userName: "",
  email: "",
  password: "",
  newPassword: "",
  oldPassword: "",
  profileImage: "",
  id: [],
  foundUser: {},
  ForSale: [],
  SoldOut: [],
  favourites: [],
  reviews: [],
  reviewExpInfo: [],
  rating: "",
  primaryButton: [],
  secondaryButton: [],
  buttonResponse: "",
  ratingResponse: "",
  getFeedBack: false,
  feedBackTextResponse: "",
  changeRating: false,
  data: {},
  cUser: {},
  imagePreviewUrl: "",
  openHandler: false,
  showScroll: false,
  sellingVisible: 10,
  soldVisible: 10,
  favVisible: 10,
  reviewVisible: 10,
  modalIsOpen: false,
  HQimageError: false,
  userNameError: false,
  ImageFile: "",
  errors: {},
  popUpDetails: [],
  popUpDetailsPassWord: [],
  inputValue: "",
  passwordError: {
    password: "",
    newPassword: "",
    oldPassword: ""
  },
  profileEditData: {},
  UserReviewPop: false,
  ratings: "",
  feedBack: "",
  comment: "",
  reviewUser: true,
  editId: "",
  puplishReview: false
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

const customStylesReview = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    padding: "0px"
  }
};

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      activeItem: -1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    this.change = this.change.bind(this);
    this.redirect = this.redirect.bind(this);
    this.fileInput = React.createRef();
    this.setRef = this.setRef.bind(this);
    this.bRef = this.bRef.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.openModal = this.openModal.bind(this);
    //this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editreviewClosemodal = this.editreviewClosemodal.bind(this);
  }

  editreviewClosemodal() {
    this.setState({
      UserReviewPop: false,
      buttonResponse: [],
      ratingResponse: "",
      feedBackTextResponse: "",
      activeItem: "",
      rating: "",
      changeRating: false,
      puplishReview: false
    });
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
    Modal.setAppElement(this.el);

    const { match } = this.props;
    const id = match.params.id;
    this.props.client
      .query({
        query: GET_USER,
        variables: { id: Number(id) }
      })
      .then(({ data, loading, error }) => {
        //console.log("fata", res)
        if (loading){
          return <div></div>;
        }
        if (error){
          return <div>error...</div>;
        } 
        if (data) {
          let ResponseData = data.getUserDetails;
          //console.log(ResponseData)
          this.setState({
            foundUser: ResponseData.foundUser,
            ForSale: ResponseData.ForSale,
            SoldOut: ResponseData.SoldOut,
            favourites: ResponseData.favourites,
            reviews: ResponseData.review
          });
        }
      });
  }

  componentWillUnmount() {
    window.removeEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
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

  componentWillMount() {
    let { currentUser, getUser, match } = this.props;
    let id = match.params.id;
    if (!currentUser.getCurrentUser){
      currentUser.refetch();
      this.setState({
        cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
      });
    } 
    if (id) {
      getUser.refetch({ id: Number(id) }).then(({ data }) => {
        if (data && data.getUserDetails) {
          this.setState({
            foundUser: data.getUserDetails.foundUser,
            ForSale: data.getUserDetails.ForSale,
            SoldOut: data.getUserDetails.SoldOut,
            favourites: data.getUserDetails.favourites,
            reviews: data.getUserDetails.review
          });
        }
      });
    }
  }

  redirect = (event) => {
    event.preventDefault();
    this.props.logOut({ variables: { type: "user" } }).then(({ data }) => {
      if (data.logOut) {
        sessionStorage.clear();
        this.props.history.push("/");
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    let { currentUser, getUser, match } = nextProps;
    currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
    if (nextProps.getUser && nextProps.getUser.getUserDetails) {
      let {
        email,
        userName,
        password,
        status,
        profileImage
      } = nextProps.getUser.getUserDetails.foundUser;
      this.setState({
        email,
        userName,
        password,
        status,
        profileImage
      });
    }
    let id = match.params.id;
    if (id) {
      getUser.refetch({ id: Number(id) }).then(({ data }) => {
        if (data && data.getUserDetails) {
          this.setState({
            foundUser: data.getUserDetails.foundUser,
            ForSale: data.getUserDetails.ForSale,
            SoldOut: data.getUserDetails.SoldOut,
            favourites: data.getUserDetails.favourites,
            reviews: data.getUserDetails.review
          });
          //console.log(data.getUserDetails.foundUser.userName);
        }
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
  change(id, event, stateName) {
    if (stateName === "profileImage") {
      this.setState({ HQimageError: false });
      let files = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        if (id) {
          this.setState({
            editData: Object.assign(
              {},
              { id: Number(id) },
              this.state.editData,
              { [stateName]: reader.result }
            ),
            imagePreviewUrl: reader.result,
            ImageFile: files[0]
          });
        }
      };
    }
    this.setState({ [stateName]: event.target.value });
    if (id) {
      this.setState({
        editData: Object.assign({}, { id: Number(id) }, this.state.editData, {
          [stateName]: event.target.value
        })
      });
    }
  }
  handleSubmit(event, userAction, history) {
    let { match } = this.props;
    let id = match.params.id;
    event.preventDefault();
    if (!this.validateInput()) {
      if (
        this.state.ImageFile === "" ||
        (this.state.ImageFile.size < 5000000 &&
          (this.state.ImageFile.type === "image/jpeg" ||
            this.state.ImageFile.type === "image/png"))
      ) {
        userAction()
          .then(async ({ data }) => {
            this.setState({ modalIsOpen: false });
            this.setState({ HQimageError: false, popUpDetails: [] });
            history.push(`/EditProfile/${id}`);
          })
          .catch((error) => {
            var popUpDetails = error.graphQLErrors.map((x) => x.message);
            if (popUpDetails[0] === "Invalid password") {
              this.setState({ modalIsOpen: false });
            }
            if (popUpDetails[0] !== "Invalid password") {
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
                  <div>{popUpDetails[0]}</div>
                </div>
              );
            }
          });
      } else {
        this.setState({
          HQimageError: true
        });
      }
    }
  }

  preventSpace = (event) => {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  };

  onSubmit(event, userAction, history) {
    this.setState({ popUpDetailsPassWord: "" });
    let { match } = this.props;
    let id = match.params.id;
    //const { password, newPassword, oldPassword } = this.state;
    event.preventDefault();
    if (this.passwordValidate()) {
      userAction()
        .then(async ({ data }) => {
          this.setState({
            modalIsOpen: false,
            newPassword: "",
            password: "",
            oldPassword: "",
            popUpDetailsPassWord: []
          });
          history.push(`/EditProfile/${id}`);
        })
        .catch((error) => {
          this.setState({
            popUpDetailsPassWord: error.graphQLErrors.map((x) => x.message)
          });
        });
    }
  }

  passwordValidate = () => {
    const { oldPassword, password, newPassword, passwordError } = this.state;
    let errors = { ...passwordError };
    let validate = false;

    if (oldPassword.length < 4) {
      errors.oldPassword = this.props.t("Editprofile._minimum4char");
      validate = false;
    } else {
      errors.oldPassword = "";
      validate = true;
    }

    if (newPassword.length < 4) {
      errors.newPassword = this.props.t("Editprofile._minimum4char");
      validate = false;
    } else {
      errors.newPassword = "";
      validate = true;
    }

    if (password !== null && password !== newPassword) {
      errors.password = this.props.t("Editprofile._passwordnotMatch");
      validate = false;
    } else {
      errors.password = "";
    }

    if (newPassword.length >= 4 && newPassword === oldPassword) {
      errors.newPassword = this.props.t("Editprofile._sameoldandnewpswd");
      validate = false;
    }

    this.setState({ passwordError: errors });
    return validate;
  };

  validateInput() {
    var self = this;
    let required = ["userName", "email"];
    let error = {},
      flag = false;
    required.forEach((data) => {
      // if (
      //   id &&
      //   data == "oldPassword" &&
      //   self.state.editData.oldPassword == undefined
      // )
      //   error[data] = "";
      // else if (
      //   data == "oldPassword" &&
      //   id &&
      //   (self.state.editData.oldPassword == "" ||
      //     self.state.editData.oldPassword.trim() == "")
      // ) {
      //   error[data] = `The ${data} field is required.`;
      // }else
      if (!self.state[data] && !self.state[data].length) {
        error[data] = `${this.props.t("Editprofile._The")} ${
          data === "userName"
            ? this.props.t("Editprofile._userName")
            : this.props.t("Editprofile._email")
        } ${this.props.t("Editprofile._fieldrequired")}`;
      } else if (data === "email" && !!this.state.email) {
        //eslint-disable-next-line
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRex.test(this.state.email)) {
          error.email = this.props.t("Editprofile._emailValid");
        } else {
          error.email = undefined;
        }
      } else {
        error[data] = undefined;
      }
    });
    this.setState({
      errors: error
    });
    flag = Object.keys(error).find((obj) => {
      if (error[obj]) {
        return true;
      }
    });
    return flag;
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
      passwordError: { password: "", newPassword: "", oldPassword: "" },
      password: "",
      newPassword: "",
      oldPassword: "",
      popUpDetailsPassWord: []
    });
  }

  // afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   this.subtitle.style.color = '#f00';
  // }

  productPage = () => {
    this.props.history.goBack();
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  loadMore = (name) => {
    switch (name) {
      case "sell":
        this.setState(prev => {
          return { sellingVisible: prev.sellingVisible + 10 };
        });
        break;
      case "sold":
        this.setState((prev) => {
          return { soldVisible: prev.soldVisible + 10 };
        });
        break;
      case "fav":
        this.setState((prev) => {
          return { favVisible: prev.favVisible + 10 };
        });
        break;
      case "review":
        this.setState((prev) => {
          return { reviewVisible: prev.reviewVisible + 10 };
        });
        break;
      default:
        break;
    }
  };

  handleData = (editData) => {
    if (editData !== undefined) {
      let profileEditData = editData;
      delete profileEditData.password;
      delete profileEditData.newPassword;
      delete profileEditData.oldPassword;
      this.setState({
        profileEditData: profileEditData
      });
    }
  };

  // onStarClick(nextValue, prevValue, name) {
  //   this.setState({ rating: nextValue });
  // }

  handleUserRating = (reviewData) => {
    this.setState({
      ratings: reviewData.ratings,
      feedBack: reviewData.feedBack,
      comment: reviewData.comment
    });
    this.props.getReview
      .refetch({ userId: reviewData.userFrom })
      .then(({ data }) => {
        if (data) {
          const pButton = data.getReview.feedBack.primaryLevel;
          const sButton = data.getReview.feedBack.secondaryLevel;
          this.setState({
            primaryButton: pButton,
            secondaryButton: sButton
          });
        }
      });
    this.setState({
      UserReviewPop: true,
      reviewExpInfo: reviewData
    });
  };

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue, changeRating: true });
  }

  reviewSubmit = (e, index, cbk, rate) => {
    this.setState({
      buttonResponse: cbk,
      ratingResponse: rate,
      activeItem: index,
      puplishReview: true
    });
  };

  handleUpdateReview = () => {
    this.setState({
      getFeedBack: true,
      UserReviewPop: false
    });
  };

  updateInputValue = (e) => {
    this.setState({
      feedBackTextResponse: e.target.value,
      inputValue: e.target.value
    });
  };

  updatedReview = (txt, rate, feedBack, userTo) => {
    var result = {
      ratings: rate,
      feedBack: txt,
      comment: feedBack,
      userTo
    };

    let sendVariables = { data: result };

    this.props
      .updateReview({
        variables: sendVariables
      })
      .then(async ({ data }) => {
        this.setState({
          getFeedBack: false,
          buttonResponse: [],
          ratingResponse: "",
          feedBackTextResponse: "",
          activeItem: "",
          rating: "",
          inputValue: "",
          changeRating: false,
          puplishReview: false
        });
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
              <div>{this.props.t("Productdetails._FeedbackAdded")}</div>
            </div>
          );

          this.setState({
            UserReviewPop: false
          });
        }
      })
      .catch((error) => {
        this.setState({
          getFeedBack: false,
          buttonResponse: [],
          ratingResponse: "",
          feedBackTextResponse: "",
          activeItem: "",
          rating: "",
          inputValue: ""
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
            <div>{this.props.t("Productdetails._ErrorAdding")}</div>
          </div>
        );
      });
  };

  render() {
    const { classes, match, history, t } = this.props;
    const id = match.params.id;
    const timestamp = Date.now();
    const {
      showScroll,
      email,
      userName,
      foundUser,
      ForSale,
      SoldOut,
      favourites,
      reviews,
      imagePreviewUrl,
      editData,
      newPassword,
      password,
      oldPassword,
      profileImage,
      HQimageError,
      errors,
      passwordError,
      popUpDetailsPassWord,
      profileEditData,
      rating
    } = this.state;
    const variables = id
      ? profileEditData
      : {
           email,
           userName,
           profileImage
        };
    const variables1 = id
      ? editData
      : {
            password,
            newPassword
        };
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = imagePreviewUrl;
    } else {
      $imagePreview = foundUser.profileImage;
    }

    const findTimeStamp = (d, t, lang) => {
      return dateAdd(d, t, lang);
    };

    return (
      <div id="content">
        <div>
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

                      const favUnique = data.getUserDetails.Favourites; 
                      return ( */}

                  <div>
                    <div className="googleadpr">
                      <img src={prgd1} className="img-fluid" />
                    </div>
                    <div className="wrappperclass">
                      <div className="float-left leftPart sellerreleftpart">
                        <div className="usRDea float-left resimgname">
                          <div className="editPr float-left profileimgsell">
                            <img src={foundUser.profileImage} />
                          </div>
                          <div className="editNme float-left sellenameres">
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

                        <p className="setting">
                          <span onClick={this.openModal}>
                            <i class="fa fa-cog" aria-hidden="true"></i>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="float-left rightPart">
                      <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        //onRequestClose={this.closeModal}
                        contentLabel="Example Modal"
                      >
                        <div className="rm-space">
                          <div className="modal-header">
                            <button
                              onClick={this.closeModal}
                              type="button"
                              class="close"
                              data-dismiss="modal"
                            >
                              &times;
                            </button>
                          </div>

                          <div className="modal-body">
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
                                      href="#nav-home1"
                                      role="tab"
                                      aria-controls="nav-home"
                                      aria-selected="true"
                                    >
                                      {t("Editprofile._Profile")}
                                    </a>
                                    <a
                                      className="nav-item nav-link"
                                      id="nav-profile-tab"
                                      data-toggle="tab"
                                      href="#nav-profile1"
                                      role="tab"
                                      aria-controls="nav-profile"
                                      aria-selected="false"
                                    >
                                      {t("Editprofile._Password")}
                                    </a>
                                  </div>
                                </nav>
                                <div
                                  className="tab-content overall-mg"
                                  id="nav-tabContent"
                                >
                                  <div
                                    className="tab-pane fade show active"
                                    id="nav-home1"
                                    role="tabpanel"
                                    aria-labelledby="nav-home-tab"
                                  >
                                    <div className="rtlrvw">
                                      <GridContainer>
                                        <GridItem xs={12} sm={12} md={12}>
                                          <Mutation
                                            mutation={id ? EDIT_USER : ""}
                                            variables={variables}
                                          >
                                            {(
                                              userAction,
                                              { data, loading, error }
                                            ) => {
                                              return (
                                                <form
                                                  onSubmit={(event) =>
                                                    this.handleSubmit(
                                                      event,
                                                      userAction,
                                                      history
                                                    )
                                                  }
                                                >
                                                  <GridContainer>
                                                    <div className="imageUpload">
                                                      <div className="jqNCys ">
                                                        <div
                                                          className="avatar"
                                                          style={{
                                                            backgroundImage: `url(${$imagePreview})`
                                                          }}
                                                        >
                                                          {" "}
                                                        </div>
                                                      </div>
                                                      <div className="kVtcKR ">
                                                        <span>
                                                          {t(
                                                            "Editprofile._TabPhoto"
                                                          )}
                                                        </span>
                                                        <span>
                                                          {" "}
                                                          {t(
                                                            "Editprofile._imagesPNG"
                                                          )}
                                                        </span>
                                                      </div>
                                                      <input
                                                        accept=".png, .jpg, .jpeg"
                                                        className="fileInput"
                                                        id="filetype"
                                                        type="file"
                                                        ref={this.fileInput}
                                                        onChange={(event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "profileImage"
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                    {HQimageError ? (
                                                      <small
                                                        style={{ color: "red" }}
                                                      >
                                                        {t(
                                                          "Editprofile._invalidImages"
                                                        )}
                                                      </small>
                                                    ) : (
                                                      ""
                                                    )}
                                                    <CustomInput
                                                      error={!!errors.userName}
                                                      success={
                                                        !!errors.userName
                                                      }
                                                      helpText={errors.userName}
                                                      labelText={t(
                                                        "Editprofile._FullName"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment
                                                            position="start"
                                                            className={
                                                              classes.inputAdornmentIcon +
                                                              " " +
                                                              "sdasdasd"
                                                            }
                                                          >
                                                            <Face
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            />
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "userName"
                                                          ),

                                                        autoComplete: "off",
                                                        value: userName
                                                      }}
                                                    />

                                                    <CustomInput
                                                      error={!!errors.email}
                                                      success={!!errors.email}
                                                      helpText={errors.email}
                                                      labelText={t(
                                                        "Editprofile._Email"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment
                                                            position="start"
                                                            className={
                                                              classes.inputAdornmentIcon +
                                                              " " +
                                                              "sdasdasd"
                                                            }
                                                          >
                                                            <Email
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Email>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "email"
                                                          ),
                                                        autoComplete: "email",
                                                        value: email
                                                      }}
                                                    />
                                                  </GridContainer>

                                                  <div className="sav_chang">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-danger btn-block"
                                                      onClick={e =>
                                                        this.handleData(
                                                          editData
                                                        )
                                                      }
                                                    >
                                                      {t(
                                                        "Editprofile._SaveChanges"
                                                      )}
                                                    </button>
                                                  </div>
                                                  <div className="log_out">
                                                    <span
                                                      className="curpnt"
                                                      data-dismiss="modal"
                                                      onClick={e =>
                                                        this.redirect(e)
                                                      }
                                                    >
                                                      {" "}
                                                      {t("Editprofile._Logout")}
                                                    </span>
                                                  </div>
                                                </form>
                                              );
                                            }}
                                          </Mutation>
                                        </GridItem>
                                      </GridContainer>
                                    </div>
                                  </div>
                                  <div
                                    className="tab-pane fade"
                                    id="nav-profile1"
                                    role="tabpanel"
                                    aria-labelledby="nav-profile-tab"
                                  >
                                    <div className="rtlrvw passwordtab">
                                      <GridContainer>
                                        <GridItem xs={12} sm={12} md={12}>
                                          <Mutation
                                            mutation={id ? EDIT_USER : ""}
                                            variables={variables1}
                                          >
                                            {(
                                              userAction,
                                              { data, loading, error }
                                            ) => {
                                              return (
                                                <form
                                                  onSubmit={(event) =>
                                                    this.onSubmit(
                                                      event,
                                                      userAction,
                                                      history
                                                    )
                                                  }
                                                >
                                                  <GridContainer>
                                                    {/* { popUpDetailsPassWord.length ? <small style={{ color: "red" }}>{popUpDetailsPassWord[0]}</small> : ""} */}
                                                    <CustomInput
                                                      error={
                                                        passwordError.oldPassword ||
                                                        popUpDetailsPassWord[0] ===
                                                          "Invalid password"
                                                      }
                                                      success={
                                                        !!errors.password
                                                      }
                                                      helpText={` ${
                                                        passwordError.oldPassword
                                                      } ${
                                                        popUpDetailsPassWord[0] ===
                                                        "Invalid password"
                                                          ? "Current password is Wrong"
                                                          : ""
                                                      }`}
                                                      labelText={t(
                                                        "Editprofile._Currentpassword"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Icon
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Icon>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "oldPassword"
                                                          ),
                                                        onKeyDown: event =>
                                                          this.preventSpace(
                                                            event
                                                          ),
                                                        type: "password",
                                                        autoComplete: "off",
                                                        value: oldPassword
                                                      }}
                                                    />
                                                    {/* {id ?<FormHelperText>
                                                  please fill your current Password for verification
                                                         </FormHelperText> : ''} */}

                                                    <CustomInput
                                                      error={
                                                        passwordError.newPassword
                                                      }
                                                      helpText={
                                                        passwordError.newPassword
                                                      }
                                                      labelText={t(
                                                        "Editprofile._Newpassword"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Icon
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Icon>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "newPassword"
                                                          ),
                                                        onKeyDown: (event) =>
                                                          this.preventSpace(
                                                            event
                                                          ),
                                                        type: "password",
                                                        autoComplete: "off",
                                                        value: newPassword
                                                      }}
                                                    />

                                                    <CustomInput
                                                      error={
                                                        passwordError.password
                                                      }
                                                      helpText={
                                                        passwordError.password
                                                      }
                                                      labelText={t(
                                                        "Editprofile._Confirmpassword"
                                                      )}
                                                      formControlProps={{
                                                        fullWidth: true
                                                      }}
                                                      inputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <Icon
                                                              className={
                                                                classes.inputAdornmentIcon
                                                              }
                                                            >
                                                              lock_outline
                                                            </Icon>
                                                          </InputAdornment>
                                                        ),

                                                        onChange: (event) =>
                                                          this.change(
                                                            id,
                                                            event,
                                                            "password"
                                                          ),
                                                        onKeyDown: (event) =>
                                                          this.preventSpace(
                                                            event
                                                          ),
                                                        type: "password",
                                                        autoComplete: "off",
                                                        value: password
                                                      }}
                                                    />
                                                  </GridContainer>

                                                  <div class="sav_chang">
                                                    <button
                                                      type="submit"
                                                      class="btn btn-danger btn-block"
                                                      // onClick={
                                                      //   this.passwordValidate
                                                      // }
                                                    >
                                                      {t(
                                                        "Editprofile._SaveChanges"
                                                      )}
                                                    </button>
                                                  </div>
                                                  <div class="log_out">
                                                    <span
                                                      className="curpnt"
                                                      data-dismiss="modal"
                                                      onClick={e =>
                                                        this.redirect(e)
                                                      }
                                                    >
                                                      {" "}
                                                      {t("Editprofile._Logout")}
                                                    </span>
                                                  </div>
                                                </form>
                                              );
                                            }}
                                          </Mutation>
                                        </GridItem>
                                      </GridContainer>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>

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
                                id="nav-about-tab"
                                data-toggle="tab"
                                href="#nav-about"
                                role="tab"
                                aria-controls="nav-about"
                                aria-selected="false"
                              >
                                {t("Sellerdetails._Favorites")}
                              </a>

                              <a
                                className="nav-item nav-link"
                                id="nav-about-tab"
                                data-toggle="tab"
                                href="#nav-review"
                                role="tab"
                                aria-controls="nav-about"
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
                                            this.state.sellingVisible
                                          ).map((item) => (
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
                                    {this.state.sellingVisible <
                                      ForSale.length && (
                                      <button
                                        onClick={() => this.loadMore("sell")}
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
                                            this.state.soldVisible
                                          ).map((item) => (
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
                                    {this.state.soldVisible <
                                      SoldOut.length && (
                                      <button
                                        onClick={() => this.loadMore("sold")}
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
                              id="nav-about"
                              role="tabpanel"
                              aria-labelledby="nav-about-tab"
                            >
                              <div className="product-list">
                                <div>
                                  <div className={classes.NqLdW}>
                                    <div className={classes.lotuhp}>
                                      <div
                                        className={classes.NqLdW + " leftalsee"}
                                      >
                                        {favourites != null &&
                                        favourites.length < 1 ? (
                                          <div className="nolis">
                                            {" "}
                                            {t("Editprofile._NOLISTINGS")}
                                          </div>
                                        ) : (
                                          favourites
                                            .slice(0, this.state.favVisible)
                                            .map((item) => (
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
                                                            item.featured !=
                                                            null
                                                              ? "bgcolor"
                                                              : "nobrpayment"
                                                          }
                                                        >
                                                          <Link
                                                            to={`/products/${item.id}/`}
                                                          >
                                                            <div
                                                              className={
                                                                "inner"
                                                              }
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
                                                              className={
                                                                "footer"
                                                              }
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
                                    {this.state.favVisible <
                                      favourites.length && (
                                      <button
                                        onClick={() => this.loadMore("fav")}
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
                                      .map((item) => (
                                        <div className="reusewraye ">
                                          <div className="border-bottomline">
                                            {/* <Link to={`/SellerDetails/${item.userFrom}`} > */}
                                            <div className="wholereviewwr rvwrtl">
                                              <img src={item.imageUrl} />
                                            </div>

                                            <div className="leftimgrev rvwrtl">
                                              <h6> {item.fromName}</h6>
                                              <div className="desrev editprf">
                                                {/* <StarRatingComponent
                                                  name="rate1"
                                                  starCount={5}
                                                  value={item.ratings}
                                                 // direction = rtl
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

                                                {/* <p><span className="highrwbf"> {item.toName} sold Something</span></p> */}

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
                                            <div className="reporreve rvwrtl">
                                              <button
                                                type="button"
                                                class="btn dropdown-toggle"
                                                data-toggle="dropdown"
                                              >
                                                <span>
                                                  <svg
                                                    viewBox="0 0 24 24"
                                                    width="24"
                                                    height="24"
                                                    class="sc-jTzLTM fznnpf"
                                                  >
                                                    <path d="M11.785 17.139c1.375 0 2.5 1.125 2.5 2.5s-1.125 2.5-2.5 2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5zm0-2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5zm0-7.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5z"></path>
                                                  </svg>{" "}
                                                </span>
                                              </button>

                                              <div
                                                class="dropdown-menu"
                                                onClick={() =>
                                                  this.handleUserRating(item)
                                                }
                                              >
                                                {t("Editprofile._ReviewUser")}
                                              </div>
                                            </div>
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
                              <div>
                                {this.state.UserReviewPop && (
                                  <Modal
                                    isOpen={this.state.UserReviewPop}
                                    contentLabel="Minimal Modal Example"
                                    style={customStylesReview}
                                  >
                                    <section className="iHQQug">
                                      <>
                                        {this.state.reviewExpInfo && (
                                          <div className="ratingpageki">
                                            <button
                                              type="button"
                                              onClick={
                                                this.editreviewClosemodal
                                              }
                                              class=" float-left location-close ltn"
                                              data-dismiss="modal"
                                            >
                                              {" "}
                                              <span class="clsbtn"> × </span>
                                            </button>
                                            <div className="ratingprofile">
                                              <img
                                                src={
                                                  this.state.reviewExpInfo
                                                    .imageUrl
                                                }
                                              />
                                            </div>
                                            <div className="profilerayingname">
                                              {" "}
                                              {
                                                this.state.reviewExpInfo
                                                  .fromName
                                              }
                                            </div>
                                            <div className="ratingdescription">
                                              <p>
                                                {" "}
                                                {t(
                                                  "Editprofile._experiencewith"
                                                )}{" "}
                                                {
                                                  this.state.reviewExpInfo
                                                    .fromName
                                                }{" "}
                                                {t("Editprofile._fivestars")}
                                              </p>
                                              <StarRatingComponent
                                              name="app6"
                                              //starColor="#ffb400"
                                              // emptyStarColor="#ffb400"
                                              value={rating}
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
                                            </div>
                                            {/* <StarRatingComponent
                                              name="rate1"
                                              starCount={5}
                                              value={rating}
                                              onStarClick={this.onStarClick.bind(
                                                this
                                              )}
                                            /> */}
                                            <div className="slaectvalue">
                                              {/* <h6>Select at least one</h6> */}
                                            </div>
                                            <div
                                              className={
                                                this.state.changeRating === true
                                                  ? "beforedisabled"
                                                  : "afterdisbaled"
                                              }
                                            >
                                              <div className="massgeratingvaluee">
                                                <div className="inlienbtnvalue">
                                                  {/* <button className="iDhWYa active" > {feedBack}</button> */}
                                                </div>
                                                {this.state.rating <= 2
                                                  ? this.state
                                                      .secondaryButton &&
                                                    this.state.secondaryButton.map(
                                                      (cbk, index) => (
                                                        <div
                                                          key={index}
                                                          className="inlienbtnvalue"
                                                        >
                                                          <button
                                                            //className={cbk === feedBack[0] ? 'active iDhWYa' : 'iDhWYa' }
                                                            className={
                                                              this.state
                                                                .activeItem ===
                                                              index
                                                                ? "active iDhWYa"
                                                                : "iDhWYa"
                                                            }
                                                            onClick={e =>
                                                              this.reviewSubmit(
                                                                e,
                                                                index,
                                                                cbk,
                                                                this.state
                                                                  .rating
                                                              )
                                                            }
                                                          >
                                                            {cbk}
                                                          </button>
                                                        </div>
                                                      )
                                                    )
                                                  : this.state.primaryButton &&
                                                    this.state.primaryButton.map(
                                                      (cbk, index) => (
                                                        <div
                                                          key={index}
                                                          className="inlienbtnvalue"
                                                        >
                                                          <button
                                                            // className={cbk === feedBack[0]  ? 'active iDhWYa ' : 'iDhWYa' }
                                                            className={
                                                              this.state
                                                                .activeItem ===
                                                              index
                                                                ? "active iDhWYa secondarybtn"
                                                                : "iDhWYa secondarybtn"
                                                            }
                                                            onClick={e =>
                                                              this.reviewSubmit(
                                                                e,
                                                                index,
                                                                cbk,
                                                                this.state
                                                                  .rating
                                                              )
                                                            }
                                                          >
                                                            {cbk}
                                                          </button>
                                                        </div>
                                                      )
                                                    )}
                                              </div>

                                              <div className="textareafiled">
                                                <TextField
                                                  id="standard-bare"
                                                  multiline
                                                  rows="3"
                                                  fullWidth
                                                  placeholder={t(
                                                    "Editprofile._Writeexperience"
                                                  )}
                                                  className={classes.textField}
                                                  defaultValue={
                                                    this.state.inputValue
                                                  }
                                                  margin="normal"
                                                  inputProps={{
                                                    onChange: (e) =>
                                                      this.updateInputValue(e)
                                                  }}
                                                />
                                              </div>
                                            </div>
                                            <div
                                              className={
                                                this.state.puplishReview ===
                                                true
                                                  ? "beforedisabled"
                                                  : "afterdisbaled"
                                              }
                                            >
                                              <div className="sav_chang">
                                                <button
                                                  className="btn btn-danger btn-block"
                                                  onClick={() =>
                                                    this.updatedReview(
                                                      this.state.buttonResponse,
                                                      this.state.ratingResponse,
                                                      this.state
                                                        .feedBackTextResponse,
                                                      this.state.reviewExpInfo
                                                        .userFrom
                                                    )
                                                  }
                                                >
                                                  {t(
                                                    "Editprofile._PublishReview"
                                                  )}
                                                </button>
                                              </div>
                                            </div>

                                            {/* <div className="sav_chang">
                                        <button className="btn btn-danger btn-block" onClick={()=>this.handleUpdateReview()}>Publish Review</button>
                                       
                                        </div> */}
                                            {/* <h6 className="upadteyoureview">
                                              You can update review whenever you
                                              want
                                            </h6> */}
                                          </div>
                                        )}
                                      </>
                                    </section>
                                  </Modal>
                                )}
                                {/* {
                        this.state.getFeedBack && 
                        <Modal
                        isOpen={this.state.getFeedBack}
                        contentLabel="Minimal Modal Example"
                        style={customStylesReview}
                        >

                        <section className="iHQQug">
                        <>
                      
                            {
                            this.state.reviewExpInfo && 
                            <div className="ratingpageki">
                                 <div className="ratingprofile">
                                           <img src={this.state.reviewExpInfo.imageUrl} />
                                      </div>
                                      <div className="profilerayingname"> {this.state.reviewExpInfo.fromName
                                  }</div>
                                      <div  className="ratingdescription"><p> Does your experience with {this.state.reviewExpInfo.fromName } get five stars ? Tell us how it went </p></div>

                                <div className="textareafiled">
                            

                  <TextField
                          id="standard-bare"
                          multiline
                          rows="3"
                          fullWidth
                          placeholder="Write about your experience(optional)"
                          className={classes.textField}
                          defaultValue={this.state.inputValue}
                          margin="normal"
                          inputProps={{
                            onChange: e =>
                              this.updateInputValue(e)
                          }}
                        />

                           </div>
                           <div className="sav_chang">
                               <button className="btn btn-danger btn-block"  onClick={()=>this.updatedReview(this.state.buttonResponse,this.state.ratingResponse,this.state.feedBackTextResponse,
                                this.state.reviewExpInfo.userFrom)}>Update comment</button> 
                                </div> 
                            </div>
                          
                             }
                         
                         </>
                
                            </section>
                        </Modal>

                         }  */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* );
                     }}
                  </Query>  */}
                </div>
              </div>
            </div>
          </div>

          <div className="modal" id="editprofile"></div>
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
    );
  }
}

var userAction = compose(
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(GET_USER, { name: "getUser" }),
  graphql(EDIT_USER, { name: "editUser" }),
  graphql(LOG_OUT, { name: "logOut" }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(GET_REVIEW, { name: "getReview" }),
  graphql(UPDATE_REVIEW, { name: "updateReview" })
)(EditProfile);

export default withTranslation("common")(withStyles(styles)(userAction));