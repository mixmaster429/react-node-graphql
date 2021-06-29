import React from "react";
import { Mutation,graphql, compose } from "react-apollo";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";

// material ui icons
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

import {EDIT_USER, GET_USER, SIGNUP_USER, UPDATE_TOGGLE_STATUS} from "../../../queries";
const {REACT_APP_EDIT_MODE} = process.env;
const styles = {
    ...validationFormsStyle,
    ...extendedFormsStyle,
    cardTitle: {
      ...validationFormsStyle.cardTitle,
      color: "white"
    }

};

const initialState = {
    userName: "",
    email: "",
    password: "",
    status: "",
    editData: {},
    errors: {},
    popUpDetails: [],
    isButtonDisabled: true
};

class UserAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.change = this.change.bind(this);
  }

  componentWillMount() {
    let {userInfo, match} = this.props;
    let id = match.params.id;
    if (id) {
      userInfo.refetch({id: Number(id)});
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.userInfo && nextProps.userInfo.getUserDetails) {
      let {email, userName, password, status} = nextProps.userInfo.getUserDetails.foundUser;
      var b = "***";
      var c = email.split("@");
      var a = c[0].slice(0, -3);
      var d = a.concat(b).concat("@").concat(c[1]);
      this.setState({
        email: REACT_APP_EDIT_MODE === "prod" ? d : email,
         userName,
         password,
         status
      });
    }
  }

  clearState() {
    this.setState({...initialState});
  }

  validateInput() {
    let {match} = this.props;
    let id = match.params.id;
    var self = this;
    let required = ["userName", "email", "password", "status"];
    let error = {}, flag = false;
    required.forEach((data) => {
      if (id && data === "password" && self.state.editData.password === undefined){
        error[data] = "";
      }
      else if (data === "password" && id && (self.state.editData.password === "" || self.state.editData.password.trim() === "")) {
        error[data] = `The ${data} field is required.`;
      }
      else if (!self.state[data] && !self.state[data].length) {
        error[data] = `The ${data} field is required.`;
      } else if (self.state[data] && data === "password" && self.state[data].length < 4) {
        error[data] = "Password must have minimum 4 letters.";
      }else {
        error[data] = "";
      }
      if (required === "email" && !!this.state.email) {
        //eslint-disable-next-line
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRex.test(this.state.email)) {
          error.email = "The Email must be a valid email address.";
        } else {
          error.email = "";
        }
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
    if (id) {
      if (Object.keys(this.state.editData).length){
        return flag;
      } 
      else{
        return true;
      } 
    }
    return flag;
  }

  handleSubmit(event, userAction) {
    let {match} = this.props;
    let id = match.params.id;
    event.preventDefault();
    if (!this.validateInput()) {
      if(REACT_APP_EDIT_MODE !== "prod"){
      this.setState({
        isButtonDisabled: true
      });
      userAction().then(async ({data}) => {
        if (data.editProfile || data.signup.result) {
          this.props.updateToggle({variables: { 
            toggleStatus: true,
            message: id
            ? "User Updated Successfully"
            : "User Added Successfully"
          }});
          this.props.history.push("/admin/users");
        }
    }).catch((error) => {
      this.setState({
        popUpDetails: error.graphQLErrors.map((x) => x.message)
      });
    });
    } else{
      let error = ["Add/Edit Restricted for Live"];
      this.setState({
        popUpDetails: error 
      });
    }
    }
  }

  change(id, event, stateName) {
    this.setState({
      isButtonDisabled: false
    });
    this.setState({ [stateName]: event.target.value });
    if (id) {
      this.setState({
        editData: Object.assign({}, {id: Number(id)}, this.state.editData, {[stateName]: event.target.value})
      });
    }
  }

  cancelButtonClick = () => {
    this.props.history.push("/admin/users");
  };

  render() {
    const { classes, match } = this.props;
    const id = match.params.id;
    const {email, userName, password, status, editData, errors, popUpDetails} = this.state;
    editData.type = "Admin";
    const variables = id ?  editData : {
      email: email.trim(),
      password: password.trim(),
      userName: userName.trim(),
      status,
      type: "Admin"
    };
    return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
      <Mutation mutation={id ? EDIT_USER : SIGNUP_USER} variables={variables}>
          {(userAction, { data, loading, error }) => {
            return (
          <form onSubmit={(event) => this.handleSubmit(event, userAction)}>
      <Card>
        <CardHeader color="rose" text>
        <CardText color="rose">
        <h4 className={classes.cardTitle}>{id ? "Edit User" : "Add User"}</h4>
        </CardText>
        </CardHeader>
        <CardBody>
            <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      User Name<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="userName"
                      error={!!errors.userName}
                      success={!!errors.userName}
                      helpText={errors.userName}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(id, event, "userName"),
                        type: "text",
                        autoComplete: "off",
                        value: userName
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Email<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="email"
                      error={!!errors.email}
                      success={!!errors.email}
                      helpText={errors.email}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(id, event, "email"),
                        autoComplete: "new-password",
                        value: email
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    {/* {`Password${id ? "" : "*"}`} */}
                    {id === "" || <span> password</span> }
                      {!id === "" || <span className="validatcolor">  *</span> }
                      
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="password"
                      error={!!errors.password}
                      success={!!errors.password}
                      helpText={errors.password}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(id, event, "password"),
                        type: "text",
                        autoComplete: "off",
                        value: password
                      }}
                    />
                    {id ?
                    <FormHelperText>
                      Enter new password only. Leave blank to use existing password.
                      </FormHelperText> : ""}
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Status<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                      <GridItem xs={12} sm={4}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="status"
                            className={classes.selectLabel}
                          >
                            {!(status) && "Choose Status"}
                          </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            value={status}
                            onChange={
                              (event) =>
                              this.change(id, event, "status")
                            }
                            inputProps={{
                              name: "status",
                              id: "status"
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem
                              }}
                            >
                              Choose Status
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Active"
                            >
                              Active
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Inactive"
                            >
                              Inactive
                            </MenuItem>
                          </Select>
                        </FormControl>
                        <FormHelperText error={errors.status}>{errors.status}</FormHelperText>
                      </GridItem>
                      </GridContainer>
            </CardBody>
            <CardFooter>
            <Button
                  className={classes.roomTypeCancelBtn}
                  onClick={() => this.cancelButtonClick()}
                >
                 Cancel
                </Button>
              <Button type="submit" color="rose" disabled={this.state.isButtonDisabled}>
              Submit
              </Button>
            </CardFooter>
            {popUpDetails.length ?
                <Snackbar place="tc"
                color="rose"
                message={popUpDetails[0]}
                open={!!popUpDetails.length}
                closeNotification={() => {
                  this.setState({popUpDetails: []});
                }
                }
                close /> : ""}
                </Card>
          </form>
            );}}
            </Mutation>
        </GridItem>
      </GridContainer>
    );
  }
}

const userAction = compose(
  graphql(GET_USER, {name: "userInfo"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(UserAction);

export default withStyles(styles)(userAction);
