import React from "react";
import { compose, graphql } from "react-apollo";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
// material ui icons
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardText from "../../../components/Card/CardText.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardFooter from "../../../components/Card/CardFooter.jsx";
import CKEditor from "react-ckeditor-component";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { UPDATE_TOGGLE_STATUS, BULK_MAIL } from "../../../queries";
//eslint-disable-next-line
const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const styles = {
  ...validationFormsStyle,
  ...extendedFormsStyle,
  cardTitle: {
    ...validationFormsStyle.cardTitle,
    color: "white"
  }
};

const initialState = {
  emailAddress: "",
  subject: "",
  content: "",
  userType: ""
};

class AdminUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      editData: {},
      errors: {},
      popUpDetails: [],
      isButtonDisabled: false,
      selectedOption: "specificUser"
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.change = this.change.bind(this);
    //this.updateContent = this.updateContent.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  validateInputs(type) {
    var self = this;
    let required;

    switch (type) {
      case "all":
        required = ["subject", "content"];
        break;

      case "specificUser":
        required = ["emailAddress", "subject", "content"];
        break;

        default: break;
    }

    let error = {},
      flag = false;
    required.forEach((data) => {
      let name = data;
      if (!self.state[data] && !self.state[data].length) {
        error[data] = `Please enter  ${name}.`;
      } else if (data === "emailAddress" && !REGEX.test(self.state[data])) {
        error["emailAddress"] = "Invalid email Id";
      } else {
        error[data] = "";
      }
    });

    this.setState({
      errors: error
    });
    flag = Object.keys(error).find((obj) => {
      if (error[obj]){
        return true;
      } 
      return false;
    });
    return flag;
  }
  clearState() {
    this.setState({ ...initialState });
  }

  onChange(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  }

  onBlur(evt) {
    //console.log("onBlur event called with event info: ", evt);
  }

  afterPaste(evt) {
    //  console.log("afterPaste event called with event info: ", evt);
  }

  handleSubmit(event, type) {
    let { bulkMail } = this.props;
    let { emailAddress, subject, content, selectedOption } = this.state;
    if (!this.validateInputs(type)) {
        if(type === "all"){
          let result = {
            userType : selectedOption,
            subject,
            content
          }
          bulkMail({
            variables: {
              data: result
            }
          }).then(async ({ data }) => {
            if (data.bulkMail) {
              this.setState({
                popUpDetails: this.state.popUpDetails.concat([
                  "Email Sent Successfully"
                ])
              });
            }
            this.clearState();
          }).catch((error) => {
            this.setState({
              popUpDetails: error.graphQLErrors.map((x) => x.message)
            });
          });
        } else if(type === "specificUser"){
          let result = {
            emailAddress: emailAddress.toLowerCase(),
            userType : selectedOption,
            subject,
            content
          }
          bulkMail({
            variables: {
              data: result
            }
          }).then(async ({ data }) => {
            if (data.bulkMail) {
              this.setState({
                popUpDetails: this.state.popUpDetails.concat([
                  "Email Sent Successfully"
                ])
              });
            }
            this.clearState();
          }).catch((error) => {
            this.setState({
              popUpDetails: error.graphQLErrors.map((x) => x.message)
            });
          });
        }
    }
  }
  change(event, stateName, type) {
    this.setState({
      [stateName]: event.target.value,
      [type]: Object.assign({}, this.state[type], {
        [stateName]: event.target.value
      })
    });
  }

  cancelButtonClick = () => {
    this.props.history.push("/admin/dashboard");
  };



  handleOptionChange = (changeEvent) => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }
  
  render(){
    const { classes } = this.props;
    const {
      emailAddress,
      subject,
      errors,
      popUpDetails,
      selectedOption
    } = this.state;
    return (
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" text>
            <CardText color="rose">
              <h4 className={classes.cardTitle}>Send Email </h4>
            </CardText>
          </CardHeader>
             <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Email To<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                  <form>
                      <div className="radio">
                          <label>
                            <input type="radio" value="specificUser" checked={selectedOption === "specificUser"} onChange={this.handleOptionChange} />
                            Specific User
                          </label>
                        </div>  
                        <div className="radio">
                          <label>
                            <input type="radio" value="all"  checked={selectedOption === "all"} onChange={this.handleOptionChange} />
                            All
                          </label>
                        </div>
                   </form>
                  </GridItem>
                </GridContainer>
              {
                selectedOption && selectedOption === 'specificUser' &&
                  <div id="div1" class="hide">
                  <GridContainer>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Email<span className="validatcolor">*</span>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={10}>
                      <CustomInput
                        id="emailAddress"
                        error={!!errors.emailAddress}
                        success={!!errors.emailAddress}
                        helpText={errors.emailAddress}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event =>
                            this.change(event, "emailAddress", "specificUser"),
                          type: "email",
                          value: emailAddress,
                          autoComplete: "off"
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  </div>
              }
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Subject<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="subject"
                      error={!!errors.subject}
                      success={!!errors.subject}
                      helpText={errors.subject}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "subject", "specificUser"),
                        type: "text",
                        value: subject,
                        autoComplete: "off"
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Message<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <CKEditor
                        activeClass="p10"
                        content={this.state.content}
                        events={{
                          blur: this.onBlur,
                          afterPaste: this.afterPaste,
                          change: this.onChange
                        }}
                      />
                    </FormControl>
                    <FormHelperText error={errors.content}>
                      {errors.content}
                    </FormHelperText>
                  </GridItem>
                </GridContainer>

                <CardFooter>
                  <Button
                    className={classes.roomTypeCancelBtn}
                    onClick={() => this.cancelButtonClick()}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    color="rose"
                    disabled={this.state.isButtonDisabled}
                    onClick={(event) => this.handleSubmit(event, selectedOption)}
                    className={classes.registerButton}
                  >
                    Submit
                  </Button>
                </CardFooter>
              </CardBody>
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
    );
  }
}

var adminUser = compose(
  graphql(BULK_MAIL, { name: "bulkMail" }),
  graphql(UPDATE_TOGGLE_STATUS, { name: "updateToggle" })
)(AdminUser);

export default withStyles(styles)(adminUser);
