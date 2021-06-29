import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { compose, graphql } from "react-apollo";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import { ADD_CONTACT } from "../../../queries";
import * as Toastr from "../Toast.jsx";
import { withTranslation } from "react-i18next";
// style component
import registerPageStyle from "../../../assets/jss/material-dashboard-pro-react/views/registerPageStyle.jsx";
import Footer from "../../UserPages/Footer/Footer.jsx";

const initialState = {
  id: "",
  name: "",
  email: "",
  feedback: "",
  timeStamp: "",
  popUpDetails: [],
  errors: {}
};

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  change(event, stateName) {
    this.setState({ [stateName]: event.target.value });
  }

  clearState() {
    this.setState({ ...initialState });
  }

  validateInputs() {
    var self = this;
    let required = ["name", "email", "feedback"];
    let error = {},
      flag = false;
    required.forEach(data => {
      let name = data === "name" ? this.props.t("contact_us._name") : data;
      if (!self.state[data] && !self.state[data].trim().length) {
        error[data] = `${
          data === "email"
            ? this.props.t("contact_us._email")
            : data === "feedback"
            ? this.props.t("contact_us._feedback")
            : this.props.t("contact_us._name")
        } ${this.props.t("contact_us._field")}`;
      } else {
        error[data] = "";
      }
      if (data === "email" && !!this.state.email) {
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRex.test(this.state.email)) {
          error.email = this.props.t("contact_us._emailValidation");
        } else {
          error.email = "";
        }
      }
      if (data === "feedback" && this.state.feedback) {
        if (!(this.state.feedback.trim().length >= 6)) {
          error.feedback = this.props.t("contact_us._feedbackValidation");
        } else {
          error.feedback = "";
        }
      }
    });
    this.setState({
      errors: error
    });
    flag = Object.keys(error).find(obj => {
      if (error[obj]) {
        return true;
      }
    });
    return flag;
  }

  submit(event) {
    event.preventDefault();
    let { name, email, feedback } = this.state;
    var variables = { name, email, feedback };
    if (!this.validateInputs()) {
      this.props
        .addContactUs({
          variables: variables
        })
        .then(async ({ data }) => {
          if (!!data.addContactUs) {
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
                <div>{this.props.t("Sellerdetails._messagesent")}</div>
              </div>
            );
          }
          this.clearState();
        })
        .catch(error => {
          this.setState({
            popUpDetails: error.graphQLErrors.map(x => x.message)
          });
        });
    }
  }
  render() {
    const { classes, t } = this.props;
    const { email, name, feedback, popUpDetails, errors } = this.state;
    return (
      <div>
        <div className="contactsdee">
          <div className={classes.container}>
            <div className="conactvw">
              <div className="contheadve">
                <h4 className="contstitle">{t("ContactUs._ContactUs")}</h4>
                <p class="message conts">{t("ContactUs._yourrequest")}.</p>
              </div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CardBody>
                    <GridContainer>
                      <span className="colorlgbn">
                        {" "}
                        {t("ContactUs._Name")}
                        <span class="validatcolor">*</span>{" "}
                      </span>
                      <GridItem xs={12} sm={12}>
                        <CustomInput
                          id="name"
                          error={!!errors["name"]}
                          success={!!errors["name"]}
                          helpText={errors["name"]}
                          formControlProps={{
                            fullWidth: true
                          }}
                          // style={{border:"1px solid #ccc"}}
                          inputProps={{
                            onChange: event => this.change(event, "name"),
                            type: "text",
                            value: name,
                            autoComplete: "off"
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <span className="colorlgbn">
                        {" "}
                        {t("ContactUs._EmailAddress")}{" "}
                        <span class="validatcolor">*</span>
                      </span>
                      <GridItem xs={12} sm={12}>
                        <CustomInput
                          role="form"
                          id="email"
                          error={!!errors["email"]}
                          success={!!errors["email"]}
                          helpText={errors["email"]}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.change(event, "email"),
                            type: "text",
                            value: email,
                            autoComplete: "off"
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <span className="colorlgbn">
                        {" "}
                        {t("ContactUs._FeedBack")}
                        <span class="validatcolor">*</span>{" "}
                      </span>

                      <GridItem xs={12} sm={12}>
                        <CustomInput
                          role="form"
                          id="feedback"
                          error={!!errors["feedback"]}
                          success={!!errors["feedback"]}
                          helpText={errors["feedback"]}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.change(event, "feedback"),
                            type: "text",
                            value: feedback,
                            autoComplete: "off"
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12}>
                        <div className="sav_chang contsave">
                          <Button
                            onClick={this.submit}
                            className="btn btn-danger btn-block"
                          >
                            {t("ContactUs._SUBMIT")}
                          </Button>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardBody>

                  {popUpDetails.length ? (
                    <div>
                      <Snackbar
                        place="bc"
                        color="rose"
                        message={popUpDetails[0]}
                        open={!!popUpDetails.length}
                        closeNotification={() => {
                          this.clearState();
                        }}
                        close
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {/* )}}
            </Mutation> */}
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <div className="newcontacrf">
          <Footer />
        </div>
      </div>
    );
  }
}

var ContactInfo = compose(graphql(ADD_CONTACT, { name: "addContactUs" }))(
  RegisterPage
);

RegisterPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTranslation("common")(
  withStyles(registerPageStyle)(ContactInfo)
);