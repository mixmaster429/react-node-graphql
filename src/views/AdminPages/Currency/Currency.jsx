import React from "react";
import { compose,graphql } from "react-apollo";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";

// material ui icons
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from  "@material-ui/core/FormHelperText";
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
import {UPDATE_CURRENCY, GET_CURRENCY, UPDATE_TOGGLE_STATUS} from "../../../queries";
import {getSymbol} from "../../../helper.js";
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
    symbol: "",
    rate: 0,
    code:"",
    status:"",
    popUpDetails: [],
    errors: {},
    editData: {},
    isButtonDisabled: false
};

class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.change = this.change.bind(this);
  }

  componentWillMount() {
    let {currency, match} = this.props;
    let id = match.params.id;
    if (id && !currency.getCurrency) {
        currency.refetch({id: Number(id)});
    }
    if (!!currency && !!currency.getCurrency) {
        let curInfo = currency.getCurrency;
      this.setState({
          name: curInfo.name,
          symbol: getSymbol(curInfo.symbol),
          code: curInfo.code,
          rate: curInfo.rate,
          status: curInfo.status
        });
    }
  }

  componentWillReceiveProps(nxtPrps) {
    let {currency} = nxtPrps;
    if (!!currency && !!currency.getCurrency) {
        let curInfo = currency.getCurrency;
      this.setState({
          name: curInfo.name,
          symbol: getSymbol(curInfo.symbol),
          code: curInfo.code,
          rate: curInfo.rate,
          status: curInfo.status
        });
    }
  }

  clearState() {
    this.setState({...initialState});
  }

  validateInputs() {
    let {name, symbol, code, rate, status} = this.state;
    var error = {};
    var flag = false;
    let {match} = this.props;
    let id = match.params.id;
    if (!name){
      error.name = "The name field is required.";
    } 
    if (!symbol){
      error.symbol = "The symbol field is required.";
    } 
    if (!rate){
      error.rate = "The rate field is required.";
    } 
    if (rate && (!!isNaN(Number(rate)) || !!(rate <= 0))){
      error.rate = "Rate must be a positive number.";
    } 
    if (!code){
      error.code = "The code field is required.";
    } 
    if (!status){
      error.status = "The status field is required.";
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
      if (Object.keys(this.state.editData).length){
        return flag;
      }
      else return true;
    }
    return flag;
    }
  
    handleSubmit(event) {
      event.preventDefault();
      this.setState({
        isButtonDisabled: true
      });
      let {editData, name, symbol, code, rate, status} = this.state;
      let id = this.props.match.params.id;
      const variables = id ? {id: Number(id), data: editData} : {data: { name, rate: Number(rate), symbol, code, status}};
      if (!this.validateInputs()) {
        if(REACT_APP_EDIT_MODE !== "prod"){
        this.props.updateCurrency({
            variables
        }).then(async ({data}) => {
          if (data.updateCurrency) {
            this.props.updateToggle({variables: {
              toggleStatus: true,
              message: id
              ? "Currency Updated Successfully"
              : "Currency Added Successfully"
            }});
            this.props.history.push("/admin/currencies");
          }
      }).catch((error) => {
          this.setState({
            popUpDetails: error.graphQLErrors.map((x) => x.message)
          });
      });
      }else{
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
    let id = this.props.match.params.id;
    this.setState({ [stateName]: event.target.value });
    if (id) {
      this.setState({
        editData: Object.assign({}, this.state.editData, {[stateName]: stateName === "rate" ? Number(event.target.value) : event.target.value})
      });
    }
  }

  cancelButtonClick = () => {
    this.props.history.push("/admin/currencies");
  };

  render() {
    const { classes, match } = this.props;
    const id = match.params.id;
    const {name, code, rate, symbol, errors, status, popUpDetails} = this.state;
    return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
      <Card>
        <CardHeader color="rose" text>
        <CardText color="rose">
        <h4 className={classes.cardTitle}>{id ? "Edit Currency" : "Add Currency"}</h4>
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
                      error={!!errors["name"]}
                      success={!!errors["name"]}
                      helpText={errors["name"]}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "name", "required"),
                        type: "text",
                        value: name,
                        autoComplete: "off"
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Symbol<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="symbol"
                      error={!!errors["symbol"]}
                      success={!!errors["symbol"]}
                      helpText={errors["symbol"]}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "symbol", "required"),
                        type: "text",
                        value: symbol,
                        autoComplete: "off"
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Code<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="code"
                      error={!!errors["code"]}
                      success={!!errors["code"]}
                      helpText={errors["code"]}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "code", "required"),
                        type: "text",
                        value: code,
                        autoComplete: "off"
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Rate<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="rate"
                      error={!!errors["rate"]}
                      success={!!errors["rate"]}
                      helpText={errors["rate"]}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "rate", "required"),
                        type: "text",
                        value: rate,
                        autoComplete: "off"
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
                      <GridItem xs={12} sm={8}>
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
                              this.change(event, "status", "required")
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
                            {
                              ["Active", "Inactive"].map((ss, index) => {
                                return <MenuItem
                                key = {index}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={ss}
                              >
                                {ss}
                              </MenuItem>;
                              })
                              }
                          </Select>
                        </FormControl>
                        <FormHelperText error={errors["status"]}>{errors["status"]}</FormHelperText>
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

              <Button onClick={(e) => this.handleSubmit(e)} disabled={this.state.isButtonDisabled} color="rose">
              Submit
              </Button>
            </CardFooter>
            {popUpDetails.length ?
                <Snackbar place="tc"
                color="rose"
                message={popUpDetails[0]}
                open={!!popUpDetails.length}
                closeNotification={() => {
                  this.setState({popUpDetails: []})
                }
                }
                close /> : ""}
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var currency = compose(
  graphql(GET_CURRENCY, {
     name: "currency",
     options: (prop) => ({
       variables: {
         id: Number(prop.match.params.id)
       }
     })
  }),
  graphql(UPDATE_CURRENCY, {name: "updateCurrency"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(Currency);

export default withStyles(styles)(currency);
