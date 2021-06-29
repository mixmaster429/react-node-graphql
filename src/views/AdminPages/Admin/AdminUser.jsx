import React from "react";
import { Mutation,compose,graphql } from "react-apollo";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";

// material ui icons
import FormHelperText from "@material-ui/core/FormHelperText";
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

import {UPDATE_ADMIN_USER, GET_ADMIN_USER, UPDATE_TOGGLE_STATUS} from "../../../queries";
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
    isButtonDisabled: false
};

class AdminUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.change = this.change.bind(this);
  }

  componentWillMount() {
    let {match, adminInfo} = this.props;
    let id = match.params.id;
    if (id) {
      adminInfo.refetch({id: Number(id)});
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.adminInfo && nextProps.adminInfo.getAdminUser) {
      let {email, userName, status} = nextProps.adminInfo.getAdminUser;
      var b = "***";
      var c = email.split("@");
      var a = c[0].slice(0, -3);
      var d = a.concat(b).concat("@").concat(c[1]);
      this.setState({
        email: REACT_APP_EDIT_MODE === "prod" ? d : email,
         userName,
         status,
        // role: role
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
      if (id && data === "password" && self.state.editData.password === undefined) {
        error[data] = "";
      } else if (data === "password" && id && (self.state.editData.password === "" || self.state.editData.password.trim() === "")) {
        error[data] = `The ${data} field is required.`;
      }
      else if (!self.state[data] ||  (self.state[data] && !self.state[data].trim().length)) {
        error[data] = `The ${data} field is required.`;
      } else {
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
      if (error[obj]){
        return true;
      } 
      return false;
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

  handleSubmit(event, adminUser) {
    event.preventDefault();
    this.setState({
      isButtonDisabled: true
    });
    let id = this.props.match.params.id;
    if (!this.validateInput()) {
      if(REACT_APP_EDIT_MODE !== "prod"){
        adminUser().then(async ({data}) => {
          if (data.updateAdmin) {
            this.props.updateToggle({variables: { 
              toggleStatus: true,
              message: id
              ? "Admin User Updated Successfully"
              : "Admin User Added Successfully"
            }});
            this.props.history.push("/admin/adminUsers");
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
        editData: Object.assign({}, {id: Number(id)}, this.state.editData, {[stateName]: event.target.value && event.target.value.trim()})
      });
    }
  }

  cancelButtonClick = () => {
    this.props.history.push("/admin/adminUsers");
  };

  render() {
    const { classes, match } = this.props;
    const id = match.params.id;
    const {email, userName, password, status, editData, errors, popUpDetails} = this.state;
    const variables = id ? editData : {
      email: email.trim(),
      password: password.trim(),
      userName: userName.trim(),
      status: status.trim()
    };
    return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
      <Mutation mutation={UPDATE_ADMIN_USER} variables={variables}>
          {(adminUser, { data, loading, error }) => {
            return (
          <form onSubmit={(event) => this.handleSubmit(event, adminUser)}>
      <Card>
        <CardHeader color="rose" text>
        <CardText color="rose">
        <h4 className={classes.cardTitle}>{id ? "Edit Admin" : "Add Admin"}</h4>
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
                        value:userName,
                        autoComplete: "off",
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
                      value={id ? email : ""}
                      id="email"
                      error={!!errors.email}
                      success={!!errors.email}
                      helpText={errors.email}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event =>
                          this.change(id, event, "email"),
                        value:email,
                        autoComplete: "new-password"
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      {/* <span> {`Password${id ? "" : "*"}`} </span>   */}
                      {id === "" || <span> password</span> }
                      {!id === "" || <span className="validatcolor">  *</span> }
                  
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                    error={!!errors.password}
                    success={!!errors.password}
                    helpText={errors.password}
                      id="password"
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
                              event =>
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
                      {/* <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Roles*
                    </FormLabel>
                  </GridItem>
                      <GridItem xs={12} sm={4}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="role"
                            className={classes.selectLabel}
                          >
                            {!(role) ? "Choose role" : ""}
                          </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            value={role}
                            onChange={
                              event =>
                              this.change(id, event, "role")
                            }
                            inputProps={{
                              name: "role",
                              id: "role"
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem
                              }}
                            >
                              Choose Roles
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="SuperAdmin"
                            >
                              Super Admin
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value="Admin"
                            >
                              Admin
                            </MenuItem>
                          </Select>
                        </FormControl>
                        <FormHelperText error={errors.role}>{errors.role}</FormHelperText>
                      </GridItem>
                      </GridContainer> */}
            </CardBody>
           
            <CardFooter>
            <Button
                  className={classes.roomTypeCancelBtn}
                  onClick={() => this.cancelButtonClick()}
                >
                 Cancel
                </Button>

              <Button type="submit" color="rose" disabled={this.state.isButtonDisabled} className={classes.registerButton}>
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

var adminUser = compose(
  graphql(GET_ADMIN_USER, {name: "adminInfo"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(AdminUser);

export default withStyles(styles)(adminUser);
