import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Close from "@material-ui/icons/Close";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import Icon from "@material-ui/core/Icon";
import CardBody from "../../../components/Card/CardBody.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import { compose, graphql } from "react-apollo";
import {
  SIGNIN,
  SIGNUP,
  SOCIAL_LOGIN,
  FORGOT_PASSWORD,
  GET_SITE_INFO,
  REDIRECT_HOME,
  GET_ROSTER,
  REDIRECT_HOME_FILTER,
  GET_REDIRECTFILTER_STATE
} from "../../../queries";
import facebook from "../../../assets/img/facebook.png";
import google from "../../../assets/img/google.png";
import apple from "../../../assets/img/apple1.png";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import AppleLogin from "react-apple-login";
import { withTranslation } from "react-i18next";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { error } from "../Toast.jsx";
import * as Toastr from "../Toast.jsx";

//eslint-disable-next-line
const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const {
  REACT_APP_User_Login,
  REACT_APP_User_Password,
  REACT_APP_ENV,
  REACT_APP_Domain_Url
} = process.env;

const initialState = {
  login: false,
  signUpOrIn: false,
  isLoggedIn: false,
  forgot: false,
  signUp: false,
  email: "",
  password: "",
  userName: "",
  location: {},
  errors: {},
  userID: "",
  popUpDetails: [],
  isButtonDisabled: true,
  image: "",
  emailPopup: false,
  modelState: false,
  finalObject:{}
};

const customStyles2 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "210px"
  }
};

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }
  clearState() {
    this.setState({ ...initialState });
  }
  closePopup = e => {
    if (e.key === "Escape") {
      this.props.onClick(false);
    }
  };
  componentDidMount() {
    document.addEventListener("keydown", this.closePopup);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.closePopup);
  }
  validateInput(type) {
    let self = this;
    let required;
    switch (type) {
      case "signin":
        required = ["email", "password"];
        break;

      case "signup":
        required = ["email", "password", "userName"];
        break;
      case "forgotPassword":
        required = ["email"];
        break;
      default:
        break;
    }
    let error = {},
      flag = false;
    required.forEach(data => {
      let name =
        data === "userName" ? this.props.t("Editprofile._userName") : data;
      if (!self.state[data] && !self.state[data].length) {
        error[data] = `${this.props.t("login._Pleaseentervalid")} ${
          data === "email"
            ? this.props.t("Editprofile._email")
            : data === "password"
            ? this.props.t("Editprofile._Password")
            : this.props.t("Editprofile._userName")
        }`;
      } else if (data === "email" && !REGEX.test(self.state[data])) {
        error["email"] = this.props.t("login._Invalidemail");
      } else if (data === "password" && self.state[data].length < 4) {
        error["password"] = this.props.t("login._minimum4letters");
      } else {
        error[data] = "";
      }
    });
    this.setState({
      errors: error
    });
    flag = Object.keys(error).find(obj => {
      if (error[obj]) return true;
      return false;
    });
    return flag;
  }
  componentWillMount() {
    let { siteInfo } = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let { name, image, loginImage,appleClientId } = siteInfo.getSiteInfo;
      this.setState({
        sitename: name,
        image: image,
        loginImage: loginImage,
        appleClientId
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let { name, image,loginImage,appleClientId } = nextProps.siteInfo.getSiteInfo;
      this.setState({
        sitename: name,
        image: image,
        loginImage: loginImage,
        appleClientId
      });
    }
  }

  handleSubmit(type) {
    //event.preventDefault();
    let { signIn, signUp, forgotPassword } = this.props;
    let { email, password, userName } = this.state;
    if (!this.validateInput(type)) {
      switch (type) {
        case "signin":
          signIn({
            variables: {
              email: email.toLowerCase(),
              password: password
            },
            refetchQueries: [
              { query: GET_ROSTER, variables: { type: "All" } }
          ]
          })
            .then(async ({ data, error }) => {
              //console.log(data);
              if (!!data) {
                this.props.onClick(false, true);
                this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({
                // message: "Invalid credientials"
                popUpDetails: error.graphQLErrors.map(x => x.message)
              });
              this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
            });
          break;
        case "signup":
          signUp({
            variables: {
              data: {
                email: email.toLowerCase(),
                password: password,
                userName: userName
              }
            },
            refetchQueries: [
              { query: GET_ROSTER, variables: { type: "All" } }
            ]
          })
            .then(async ({ data }) => {
              if (!!data) {
                this.props.onClick(false, true);
                this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
              }
            })
            .catch(error => {
              console.log(error);
              this.setState({
                //graphqlError: error.graphQLErrors.map(x => x.message)
                popUpDetails: error.graphQLErrors.map(x => x.message)
              });
              this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
            });
          break;
        case "forgotPassword":
          forgotPassword({
            variables: {
              email: email.toLowerCase()
            }
          })
            .then(async ({ data }) => {
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
                    <div>
                      {this.props.t("login._sentanemail")} {email}.{" "}
                      {this.props.t("login._Clickthelink")}
                    </div>
                  </div>
                );

                this.props.onClick(false, true);
              }
            })
            .catch(error => {
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
                  <div> {this.props.t("login._Erroroccured")}</div>
                </div>
              );
            });
          break;
        default:
          break;
      }
    }
  }

  handleChange(event) {
    let { id, value } = event.target;
    //eslint-disable-next-line
    const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.email) {
      let validateemail = REGEX.test(this.state.email);
      if (validateemail) {
        this.setState({ isButtonDisabled: false });
      } else {
        this.setState({ isButtonDisabled: true });
      }
    }
    this.setState({
      [id]: value
    });
  }

  responseGoogle = response => {
    // if (response.error) {
    //     Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{ fill: "red" }}><path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path></svg></div><div>Something Went Wrong.Please Wait some Time and Try again later.</div></div>)
    //   this.props.onClick(false, true);
    // }
    if (response.profileObj.googleId) {
      let { socialLogin } = this.props;
      let type = "socialLogin";
      if (type) {
        socialLogin({
          variables: {
            data: {
              email: response.profileObj.email,
              userName: response.profileObj.name,
              googleId: response.profileObj.googleId,
              profileImage: response.profileObj.imageUrl
            }
          },
          refetchQueries: [
            { query: GET_ROSTER, variables: { type: "All" } }
        ]
        })
          .then(async ({ data }) => {
            if (!!data) {
              //console.log("logged successfully");
              this.props.onClick(false, true);
              this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
            }
          })
          .catch(error => {
            var message = error.graphQLErrors.map(x => x.message);
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
                <div>{message}</div>
              </div>
            );
            this.props.onClick(false, true);
            this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
          });
      }
    }
  };

  viewPassword = e => {
    e.target.classList.toggle("showw");
    let a = document.getElementById("password");
    var b = a.getAttribute("type");
    b === "password"
      ? a.setAttribute("type", "text")
      : a.setAttribute("type", "password");
  };

  componentClicked = () => console.log("Got response");

  closeModel = () => {
    this.setState({
      emailPopup : false,
      modelState: false 
    });
  };

  updateEmailValue = evt => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let {errors} = this.state;
    if (!emailRex.test(evt.target.value)) {
      this.setState({
        isButtonDisabled: true
      })
      errors.popEmail = this.props.t("Editprofile._emailValid");
    }else{
      errors.popEmail = "";
      this.setState({
        isButtonDisabled: false,
        inputValue: evt.target.value
      })
    }
  };


  updateSocialLogin = (value) => {
      let { socialLogin } = this.props;
      let {finalObject} = this.state;
      let type = "socialLogin";
      if (type) {
        socialLogin({
          variables: {
            data: {
              email: value,
              userName: finalObject.userName,
              faceBookId: finalObject.faceBookId,
              profileImage: `https://graph.facebook.com/${finalObject.faceBookId}/picture`
            }
          },
          refetchQueries: [
            { query: GET_ROSTER, variables: { type: "All" } }
          ]
        }).then(async ({ data }) => {
            this.props.onClick(false, true);
            this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
          }).catch(error => {
            console.log(error)
            var message = error.graphQLErrors.map(x => x.message);
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
                <div>{message}</div>
              </div>
            );
            this.props.onClick(false, true);
            this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
          });  
      }
  }
  responseFacebook = response => {
    if (response.userID) {
      let { socialLogin } = this.props;
      let type = "socialLogin";
      if (type) {
        socialLogin({
          variables: {
            data: {
              email: response.email,
              userName: response.name,
              faceBookId: response.userID,
              profileImage: `https://graph.facebook.com/${response.userID}/picture`
            }
          },
          refetchQueries: [
            { query: GET_ROSTER, variables: { type: "All" } }
          ]
        })
          .then(async ({ data }) => {
             if(data.socialLogin.noEmail === true){
               let userdata = {};
               userdata.userName = response.name;
               userdata.faceBookId = response.userID;
               userdata.profileImage = response.picture.data.url
                this.setState({
                  emailPopup : true,
                  modelState: true,
                  noEmail: data.socialLogin.noEmail,
                  finalObject: userdata
                })
             } else if (!!data) {
              this.props.onClick(false, true);
              this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
            }
          })
          .catch(error => {
            console.log(error)
            var message = error.graphQLErrors.map(x => x.message);
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
                <div>{message}</div>
              </div>
            );
            this.props.onClick(false, true);
            this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
          });
      }
    }
  };

  /*   responseFacebook = (response) => {
      console.log(response);
    }
  
    componentClicked = (data) => {
      console.log(data)
    }  */

  render() {
    let {
      login,
      signUp,
      signUpOrIn,
      errors,
      email,
      password,
      userName,
      loginImage,
      message,
      popUpDetails,
      sitename,
      appleClientId,
      isButtonDisabled,
      image
    } = this.state;
    let { classes, siteInfo, t } = this.props;
    let fbContent;
    let $imagePreview = loginImage;
    return (
      <>
        <Modal isOpen={true} contentLabel="Example Modal">
          <div className="loginPopup">
            {/* <div className="newdynamicimg">
                <img src={loginImage} className="img-fluid"  />
                </div> */}

            <div
              className="resnoban"
              style={{
                backgroundImage: `url(${$imagePreview})`,
                backgroundRepeat: "no-repeat",
                backgroundColor: "grey",
                backgroundSize: "cover",
                width: "45%"
              }}
            >
              <div className="close-Id">
                <Button
                  justIcon
                  round
                  simple
                  onClick={e => this.props.onClick(false)}
                  color="twitter"
                  className="edit"
                >
                  <Close />
                </Button>
              </div>
              <div>
                <div>
                  <div className="loginpo">
                    <h2 className="unlock-poup">
                      {t("login._unlockfeatures")}
                    </h2>
                    <div>
                      <div className="tJBQs">
                        {" "}
                        <div className="iconsvg">
                          {" "}
                          <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            class=" fznnpf"
                          >
                            <path d="M6.892 5.571A3.468 3.468 0 0 1 10.262 3h3.477a3.473 3.473 0 0 1 3.369 2.571h1.416c1.92 0 3.476 1.536 3.476 3.43v8.57C22 19.464 20.442 21 18.524 21H5.476C3.556 21 2 19.465 2 17.571v-8.57c0-1.893 1.558-3.43 3.476-3.43h1.416zm9.456 7.715C16.348 10.919 14.4 9 12 9s-4.348 1.919-4.348 4.286c0 2.367 1.947 4.285 4.348 4.285s4.348-1.918 4.348-4.285zm-6.957 0c0-1.42 1.168-2.572 2.609-2.572 1.44 0 2.609 1.152 2.609 2.572 0 1.42-1.168 2.571-2.609 2.571-1.44 0-2.609-1.151-2.609-2.571z"></path>
                          </svg>
                        </div>
                        <div className="langsel">
                          {t("login._Postlistings")}
                        </div>
                      </div>
                      <div className="tJBQs">
                        {" "}
                        <div className="iconsvg">
                          <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            class="sc-jTzLTM fznnpf"
                          >
                            <path d="M7.249 21.204v-1.902c0-.58-.47-1.05-1.05-1.05A4.2 4.2 0 0 1 2 14.053v-5.86A4.194 4.194 0 0 1 6.193 4h11.734a4.193 4.193 0 0 1 4.193 4.193v5.866a4.193 4.193 0 0 1-4.193 4.193h-5.013c-.444 0-.87.177-1.185.49l-3.05 3.048c-.525.526-1.424.158-1.43-.586zm.617-8.828a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm8.383 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm-4.191 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512z"></path>
                          </svg>
                        </div>
                        <div className="langsel">{t("login._Chatbuyers")}</div>
                      </div>
                      <div className="tJBQs">
                        {" "}
                        <div className="iconsvg">
                          {" "}
                          <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            class="sc-jTzLTM fznnpf"
                          >
                            <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                          </svg>
                        </div>
                        <div className="langsel">
                          {t("login._Savelistings")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {signUpOrIn ? (
              <div className="loginRight">
                <div className={classes.loginContent + " "}>
                  <CardBody>
                    <div>
                      <div>
                        {login ? (
                          <div>
                            <div className="dtgBrv">
                              <div
                                className="fvALSw"
                                onClick={() => {
                                  this.setState({
                                    signUpOrIn: false,
                                    login: false,
                                    email: "",
                                    password: "",
                                    errors: "",
                                    popUpDetails: ""
                                  });
                                }}
                              >
                                <span>
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    class="Authstyles__BackIconBlack-sc-1tlvt1v-8 hFnSvT sc-jTzLTM fznnpf"
                                  >
                                    <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z"></path>
                                  </svg>{" "}
                                </span>
                                <span className="diFwKh">
                                  {t("login.Login")}{" "}
                                </span>
                              </div>
                              <div className="fvALSw">
                                <span>
                                  {/* <Link onClick={() => this.props.onClick(false)} to="/pages/terms_of_use"> Help </Link> */}
                                </span>
                              </div>
                            </div>
                            <div className="noruse">
                              {" "}
                              {popUpDetails[0]}
                            </div>
                            <div className="textrightrtl">
                              <CustomInput
                                labelText={t("login._Email")}
                                id="email"
                                error={!!errors.email}
                                success={!!errors.email}
                                helpText={errors.email}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Email
                                        className={classes.inputAdornmentIcon}
                                      >
                                        lock_outline
                                      </Email>
                                    </InputAdornment>
                                  ),
                                  value: email,
                                  type: "email",
                                  onChange: this.handleChange,
                                  autoComplete: "email"
                                  //autoComplete: "off"
                                }}
                              />
                              <div className="pos_rel viewPsw">
                                <CustomInput
                                  labelText={t("login._Password")}
                                  id="password"
                                  error={!!errors.password}
                                  success={!!errors.password}
                                  helpText={errors.password}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Icon
                                          className={classes.inputAdornmentIcon}
                                        >
                                          lock_outline
                                        </Icon>
                                      </InputAdornment>
                                    ),
                                    value: password,
                                    type: "password",
                                    onChange: this.handleChange,
                                    autoComplete: "new-password"
                                    //autoComplete: "off"
                                  }}
                                />

                                <button onClick={e => this.viewPassword(e)}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                  >
                                    <path d="M12.186 8.106a3.733 3.733 0 0 1 3.727 3.728 3.733 3.733 0 0 1-3.727 3.728 3.733 3.733 0 0 1-3.727-3.728 3.733 3.733 0 0 1 3.727-3.728zm0 5.966a2.24 2.24 0 0 0 2.236-2.238 2.237 2.237 0 0 0-4.472 0 2.24 2.24 0 0 0 2.236 2.238zm9.67-2.802c-3.113-4.254-6.476-6.379-9.997-6.266-5.697.165-9.577 6.05-9.74 6.3a.752.752 0 0 0 .02.84c3.152 4.424 6.491 6.661 9.928 6.661.122 0 .244-.004.365-.009 5.645-.258 9.313-6.445 9.466-6.708a.75.75 0 0 0-.042-.818"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="logtn">
                              <Button
                                onClick={e => this.handleSubmit("signin")}
                                type="submit"
                                simple
                                size="sm"
                              >
                                <span className="logbtnss">
                                  {" "}
                                  {t("login.Login")}{" "}
                                </span>
                              </Button>

                              {error && <p> {error}</p>}
                              <Button
                                type="submit"
                                onClick={() => {
                                  this.setState({
                                    signUp: true,
                                    login: false,
                                    email: "",
                                    popUpDetails: "",
                                    errors: ""
                                  });
                                }}
                                style={{ color: "rgb(245, 91, 112)" }}
                                simple
                                size="sm"
                              >
                                {" "}
                                <span className="fogpg">
                                  {t("login._ForgotPassword")}
                                </span>
                              </Button>
                              <br />
                              <Button
                                type="submit"
                                onClick={() => {
                                  this.setState({
                                    login: false,
                                    signUpOrIn: true,
                                    signUp: false,
                                    popUpDetails: "",
                                    email: "",
                                    password: "",
                                    errors: ""
                                  });
                                }}
                                style={{ color: "rgb(245, 91, 112)" }}
                                simple
                                size="sm"
                              >
                                <span className="alredy">
                                  {t("login._DontAccount")}
                                </span>
                              </Button>
                            </div>
                          </div>
                        ) : signUp ? (
                          <div>
                            <div className="dtgBrv">
                              <div
                                className="fvALSw"
                                onClick={() => {
                                  this.setState({
                                    login: true,
                                    email: "",
                                    password: "",
                                    errors: "",
                                    popUpDetails: ""
                                  });
                                }}
                              >
                                <span>
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    class="Authstyles__BackIconBlack-sc-1tlvt1v-8 hFnSvT sc-jTzLTM fznnpf"
                                  >
                                    <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z"></path>
                                  </svg>{" "}
                                </span>
                                <span className="diFwKh">
                                  {t("login._Resetpassword")}{" "}
                                </span>
                              </div>
                              <div className="fvALSw">
                                <span>
                                  {/* <Link onClick={() => this.props.onClick(false)} to="/pages/terms_of_use"> Help </Link> */}
                                </span>
                              </div>
                            </div>

                            <div className="whbr">
                              <span className="restpss">
                                {" "}
                                {t("login._resetpassword")}
                              </span>
                              <div className="textrightrtl">
                                <CustomInput
                                  labelText={t("login._Email")}
                                  id="email"
                                  error={!!errors.email}
                                  success={!!errors.email}
                                  helpText={errors.email}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Email
                                          className={classes.inputAdornmentIcon}
                                        >
                                          lock_outline
                                        </Email>
                                      </InputAdornment>
                                    ),
                                    value: email,
                                    type: "email",
                                    onChange: this.handleChange,
                                    // autoComplete: "new-password"
                                    autoComplete: "off"
                                  }}
                                />{" "}
                              </div>
                              <div className="emsilsend">
                                <p> {message}</p>
                              </div>
                              <Button
                                disabled={this.state.isButtonDisabled}
                                type="submit"
                                simple
                                size="sm"
                                onClick={e =>
                                  this.handleSubmit("forgotPassword")
                                }
                              >
                                <span className="logbtnss">
                                  {" "}
                                  {t("login._SendEmail")}{" "}
                                </span>
                              </Button>
                            </div>
                          </div>
                        ) : !login ? (
                          <div>
                            <div className="dtgBrv">
                              <div
                                className="fvALSw"
                                onClick={() => {
                                  this.setState({
                                    signUpOrIn: false,
                                    login: false,
                                    email: "",
                                    password: "",
                                    userName: "",
                                    errors: "",
                                    popUpDetails: ""
                                  });
                                }}
                              >
                                <span>
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    class="Authstyles__BackIconBlack-sc-1tlvt1v-8 hFnSvT sc-jTzLTM fznnpf"
                                  >
                                    <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z"></path>
                                  </svg>{" "}
                                </span>
                                <span className="diFwKh">
                                  {t("login._newaccount")}
                                </span>
                              </div>
                              <div className="fvALSw">
                                <span>
                                  {/* <Link onClick={() => this.props.onClick(false)} to="/pages/terms_of_use"> Help </Link> */}
                                </span>
                              </div>
                            </div>

                            <div className="noruse"> {popUpDetails}</div>
                            <div className="textrightrtl">
                              <CustomInput
                                labelText={t("login._Email")}
                                id="email"
                                error={!!errors.email}
                                success={!!errors.email}
                                helpText={errors.email}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Email
                                        className={classes.inputAdornmentIcon}
                                      >
                                        lock_outline
                                      </Email>
                                    </InputAdornment>
                                  ),
                                  value: email,
                                  type: "email",
                                  onChange: this.handleChange,
                                  autoComplete: "new-password"
                                  //autoComplete: "off"
                                }}
                              />
                              <div className="pos_rel viewPsw">
                                <CustomInput
                                  labelText={t("login._Password")}
                                  id="password"
                                  error={!!errors.password}
                                  success={!!errors.password}
                                  helpText={errors.password}
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Icon
                                          className={classes.inputAdornmentIcon}
                                        >
                                          lock_outline
                                        </Icon>
                                      </InputAdornment>
                                    ),
                                    value: password,
                                    type: "password",
                                    onChange: this.handleChange,
                                    autoComplete: "new-password"
                                    //autoComplete: "off"
                                  }}
                                />
                                <button onClick={e => this.viewPassword(e)}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                  >
                                    <path d="M12.186 8.106a3.733 3.733 0 0 1 3.727 3.728 3.733 3.733 0 0 1-3.727 3.728 3.733 3.733 0 0 1-3.727-3.728 3.733 3.733 0 0 1 3.727-3.728zm0 5.966a2.24 2.24 0 0 0 2.236-2.238 2.237 2.237 0 0 0-4.472 0 2.24 2.24 0 0 0 2.236 2.238zm9.67-2.802c-3.113-4.254-6.476-6.379-9.997-6.266-5.697.165-9.577 6.05-9.74 6.3a.752.752 0 0 0 .02.84c3.152 4.424 6.491 6.661 9.928 6.661.122 0 .244-.004.365-.009 5.645-.258 9.313-6.445 9.466-6.708a.75.75 0 0 0-.042-.818"></path>
                                  </svg>
                                </button>
                              </div>

                              <CustomInput
                                labelText={t("login._FullName")}
                                id="userName"
                                error={!!errors.userName}
                                success={!!errors.userName}
                                helpText={errors.userName}
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Face
                                        className={classes.inputAdornmentIcon}
                                      />
                                    </InputAdornment>
                                  ),
                                  value: userName,
                                  onChange: this.handleChange,
                                  //autoComplete: "off",
                                  autoComplete: "new-password"
                                }}
                              />
                            </div>
                            <div align="center">
                              <Button
                                onClick={e => this.handleSubmit("signup")}
                                type="submit"
                                style={{
                                  color: "rgb(245, 91, 112)",
                                  padding: "0"
                                }}
                                simple
                                size="sm"
                              >
                                <span className="logbtnss">
                                  {t("login._SignUp")}
                                </span>
                              </Button>
                              <br />
                              <Button
                                type="submit"
                                onClick={() => {
                                  this.setState({
                                    login: true,
                                    popUpDetails: "",
                                    email:
                                      REACT_APP_ENV !== "package"
                                        ? REACT_APP_User_Login
                                        : "",
                                    password:
                                      REACT_APP_ENV !== "package"
                                        ? REACT_APP_User_Password
                                        : "",
                                    userName: "",
                                    errors: ""
                                  });
                                }}
                                style={{
                                  color: "rgb(245, 91, 112)",
                                  padding: "0"
                                }}
                                simple
                                size="sm"
                              >
                                <span className="alredy">
                                  {t("login._AlreadyAccount")}
                                </span>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </CardBody>
                </div>{" "}
              </div>
            ) : (
              <div className="loginRight">
                <div className={classes.loginContent + " "}>
                  <div className="dtgBrv">
                    <div className="fvALSw">
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        onClick={e => this.props.onClick(false)}
                        class="sc-kGXeez Pdhue"
                      >
                        <path
                          d="M12 9.988l3.822-3.822a1.423 1.423 0 0 1 2.011 2.011L14.012 12l3.821 3.822a1.42 1.42 0 0 1 0 2.011 1.42 1.42 0 0 1-2.011 0L12 14.011l-3.822 3.822a1.42 1.42 0 0 1-2.011 0 1.42 1.42 0 0 1 0-2.01L9.988 12 6.167 8.177a1.42 1.42 0 1 1 2.011-2.01L12 9.987z"
                          fill="rgb(255, 63, 85)"
                        ></path>
                      </svg>
                    </div>
                    <div className="fvALSws hghelp">
                      <span>
                        {/* <Link onClick={() => this.props.onClick(false)} to="/pages/terms_of_use"> Help </Link> */}
                      </span>
                    </div>
                  </div>

                  <div className="ove_all">
                    <div className={classes.textCenter + " " + "popupInfo"}>
                      <div className={classes.popupLogo}>
                        <img src={image} width="80px" height="40px" alt="" />
                      </div>

                      <h2 className="quickbuy">
                        {" "}
                        {t("login._Buyandsell")} {sitename}!
                      </h2>

                      <p className="faceissues">
                        {" "}
                        <b>{t("login._Note")} :</b> {t("login._FacebookSign")}.
                      </p>

                      <div className="loginfeate">
                        <div className="unlocklogin">
                          {" "}
                          {t("login._unlockfeatures")}{" "}
                        </div>

                        <div className="jHTwzI">
                          <div className="fGPScD">
                            <div className="kwtHbv">
                              <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                class="sc-jTzLTM fznnpf"
                              >
                                <path d="M6.892 5.571A3.468 3.468 0 0 1 10.262 3h3.477a3.473 3.473 0 0 1 3.369 2.571h1.416c1.92 0 3.476 1.536 3.476 3.43v8.57C22 19.464 20.442 21 18.524 21H5.476C3.556 21 2 19.465 2 17.571v-8.57c0-1.893 1.558-3.43 3.476-3.43h1.416zm9.456 7.715C16.348 10.919 14.4 9 12 9s-4.348 1.919-4.348 4.286c0 2.367 1.947 4.285 4.348 4.285s4.348-1.918 4.348-4.285zm-6.957 0c0-1.42 1.168-2.572 2.609-2.572 1.44 0 2.609 1.152 2.609 2.572 0 1.42-1.168 2.571-2.609 2.571-1.44 0-2.609-1.151-2.609-2.571z"></path>
                              </svg>
                            </div>
                            <span className="hHLSvC">
                              {" "}
                              {t("login._Postlistings")}{" "}
                            </span>
                          </div>
                          <div className="fGPScD">
                            <div className="kwtHbv">
                              <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                class="sc-jTzLTM fznnpf"
                              >
                                <path d="M7.249 21.204v-1.902c0-.58-.47-1.05-1.05-1.05A4.2 4.2 0 0 1 2 14.053v-5.86A4.194 4.194 0 0 1 6.193 4h11.734a4.193 4.193 0 0 1 4.193 4.193v5.866a4.193 4.193 0 0 1-4.193 4.193h-5.013c-.444 0-.87.177-1.185.49l-3.05 3.048c-.525.526-1.424.158-1.43-.586zm.617-8.828a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm8.383 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512zm-4.191 0a1.255 1.255 0 1 0 0-2.512 1.256 1.256 0 1 0 0 2.512z"></path>
                              </svg>
                            </div>
                            <span className="hHLSvC">
                              {" "}
                              {t("login._Chatbuyers")}{" "}
                            </span>
                          </div>

                          <div className="fGPScD">
                            <div className="kwtHbv">
                              <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                class="sc-jTzLTM fznnpf"
                              >
                                <path d="M16.224 5c-1.504 0-2.89.676-3.802 1.854L12 7.398l-.421-.544A4.772 4.772 0 0 0 7.776 5C5.143 5 3 7.106 3 9.695c0 5.282 6.47 11.125 9.011 11.125 2.542 0 8.99-5.445 8.99-11.125C21 7.105 18.857 5 16.223 5z"></path>
                              </svg>
                            </div>
                            <span className="hHLSvC">
                              {t("login._Savelistings")}{" "}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bGYxuY">
                        <h3 className={classes.continueWith + " " + classes.or}>
                          <span className="dash">
                            <span>{t("login._QUICKLYCONNECT")}</span>
                          </span>
                        </h3>
                      </div>
                      <ul className={classes.socialLogin}>
                        {this.state.isLoggedIn
                          ? (fbContent = null)
                          : (fbContent = (
                              <FacebookLogin
                                appId={siteInfo.getSiteInfo.facebookAppId}
                                fields="name,email,picture"
                                render={renderProps => (
                                  <li className="facebook">
                                    <a onClick={renderProps.onClick}>
                                      <img
                                        src={facebook}
                                        onClick={renderProps.onClick}
                                      />
                                      <span className="whclg">
                                        {t("login._ContinueFacebook")}
                                      </span>
                                    </a>
                                  </li>
                                )}
                                onClick={this.componentClicked}
                                callback={this.responseFacebook}
                              />
                            ))}

                        {/* <FacebookLogin
                            appId="406856446609936"
                           // autoLoad={true}
                            fields="name,email,picture"
                            onClick={this.componentClicked}
                            callback={this.responseFacebook} 
                          />  */}

                        <GoogleLogin
                          clientId={siteInfo.getSiteInfo.googleAppId}
                          render={renderProps => (
                            <li className="google">
                              <a onClick={renderProps.onClick}>
                                <img src={google} alt="" />
                                <span className="whclg">
                                  {t("login._ContinueGoogle")}
                                </span>
                              </a>
                            </li>
                          )}
                          onSuccess={this.responseGoogle}
                          onFailure={this.responseGoogle}
                          cookiePolicy={"single_host_origin"}
                        />
                       
                        <AppleLogin
                          clientId={appleClientId}
                          redirectURI={`${REACT_APP_Domain_Url}web/auth/callback`}
                          responseType={"code"}
                          responseMode={"form_post"}
                          scope={"name email"}
                           render={renderProps => (
                            <li className="cls_apple">
                              <a onClick={renderProps.onClick}>
                                <img src={apple} alt="" />
                                <span className="whclg">
                                  {t("login._ContinueApple")}
                                </span>
                              </a>
                            </li>
                          )}
                          designProp={{
                            height: 30,
                            width: 140,
                            color: "black",
                            border: false,
                            type: "sign-in",
                            border_radius: 50,
                            scale: 2,
                            locale: "en_US"
                          }}
                        /> 
                        
                        
                      </ul>
                      <div className="bGYxuY">
                        <h3 className={classes.continueWith + " " + classes.or}>
                          <span className="dash">
                            {" "}
                            <span> {t("login._USEYOUREMAIL")}</span>
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <ul
                  className={
                    classes.logLinks +
                    " " +
                    classes.textCenter +
                    " " +
                    classes.my3 +
                    " loginUl"
                  }
                >
                  <li>
                    <Button
                      type="submit"
                      onClick={() => {
                        this.setState({
                          login: false,
                          signUpOrIn: true,
                          signUp: false
                        });
                      }}
                      style={{ color: "rgb(245, 91, 112)" }}
                      simple
                      size="sm"
                    >
                      <span className="signuinbtn"> {t("login._SignUp")} </span>
                    </Button>
                  </li>
                  <li className="rtlborder">
                    <Button
                      type="submit"
                      onClick={() => {
                        this.setState({
                          login: true,
                          signUpOrIn: true,
                          email:
                            REACT_APP_ENV !== "package"
                              ? REACT_APP_User_Login
                              : "",
                          password:
                            REACT_APP_ENV !== "package"
                              ? REACT_APP_User_Password
                              : ""
                        });
                      }}
                      style={{ color: "rgb(245, 91, 112)" }}
                      simple
                      size="sm"
                    >
                      <span className="signuinbtn">{t("login.Login")}</span>
                    </Button>
                  </li>
                </ul>
                <div className={classes.loginBottomLinks}>
                  <p className="footer-trms">
                    {t("login._clickingon")} {sitename}
                    <strong>
                      <Link
                        onClick={() => this.props.onClick(false)}
                        to="/pages/terms_of_use"
                      >
                        {" "}
                        {t("footer._termsandConditions")}
                      </Link>
                    </strong>{" "}
                    {t("login._and")} <br />
                    <strong>
                      <Link
                        onClick={() => this.props.onClick(false)}
                        to="/pages/privacy_policy"
                      >
                        {t("footer._privacypolicy")}
                      </Link>
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal>
                  { this.state.modelState && (
                                <Modal
                                  isOpen={this.state.emailPopup}
                                  contentLabel="Minimal Modal Example"
                                  style={customStyles2}
                                >
                                
                                  {this.state.noEmail ? (
                                    <div className="botnbtn">
                                      <p><b>{t("Productdetails._getEmail")}</b></p>

                                      <Input
                                        defaultValue={this.state.inputValue}
                                        className={classes.popsp}
                                        fullWidth
                                        inputProps={{
                                          onChange: e =>
                                            this.updateEmailValue(e)
                                        }}
                                      />
                                    <FormHelperText error={errors.popEmail}>{errors.popEmail}</FormHelperText>
                                      <div className="brbtn">
                                        <button
                                          disabled={this.state.isButtonDisabled}
                                          type="button"
                                          className="reporlst"
                                          onClick={e =>
                                            this.updateSocialLogin(this.state.inputValue)
                                          }
                                        >
                                          {t("Productdetails._sub")}
                                        </button>
                                        <button
                                          type="button"
                                          className="reporcl"
                                          onClick={this.closeModel}
                                        >
                                          {" "}
                                          {t("Productdetails._Cancel")}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center thankmsg">
                                      <p>
                                        {t("Productdetails._listingreported")}
                                      </p>{" "}
                                    </div>
                                  )}
                                </Modal>
                              )
                            }
                     
      </>
    );
  }
}

LoginComponent.propTypes = {
  open: PropTypes.bool
};

var Login = compose(
  graphql(SIGNIN, { name: "signIn" }),
  graphql(SIGNUP, { name: "signUp" }),
  graphql(SOCIAL_LOGIN, { name: "socialLogin" }),
  graphql(FORGOT_PASSWORD, { name: "forgotPassword" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
      name: "pageCountFilter",
      options: () => ({
        fetchPolicy: 'cache-only'
      })
    }),
)(LoginComponent);

export default withTranslation("common")(withStyles(styles)(Login));