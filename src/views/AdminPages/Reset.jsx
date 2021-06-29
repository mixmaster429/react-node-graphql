import React from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Snackbar from "../../components/Snackbar/Snackbar.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import {
  RESET_PASSWORD,
  UPDATE_TOGGLE_STATUS,
  GET_CURRENT_USER
} from "../../queries";

import Header from "../UserPages/Header/index.jsx";
import * as Toastr from "../UserPages/Toast.jsx";
import Footer from "../UserPages/Footer/Footer.jsx";
import { ProductConsumer } from ".././UserPages/ProductContext.js";

import { withTranslation } from "react-i18next";
// style component
import loginPageStyle from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

const initialState = {
  cardAnimaton: "cardHidden",
  userName: "",
  password: "",
  errors: {
    userName: "",
    password: ""
  },
  graphqlError: [],
  popUpDetails: []
};

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      ...initialState
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  handleChange(event) {
    const name = event.target.id;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  validateInput() {
    let { password, confirmPassword } = this.state;
    let error = {},
      flag = false;
    if (!password || (!!password && !password.trim().length)){
      error["password"] = this.props.t("login._passwordrequired");
    }
    else if (!confirmPassword ||(!!confirmPassword && !confirmPassword.trim().length)){
      error["confirmPassword"] = this.props.t("login._confirmrequired");
    }
    else{
      error = {};
    } 

    this.setState({
      errors: error
    });
    flag = Object.keys(error).length
      ? Object.keys(error).find(obj => !!error[obj])
      : false;
    return flag;
  }

  clearState() {
    this.setState({ ...initialState });
  }

  handleSubmit(event) {
    let { resetPassword } = this.props;
    event.preventDefault();
    let { password, confirmPassword } = this.state;
    let { match } = this.props;
    let token = match.params.id;
    //var input = {password, confirmPassword, token};
    //token = token.replace(/:/g, "");

    if (!this.validateInput()) {
      resetPassword({
        variables: {
          input: {
            password,
            confirmPassword,
            token
          }
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
                <div>{data.resetPassword}</div>
              </div>
            );
            this.props.history.push("/");
          }
        })
        .catch((error) => {
          var message = error.graphQLErrors.map((x) => x.message);
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
          this.props.history.push("/");
        });
    }
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  componentWillMount() {
    let { currentUser } = this.props;
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
  }

  componentWillReceiveProps(nextProps) {
    let { currentUser } = nextProps;
    if (!currentUser.getCurrentUser){
      currentUser.refetch();
      this.setState({
        cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
      });
    } 
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }

  render() {
    const { classes, match, history, t } = this.props;
    const {
      confirmPassword,
      password,
      errors,
      popUpDetails,
      cUser
    } = this.state;
    return (
      <div>
        <ProductConsumer>
          {(value) => (
            <>
              <Header
                stuffImage={value.stuffImage}
                categorySubmitted={value.categorySubmitted}
                CategoryWithImage={value.CategoryWithImage}
                discardStuffStatus={value.discardStuff}
                discardYourStuff={value.discardYourStuff}
                manageBeforeLogin={value.stuffValue}
                refetchValue={value}
                setRef={this.setRef}
                postAnotherListing={value.postAnotherListing}
                contextConsumerInner={value}
                showValue={value.showValue}
                match={match}
                history={history}
                currentUser={cUser}
                postDone={value.postDone}
              />
            </>
          )}
        </ProductConsumer>
        <div className="restto">
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={6} md={4}>
                <Card login className={classes[this.state.cardAnimaton]}>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    color="rose"
                  >
                    <h2
                      className={classes.cardTitle}
                      style={{ fontSize: "15px", lineHeight: "30px" }}
                    >
                      <b>{t("login._Resetpassword")}</b>
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText={t("Editprofile._Password")}
                      id="password"
                      error={!!errors.password}
                      success={!!errors.password}
                      helpText={errors.password}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: password,
                        type: "password",
                        onChange: this.handleChange,
                        //autoComplete: "off",
                        autoComplete: "new-password"
                      }}
                    />

                    <CustomInput
                      labelText={t("Editprofile._Confirmpassword")}
                      id="confirmPassword"
                      error={!!errors.confirmPassword}
                      success={!!errors.confirmPassword}
                      helpText={errors.confirmPassword}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: confirmPassword,
                        type: "password",
                        onChange: this.handleChange,
                        autoComplete: "new-password"
                        //autoComplete: "off"
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.justifyContentCenter}>
                    {/* <Button type="submit" onClick={(e) => this.handleSubmit(e, resetPassword)} style={{color: "rgb(245, 91, 112)"}} simple size="lg" block>
                    <h3>Reset Password</h3>
                  </Button> */}

                    <Button
                      onClick={(e) => this.handleSubmit(e)}
                      type="submit"
                      simple
                      size="sm"
                    >
                      <span className="logbtnss">
                        {" "}
                        {t("Productdetails._Save")}{" "}
                      </span>
                    </Button>
                  </CardFooter>
                  {popUpDetails.length ? (
                    <Snackbar
                      place="tc"
                      color="rose"
                      message={popUpDetails[0]}
                      open={!!popUpDetails.length}
                      closeNotification={() => {
                        this.setState({ popUpDetails: [] });
                      }}
                      close
                    />
                  ) : (
                    ""
                  )}
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired
};

var reset = compose(
  graphql(RESET_PASSWORD, { name: "resetPassword" }),
  graphql(UPDATE_TOGGLE_STATUS, { name: "updateToggle" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" })
)(ResetPassword);

export default withTranslation("common")(
  withRouter(withStyles(loginPageStyle)(reset))
);
