import React from "react";
import {compose,graphql } from "react-apollo";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";

// material ui icons
import FormHelperText from  "@material-ui/core/FormHelperText";
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
import {GET_ADMIN_LANGUAGES, UPDATE_TOGGLE_STATUS,UPDATE_LANGUAGE} from "../../../queries";
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
    name: "",
    status: "",
    categories: [],
    popUpDetails: [],
    errors: {},
    editData: {},
    refetch: false,
    isButtonDisabled: false
};

class LanguageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.change = this.change.bind(this);
  }

  componentWillMount() {
    let {getAdminLanguages, match} = this.props;
    var self = this;
    let id = match.params.id;
    if (id && !!getAdminLanguages && !!getAdminLanguages.getAdminLanguages) {
      var getLang = getAdminLanguages.getAdminLanguages.find((feat) => {
        return Number(feat.id) === Number(id);
      });
      self.setState({
        id: getLang.id,
        name: getLang.name,
        status: getLang.status,
        value: getLang.value
       });
    }
  }

  componentWillReceiveProps(nxtPrps) {
    let {getAdminLanguages, match} = nxtPrps;
    var self = this;
    let id = match.params.id;
    if (id && !!getAdminLanguages && !!getAdminLanguages.getAdminLanguages) {
      var getLang = getAdminLanguages.getAdminLanguages.find((feat) => {
        return Number(feat.id) === Number(id);
      });
      self.setState({
        id: getLang.id,
        name: getLang.name,
        status: getLang.status,
        value: getLang.value
       });
    }
  }

  componentDidUpdate() {
    let {getAdminLanguages, match} = this.props;
    let id = match.params.id;
    if (id && !!getAdminLanguages && !!getAdminLanguages.getAdminLanguages && this.state.refetch) {
      getAdminLanguages.getAdminLanguages.find((feat) => {
        return Number(feat.id) === Number(id);
      });
    }
  }

  clearState() {
    this.setState({...initialState});
  }


  validateInputs() {
    let {name,status,value,} = this.state;
    let {getAdminLanguages} = this.props;
    let error = {}, flag = false;
    let {match} = this.props;
    let id = match.params.id;
  
    if (!name){
      error.name = "The name field is required";
    } 
    else if(name){
      let getLang = getAdminLanguages.getAdminLanguages.find((feat) => {
        let check  = feat.name === name ? true : false;
        return check;
      });
     if(!id && getLang && getLang.name){
        error.name = "The Name Field has already been taken";
     }
    }
    else {
      error.name = "";
    }

    if (!value){
      error.value = "The value field is required";
    } 
    else if(value){
      let getLang = getAdminLanguages.getAdminLanguages.find((feat) => {
        let check  = feat.value === value ? true : false;
        return check;
      });
     if(!id && getLang && getLang.value){
        error.value = "The value Field has already been taken";
     }
    }else {
      error.value = "";
    }

    if (!status) {
      error.status = "The status field is required";
    }
    else{
      error.status = "";
    } 

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
      if (Object.keys(this.state.editData).length) {
        return flag;
      }
      else {
        return true;
      }
    }
    return flag;
    }

  handleSubmit(event) {
  event.preventDefault();
  this.setState({
    isButtonDisabled: true
  });
  let id = this.props.match.params.id;
  let {editData,name,status,value} = this.state;
  const variables = id ? {id: Number(id), data: Object.assign({}, editData)} : {
    data: {
      name, 
      value,
      status,
    }};

    if (!this.validateInputs()) {
      if(REACT_APP_EDIT_MODE !== "prod"){
      this.props.updateLanguage({
        variables
      }).then(async ({data}) => {
        if (data.updateLanguage) {
          this.props.updateToggle({variables: {
            toggleStatus: true,
            message: id
            ? "Language Updated Successfully"
            : "Language Added Successfully"
          }});
          this.props.history.push("/admin/ManageLanguage");
        }
    }).catch((error) => {
        this.setState({
          popUpDetails: error.graphQLErrors.map((x) => x.message)
        });
    });
   }
   else{
    let error = ["Add/Edit Restricted for Live"];
    this.setState({
      popUpDetails: error 
    });
  }
  }
  }
  change(event, stateName) {
    this.setState({
      isButtonDisabled: false
    });
    let { match }  = this.props;
    const id = match.params.id;
    this.setState({
       [stateName]: event.target.value 
      });
    if (id) {
      this.setState({
        editData: Object.assign({}, this.state.editData, {[stateName]: event.target.value})
      });
    }
  }

  cancelButtonClick = () => {
    this.props.history.push("/admin/ManageLanguage");
  };


  render() {
    const { classes, match } = this.props;
    const id = match.params.id;
    const {name,errors, popUpDetails, status,value}= this.state;
   
    return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
      <Card>
        <CardHeader color="rose" text>
        <CardText color="rose">
        <h4 className={classes.cardTitle}>{id ? "Edit Language" : "Add Language"}</h4>
        </CardText>
        </CardHeader>
        <CardBody>
            <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Name<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="name"
                      error={!!errors.name}
                      success={!!errors.name}
                      helpText={errors.name}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "name"),
                        type: "text",
                        disabled: id ? true : false,
                        autoComplete: "off",
                        value: name
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                     Value<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="value"
                      error={!!errors.value}
                      success={!!errors.value}
                      helpText={errors.value}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "value"),
                        type: "text",
                        autoComplete: "off",
                        disabled: id ? true : false,
                        value
                      }}
                      
                    />
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
                              this.change(event, "status")
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
              <Button type="submit" color="rose" onClick={(e) => this.handleSubmit(e)} disabled={this.state.isButtonDisabled}>
              Submit
              </Button>
            </CardFooter>
            {popUpDetails.length ?
                <Snackbar place="tc"
                color="rose"
                message={popUpDetails[0]}
                open={!!popUpDetails.length}
                closeNotification={() => {
                  this.setState({popUpDetails: [], refetch: true});
                }
                }
                close /> : ""}
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var lang = compose(
  graphql(GET_ADMIN_LANGUAGES, {name: "getAdminLanguages"}),
  graphql(UPDATE_LANGUAGE,{name: "updateLanguage"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
)(LanguageForm);

export default withStyles(styles)(lang);
