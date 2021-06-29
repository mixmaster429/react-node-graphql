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
import PictureUpload from "../../../components/CustomUpload/ImageUpload.jsx";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";


import {GET_BANNER_INFO, UPDATE_TOGGLE_STATUS,UPDATE_BANNER_INFO} from "../../../queries";
import  { isUrl } from "../../../helper.js";
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

class BannerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.change = this.change.bind(this);
  }

  componentWillMount() {
    let {getAdBannerInfo, match} = this.props;
    var self = this;
    let id = match.params.id;
    if (id && !!getAdBannerInfo && !!getAdBannerInfo.getAdBannerInfo) {
      var getBanner = getAdBannerInfo.getAdBannerInfo.find((feat) => {
        return Number(feat.id) === Number(id);
      });
      self.setState({
        id: getBanner.id,
        name: getBanner.name,
        status: getBanner.status,
        webBannerImage: getBanner.webBannerImage,
        mobileBannerImage: getBanner.mobileBannerImage,
        bannerUrl: getBanner.bannerUrl
       });
    }
  }

  componentWillReceiveProps(nxtPrps) {
    let {getAdBannerInfo, match} = nxtPrps;
    var self = this;
    let id = match.params.id;
    if (id && !!getAdBannerInfo && !!getAdBannerInfo.getAdBannerInfo) {
      var getBanner = getAdBannerInfo.getAdBannerInfo.find((feat) => {
        return Number(feat.id) === Number(id);
      });
      self.setState({
        id: getBanner.id,
        name: getBanner.name,
        status: getBanner.status,
        webBannerImage: getBanner.webBannerImage,
        mobileBannerImage: getBanner.mobileBannerImage,
        bannerUrl: getBanner.bannerUrl
       });
    }
  }

  componentDidUpdate() {
    let {getAdBannerInfo, match} = this.props;
    let id = match.params.id;
    if (id && !!getAdBannerInfo && !!getAdBannerInfo.getAdBannerInfo && this.state.refetch) {
       getAdBannerInfo.getAdBannerInfo.find((feat) => {
        return Number(feat.id) === Number(id);
      });
    }
  }

  handleUpload(type,file, err) {
    this.setState({
      isButtonDisabled: false
    })
     if(type === "webBannerImage"){
      if (err === "invalid") {
        this.setState({
          webBannerImage: "",
          errors: Object.assign({}, this.state.errors, {webBannerImage: "Please upload the images like JPG,JPEG,PNG File Only and Image Must be less than 5mb"}),
          isButtonDisabled: true
        })
      } else {
        this.setState({
          webBannerImage: file,
          editData: Object.assign({}, this.state.editData, {"webBannerImage": file}),
          errors: Object.assign({}, this.state.errors, {webBannerImage: ""})
        });
      }
     } else if (type === "mobileBannerImage"){
      if (err === "invalid") {
        this.setState({
          mobileBannerImage: "",
          errors: Object.assign({}, this.state.errors, {mobileBannerImage: "Please upload the images like JPG,JPEG,PNG File Only and Image Must be less than 5mb"}),
          isButtonDisabled: true
        })
      } else {
        this.setState({
          mobileBannerImage: file,
          editData: Object.assign({}, this.state.editData, {"mobileBannerImage": file}),
          errors: Object.assign({}, this.state.errors, {mobileBannerImage: ""})
        });
      }
     }
  }


  clearState() {
    this.setState({...initialState});
  }


  validateInputs() {
    let {name,webBannerImage,mobileBannerImage,bannerUrl,status,errors} = this.state;
    let error = {}, flag = false;
    let {match} = this.props;
    let id = match.params.id;

    if (!webBannerImage){
      error.webBannerImage = "The web banner image field is required.";
    } 
    else{
      error.webBannerImage = "";
    }
    if (errors.webBannerImage){
      error.image = errors.image;
    } 
    if (!mobileBannerImage){
      error.mobileBannerImage = "The mobile banner image field is required.";
    }
    else{
      error.mobileBannerImage = "";
    } 
    if (errors.mobileBannerImage){
      error.image = errors.image;
    } 
    if (!name){
      error.name = "The name field is required";
    } 
    else{
      error.name = "";
    } 
    if (!bannerUrl){
      error.bannerUrl = "The banner URL field is required";
    } 
    else if(isUrl(bannerUrl)){
      error.bannerUrl = "";
    }else if(!isUrl(bannerUrl)){
      error.bannerUrl = "The Link format is invalid";
    }else{
      error.bannerUrl = "";
    } 
    if (!status){
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
  let id = this.props.match.params.id;
  let {editData, name, webBannerImage,mobileBannerImage,bannerUrl, status} = this.state;
  const variables = id ? {id: Number(id), data: Object.assign({}, editData)} : {
    data: {
      name, 
      webBannerImage,
      mobileBannerImage,
     // "webBannerImage": webBannerImage,
      //"mobileBannerImage":mobileBannerImage,
      status,
      bannerUrl
    }};

    if (!this.validateInputs()) {
      if(REACT_APP_EDIT_MODE !== "prod"){
      this.props.updateBannerInfo({
        variables
      }).then(async ({data}) => {
        if (data.updateAdBanner) {
          this.props.updateToggle({variables: {
            toggleStatus: true,
            message: id
            ? "Banner Updated Successfully"
            : "Banner Added Successfully"
          }});
          this.props.history.push("/admin/manageBanner");
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

  cancelButtonClick = () => {
    this.props.history.push("/admin/manageBanner");
  };


  change(event, stateName) {
    this.setState({
      isButtonDisabled: false
    });
    let { match }  = this.props;
    const id = match.params.id;
    this.setState({
       [stateName]: event.target.value });
    if (id) {
      this.setState({
        editData: Object.assign({}, this.state.editData, {[stateName]: event.target.value})
      });
    }
  }

  render() {
    const { classes, match } = this.props;
    const id = match.params.id;
    const {name, bannerUrl,webBannerImage,mobileBannerImage,errors, popUpDetails, status}= this.state;

    return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
      <Card>
        <CardHeader color="rose" text>
        <CardText color="rose">
        <h4 className={classes.cardTitle}>{id ? "Edit Banner" : "Add Banner"}</h4>
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
                        onChange: event =>
                          this.change(event, "name"),
                        type: "text",
                        autoComplete: "off",
                        value: name
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Banner URL<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                    <CustomInput
                      id="bannerUrl"
                      error={!!errors.bannerUrl}
                      success={!!errors.bannerUrl}
                      helpText={errors.bannerUrl}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: (event) =>
                          this.change(event, "bannerUrl"),
                        type: "text",
                        autoComplete: "off",
                        value: bannerUrl
                      }}
                    />
                  </GridItem>
                </GridContainer>
               
                <GridContainer>
                <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Banner Image For Web<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                <GridItem xs={12} sm={8}>
                  <div className="uploadbanne">
                <PictureUpload mode={id &&"edit"}  
                imageUrl = {(id && typeof webBannerImage === "string") ? webBannerImage : ""}
                handleSubmit={(f, e) => this.handleUpload("webBannerImage",f, e)}/>
                <FormHelperText >NOTE: Recommended Size 1900 x 175 pixels</FormHelperText>
                <FormHelperText error={errors["webBannerImage"]}>{errors["webBannerImage"]}</FormHelperText>
                </div>
                </GridItem>
                </GridContainer>

               <GridContainer>
                <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Banner Image For MobileApp<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                <GridItem xs={12} sm={8}>
                  <div className="uploadbanne Mobile">
                <PictureUpload mode={id &&"edit"}  
                imageUrl = {(id && typeof mobileBannerImage === "string") ? mobileBannerImage : ""}
                handleSubmit={(f, e) => this.handleUpload("mobileBannerImage",f, e)}/>
                <FormHelperText >NOTE: Recommended Size 1024 x 500 pixels</FormHelperText>
                <FormHelperText error={errors["mobileBannerImage"]}>{errors["mobileBannerImage"]}</FormHelperText>
                </div>
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

var banner = compose(
  graphql(GET_BANNER_INFO, {name: "getAdBannerInfo"}),
  graphql(UPDATE_BANNER_INFO,{name: "updateBannerInfo"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
)(BannerForm);

export default withStyles(styles)(banner);
