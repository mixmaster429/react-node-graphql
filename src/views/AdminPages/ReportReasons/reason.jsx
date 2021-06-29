import React from "react";
import { compose,graphql } from "react-apollo";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from  "@material-ui/core/FormHelperText";

// material ui icons
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MailOutline from "@material-ui/icons/MailOutline";

import FormLabel from "@material-ui/core/FormLabel";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import ImageUpload from "../../../components/CustomUpload/ImageUpload.jsx";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import {UPDATE_REASON,GET_CURRENCIES, GET_ADMIN_REASONS, GET_LANGUAGES, UPDATE_TOGGLE_STATUS} from "../../../queries";
const {REACT_APP_EDIT_MODE} = process.env;
const styles = {
  ...validationFormsStyle,
  ...extendedFormsStyle,
  cardTitle: {
    ...validationFormsStyle.cardTitle,
    color: "white"
  }

};



/**
|----------------------------------------------------------------------------------------
| Selected Language Details - Navbar Button
|----------------------------------------------------------------------------------------
*/
 const ListItem = ({
  value,
  onClick,
  removeItemClick,
  classes,
  itemDetails
}) => {
  let itemName = itemDetails.filter((o) => o.value === value);
  let label = itemName && itemName.length > 0 ? itemName[0].name : "English";
  const bntEff = {
    one: { position: "relative" },
    two: {
      position: "absolute",
      right: 0,
      fontSize:9,
      backgroundColor: "#f54a61",
      height: 20,
      width: 20,
      padding: 0,
      top: -5,
      borderRadius: 50,
     // borderRadius: 0,
     // borderLeft:"1px solid rgb(221, 221, 221)"
    },
    three: {
      paddingRight: 42
    }
  };
  return (
    <div style={bntEff.one}>
      <Button
        color="info"
        round
        className="languagechange"
        onClick={onClick}
        style={bntEff.three}
      >
        {label}
      </Button>
      {value !== "en" && (
        <Button onClick={() => removeItemClick(value)} style={bntEff.two}>
          X
        </Button>
      )}
    </div>
  );
};
/**
|----------------------------------------------------------------------------------------
| Map the selected language navbar details
|----------------------------------------------------------------------------------------
*/
const List = ({
  items,
  onItemClick,
  removeItemClick,
  classes,
  itemDetails
}) => (
  <GridContainer spacing={4}>
    {items.map((item, i) => (
      <ListItem
        key={i}
        value={item}
        onClick={onItemClick}
        removeItemClick={removeItemClick}
        classes={classes}
        itemDetails={itemDetails}
      />
    ))}
  </GridContainer>
);
/**
|----------------------------------------------------------------------------------------
| Starting class component
|----------------------------------------------------------------------------------------
*/
class ReasonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLanguages: [],
      values: {
        status: "",
        image: "",
        langCode: "en",
        name: "",
        description: "",
      },
      properties: { langCode: "en", name: "", description: "" },
      selectedLangData: [],
      errors: {
        submitBtn: false
      },
      notifyclr: "rose",
      message: "",
      messageOpen: false,
      id: "",
      imageLink: null,
      selectedLanguage: ["en"],
      currentLang: "en",
      addLanguage: false,
      disableLang: false,
      currencyList:[],
      displayForm: false,
      popUpDetails:[]
    };
  }
  /**
|----------------------------------------------------------------------------------------
| Check id exists - if exist then form will act as update form otherwise act as add form
|----------------------------------------------------------------------------------------
*/
  async componentDidMount() {
    await this.getReasonData();
    await this.getAllLanguagesData();
  }

  /**
|----------------------------------------------------------------------------------------
| Get all language details from API
|----------------------------------------------------------------------------------------
*/
getAllLanguagesData = () => { 
  let {getLanguages} = this.props;
  getLanguages.refetch({}).then(({ data }) => {
    if(data){
      let langData = data && data.getLanguages;
      this.setState({
          totalLanguages : langData
      })
    }
  })
}

  /**
|----------------------------------------------------------------------------------------
| Get all existing category details for update form - if id exist
|----------------------------------------------------------------------------------------
*/
getReasonData = () => {
  let {reasonsInfo, match} = this.props;
  let id = match.params.id;
  reasonsInfo.refetch({}).then(({data}) => {
      if(id && data){
       let test = data.getAdminReasons;

        let getFeatured = test.map((feature, key) => {
           return feature;
          })

        let responseData = getFeatured && getFeatured.find((cat) => {
            return cat.id === match.params.id;
          })

        //console.log(responseData)
        let res = responseData.language.map((lang) => {
            return lang;
         })
         //console.log("c1",res)

        let englishProperty = res.filter(
            (x) => x.langCode === "en"
          );

        //console.log(englishProperty)
        let selectedLanguage = [];
        res && res.map((item) => {
          return selectedLanguage.push(item.langCode);
        });
        //console.log({ ...englishProperty[0], ...responseData })
        this.setState({
          values:{ ...englishProperty[0], ...responseData },
          properties:englishProperty[0],
          selectedLangData:res,
          selectedLanguage,
          imageLink: responseData.image
        });
      }
     })
  }
 
  /**
|----------------------------------------------------------------------------------------
| Image upload action renders
|----------------------------------------------------------------------------------------
*/
handleImageFile = async (type,file, err) =>  {
  let { values,errors } = this.state;
  if(type === "image"){
    if (err === "invalid") {
      errors.image = "Please upload the images like JPG,JPEG,PNG File Only and Image Must be less than 5mb";
      this.setState({
        image: "",
        errors
      });
    } else {
      if(file && file.name){
        values.image = file;
        this.setState({
          values, 
          imageLink: null
        });
      } 
      let fieldName = "image";
      this.validate({ values , fieldName });
    }
   }
  
}
  // previewImage = () => {
  //   const { values } = this.state;
  //   let imageLink;
  //   if (values.icon) {
  //     imageLink = values.icon;
  //     this.setState({ imageLink: imageLink });
  //   } else {
  //     this.setState({ imageLink: null });
  //   }
  // };

  /**
|----------------------------------------------------------------------------------------
| Action starts after clicking add language button 
|----------------------------------------------------------------------------------------
*/
onClick = () => {
  const {
    currentLang,
    selectedLanguage,
    properties,
    selectedLangData,
    values,
    totalLanguages
  } = this.state;
  let typeData = "langValid";
  this.validate({ values, typeData });
  if (properties && properties.name && properties.langCode) {
    if (properties.langCode !== currentLang) {
      const nextState = [...selectedLanguage, properties.langCode];
      const prevValues = {...values};
      const prevProps = {...properties};
      this.setState({
        selectedLanguage: nextState,
        selectedLangData: [...selectedLangData, properties],
        currentLang: properties.langCode,
        disableLang: false,
        values: { ...values, langCode: "", name: "", description: "" },
        properties: {
          ...properties,
          langCode: "",
          name: "",
          description: ""
        }
      });
      if(totalLanguages.length-1  === selectedLanguage.length){
        this.setState({
          displayForm  : true,
          values: prevValues, 
          properties: prevProps 
      });
   }
    } else if (properties && properties.langCode === currentLang) {
      let selectedProperty = selectedLangData.filter(
        (o) => o.langCode !== currentLang
      );
      this.setState({
        selectedLangData: [...selectedProperty, properties],
        currentLang: currentLang === "en" ? "" : properties.langCode,
        disableLang: false,
        values: { ...values, langCode: "", name: "", description: "" },
        properties: {
          ...properties,
          langCode: "",
          name: "",
          description: ""
        }
      });
    }
    this.setState({
      addLanguage: true
    });
  } else {
    currentLang === "en"
      ? this.setState({
          addLanguage: false
        })
      : this.setState({
          addLanguage: true,
          disableLang: true
        });
  }
};

  /**
|----------------------------------------------------------------------------------------
| Action starts after clicking individual selected language - Button Label
|----------------------------------------------------------------------------------------
*/
handleItemClick = (e) => {
  //console.log(e.target.getElementsByClassName)
  const { totalLanguages, selectedLangData, values } = this.state;
  let checkHtmlContent = e.target.children[0].innerHTML;
  let getLangCode = totalLanguages.filter((o) => o.name === checkHtmlContent);
  let langCode =
    getLangCode && getLangCode.length > 0 ? getLangCode[0].value : "";
  let selectedProperty = selectedLangData.filter(
    (o) => o.langCode === langCode
  );
  let propertyData =
    selectedProperty && selectedProperty.length > 0
      ? selectedProperty[0]
      : { langCode: "", name: "", description: "" };
  let currentValues = { ...values, ...propertyData };
  this.setState({
    currentLang:  langCode,
    properties: propertyData,
    addLanguage: false,
    values: { ...values, ...propertyData },
    displayForm: false
  });
  this.validate({ values: currentValues, typeData:"langValid" });
};
  /**
|----------------------------------------------------------------------------------------
| Action starts after clicking individual selected language - delete
|----------------------------------------------------------------------------------------
*/
handleItemRemove = (item) => {
  let { selectedLanguage, selectedLangData, values } = this.state;
  let langData = selectedLangData;
  selectedLanguage = selectedLanguage.filter((x) => x !== item);
  selectedLangData = selectedLangData.filter((x) => x.langCode !== item);
  let propertiesData = langData.filter((x) => x.langCode === "en");
  let propertyValue = propertiesData[0];

  this.setState({
    selectedLanguage,
    selectedLangData,
    properties: propertyValue,
    addLanguage: false,
    currentLang: "en",
    values: { ...values, ...propertyValue },
    displayForm: false
  });
};

  /**
|----------------------------------------------------------------------------------------
| Update all existing room type details for update form after clicking update - if id exist
|----------------------------------------------------------------------------------------
*/
updateReasonData = async (id) => {
  let { values, selectedLangData, properties,imageLink } = this.state;
  let finalArray = [];
  this.validate({ values });
  if (values.name && values.name.trim() !== "" && values.langCode) {
    if (selectedLangData && selectedLangData.length > 0) {
      let foundIndex = selectedLangData.findIndex(
        (x) => x.langCode === properties.langCode
      );
      if (foundIndex >= 0) {
        selectedLangData[foundIndex] = properties;
      } else {
        selectedLangData.push(properties);
      }
    } else {
      selectedLangData.push(properties);
    }
  }
  const enIndex = selectedLangData.findIndex((lang) => lang.langCode === "en");
  selectedLangData.push(...selectedLangData.splice(0, enIndex));

  if (selectedLangData && selectedLangData.length > 0) {
    selectedLangData.map((item) => {
      return delete item.__typename;
    });
  }

  // Remove duplicate objects in array

  var uniqueArray =
    selectedLangData &&
    selectedLangData.length > 0 &&
    selectedLangData.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });

  uniqueArray &&
    uniqueArray.length > 0 &&
    uniqueArray.map((item, index) => {
      return finalArray[index] = {
        langCode: item.langCode,
        name: item.name.trim(),
        description: item.description ? item.description.trim() : ""
      };
    });

    let variables;
    if (imageLink) {
      variables = {
        id : Number(id),
        data:{
          status: values.status,
          language: finalArray
        } 
      };
    } else {
      variables = {
          id : Number(id),
          data:{
            status: values.status,
            image: values.image,
            language: finalArray
          } 
       };
  }
  if (
    values.status &&
    values.image &&
    values.name &&
    values.langCode 
  ) {
    if(REACT_APP_EDIT_MODE !== "prod"){
    this.props.updateReason({
      variables
    }).then(async ({data}) => {
    if (data.updateReason) {
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message: id
        ? "Report Reason Updated Successfully"
        : "Report Reason Added Successfully"
      }});
      this.props.history.push("/admin/reportReasons");
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
};
  /**
|----------------------------------------------------------------------------------------
| Add all room type details for Add new form after clicking submit 
|----------------------------------------------------------------------------------------
*/

addReasonData = async () => {
  let { values, selectedLangData, properties } = this.state;
  this.validate({ values });
  let finalArray = [];
  if (values.name && values.name.trim() !== "" && values.langCode) {
    if (selectedLangData && selectedLangData.length > 0) {
      let foundIndex = selectedLangData.findIndex(
        (x) => x.langCode === properties.langCode
      );
      if (foundIndex >= 0) {
        selectedLangData[foundIndex] = properties;
      } else {
        selectedLangData.push(properties);
      }
    } else {
      selectedLangData.push(properties);
    }

    // Remove duplicate objects in array
    let uniqueArray = selectedLangData.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });
    uniqueArray &&
      uniqueArray.length > 0 &&
      uniqueArray.map((item, index) => {
        return finalArray[index] = {
          langCode: item.langCode,
          name: item.name.trim(),
          description: item.description ? item.description.trim() : ""
        };
      });
  }

  let variables = {
    data:{
      status: values.status,
      image: values.image,
      language: finalArray
    } 
  };
  if (
    values.status &&
    values.image &&
    values.name &&
    values.langCode 
  ) {
    if(REACT_APP_EDIT_MODE !== "prod"){
    this.props.updateReason({
      variables
    }).then(async ({data}) => {
    if (data.updateReason) {
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message:  "Report Reason Added Successfully"
      }});
      this.props.history.push("/admin/reportReasons");
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
};

  /**
|----------------------------------------------------------------------------------------
| Works after chaning individual fields
|----------------------------------------------------------------------------------------
*/
handleChange = (event) => {
  event.persist();
  const { values } = this.state;
  let statValues = values;
  let name = event.target.name;
  statValues[name] = event.target.value;
  if (name === "langCode" || name === "description" || name === "name" ) {
    let propValues = {};
    propValues = {
      ...this.state.properties,
      [name]: event.target.value
    };
    this.setState({
      properties: propValues
    });
  }
  this.validate({ values: statValues, fieldName: name });
  this.setState({
    values: statValues
  });
};

  /**
|----------------------------------------------------------------------------------------
| Works after clicking submit/update button
|----------------------------------------------------------------------------------------
*/
handleFormSubmit = (e) => {
  e.preventDefault();
  let id = this.props.match.params.id;
  if (id) {
    this.updateReasonData(id);
  } else {
    this.addReasonData();
  }
};


  /**
|----------------------------------------------------------------------------------------
| Close the toastr message
|----------------------------------------------------------------------------------------
*/
  handleMessageClose = () => {
    this.setState({ messageOpen: false });
  };

  /**
|----------------------------------------------------------------------------------------
| Cancel button trigger to view page
|----------------------------------------------------------------------------------------
*/
  cancelButtonClick = () => {
    this.props.history.push("/admin/reportReasons");
  };

  /**
  |--------------------------------------------------
  | Validate each field
  |--------------------------------------------------
  */
 validate = ({ values, fieldName, typeData }) => {

  const { status,image,langCode, name } = values;
  const { properties } = this.state;
  let { errors } = this.state;
  if (fieldName) {
    if (fieldName === "status") {
      if (!status) {
        errors.status = "Status is required";
        errors.submitBtn = true;
        this.setState({ errors });
      } else if (errors && errors.status !== "" && status) {
        delete errors.status;
        this.setState({ errors });
      }
    }
    if (fieldName === "image") {
      if (!image) {
        errors.image = "Image is required";
        errors.submitBtn = true;
        this.setState({ errors });
      } else if (errors && errors.image !== "" && image) {
        delete errors.image;
        this.setState({ errors });
      }
    }
    if (fieldName === "langCode") {
      if (!langCode) {
        errors.langCode = "Language is required";
        errors.submitBtn = true;
        this.setState({ errors, disableLang: true });
      } else if (errors && errors.langCode !== "" && langCode) {
        delete errors.langCode;
        this.setState({ errors, disableLang: false });
      }
    }
    if (fieldName === "name") {
      if (!name || name.trim() === "") {
        errors.name = "Name is required";
        errors.submitBtn = true;
        this.setState({ errors, disableLang: true });
      } else if (errors && errors.name !== "" && name) {
        delete errors.name;
        this.setState({ errors, disableLang: false });
      }
    }
    if (status && image && name && langCode) {
      errors.submitBtn = false;
      this.setState({ errors, disableLang: false });
    }
  } else if (typeData === "langValid") {
    if (!langCode) {
      errors.langCode = "Language is required";
      errors.submitBtn = true;
      this.setState({
        errors,
        disableLang: true,
        addLanguage: true
      });
    } else if (errors && errors.langCode !== "" && langCode) {
      delete errors.langCode;
      this.setState({ errors, disableLang: false });
    }
    if (!name || name.trim() === "") {
      errors.name = "Name is required";
      errors.submitBtn = true;
      this.setState({
        errors,
        disableLang: true,
        addLanguage: true
      });
    } else if (errors && errors.name !== "" && name) {
      delete errors.name;
      this.setState({ errors, disableLang: false });
    }
    if (name && langCode) {
      errors.submitBtn = false;
      this.setState({ errors, disableLang: false });
    }
  } else {
    if (!langCode) {
      errors.langCode = "Language is required";
      errors.submitBtn = true;
      this.setState({ errors, disableLang: true });
    }
    if (!name) {
      errors.name = "Name is required";
      errors.submitBtn = true;
      this.setState({ errors, disableLang: true });
    }
    if (!status) {
      errors.status = "Status is required";
      errors.submitBtn = true;
      this.setState({ errors });
    }
    if (!image) {
      errors.image = "Image is required";
      errors.submitBtn = true;
      this.setState({ errors });
    }
    if ( status && image && name && langCode && properties.langCode && properties.name ) {
      // errors.submitBtn = false;
      this.setState({ errors, disableLang: false });
    }
  }
  return errors;
};

  /**
|----------------------------------------------------------------------------------------
| Render starts for the page
|----------------------------------------------------------------------------------------
*/
  render() {
    const { values, errors, popUpDetails, properties, disableLang, selectedLanguage, selectedLangData, totalLanguages, addLanguage, displayForm } = this.state;

    const { classes,match} = this.props;
    const id = match.params.id;

    let filteredLang = totalLanguages.filter(
        (o) => !selectedLanguage.includes(o.value)
    );

    return (
      <GridContainer justify="center">
        <Snackbar
          place="tc"
          color={this.state.notifyclr}
          message={this.state.message}
          open={this.state.messageOpen}
          closeNotification={this.handleMessageClose}
          close
        />
        <GridItem item xs={12} sm={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <MailOutline />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                {id
                  ? "Edit Reason"
                  : "Add Reason" }
              </h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={this.handleFormSubmit}>
              <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    {/* Choose Language*<span className="validatcolor">*</span> */}
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                <div className={classes.cardContentRight}>
                  {selectedLangData && selectedLangData.length > 0 && (
                    <List
                      items={selectedLanguage}
                      onItemClick={this.handleItemClick}
                      removeItemClick={this.handleItemRemove}
                      classes={classes}
                      itemDetails={totalLanguages}
                    />
                  )}
                </div>
                </GridItem>
                </GridContainer>

           {!displayForm && <>
            <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Choose Language*<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                 <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel
                    htmlFor="langCode"
                    className={classes.selectLabel}
                  >
                    {/* Choose Language */}
                  </InputLabel>
                  {addLanguage && (
                    <Select
                      MenuProps={{ className: classes.selectMenu }}
                      classes={{ select: classes.select }}
                      value={properties.langCode}
                      onChange={this.handleChange}
                      inputProps={{
                        name: "langCode",
                        id: "langCode"
                      }}
                      disabled={filteredLang.length === 0}
                    >
                      <MenuItem classes={{ root: classes.selectMenuItem }}>
                        Choose Language
                      </MenuItem>
                      {filteredLang &&
                        filteredLang.length > 0 &&
                        filteredLang.filter((item) => item.status === "Active").map((item, index) => {
                            return (
                              <MenuItem
                                key={index}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={item.value}
                              >
                                {item.name}
                              </MenuItem>
                            );
                        })}
                    </Select>
                  )}
                  {!addLanguage && (
                    <Select
                      MenuProps={{ className: classes.selectMenu }}
                      classes={{ select: classes.select }}
                      value={properties ? properties.langCode : ""}
                      onChange={this.handleChange}
                      inputProps={{
                        name: "langCode",
                        id: "langCode"
                      }}
                      disabled
                    >
                      <MenuItem classes={{ root: classes.selectMenuItem }}>
                          Choose Language
                      </MenuItem>
                      {totalLanguages &&
                        totalLanguages.length > 0 &&
                        totalLanguages.filter((item) => item.status === "Active").map((item, index) => {
                            return (
                              <MenuItem
                                key={index}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={item.value}
                              >
                                {item.name}
                              </MenuItem>
                            );
                        })}
                    </Select>
                  )}
                  <FormHelperText error={errors.langCode ? true : false}>
                    {errors.langCode}
                  </FormHelperText>
                </FormControl>
                </GridItem>
                </GridContainer>

                
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Name<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                 
                <CustomInput
                  //labelText="Name*"
                  id="name"
                  formControlProps={{ fullWidth: true }}
                  error={errors.name ? true : false}
                  helperText={errors.name}
                  inputProps={{
                    name: "name",
                    onChange: this.handleChange,
                    value: properties ? properties.name : "",
                    autoComplete: "off"
                  }}
                />
                 <FormHelperText error={errors.name ? true : false}>
                    {errors.name}
                  </FormHelperText>
                  </GridItem>
                 </GridContainer>

                 <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Description
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                <CustomInput
                //  labelText="Description"
                  id="description"
                  formControlProps={{ fullWidth: true }}
                  error={errors.description ? true : false}
                  helperText={errors.description}
                  inputProps={{
                    name: "description",
                    onChange: this.handleChange,
                    value: properties ? properties.description : "",
                    autoComplete: "off"
                  }}
                />
                </GridItem>
                 </GridContainer>
                 <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    {/* Description */}
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                
                {
                  filteredLang && filteredLang.length > 0 ?
                  <>
                  <Button
                  color="rose"
                  type="button"
                  className={classes.registerButton}
                  onClick={this.onClick}
                  disabled={disableLang}
                >
                  Add Language
                </Button>
                {selectedLangData && selectedLangData.length > 0 && (
                  <Button
                  className={classes.roomTypeCancelBtn}
                  onClick={this.handleItemRemove}
                  >
                  Cancel
                  </Button>
                     )}
                     </>
                : ""
              }
              </GridItem>
                 </GridContainer>

                </> }

                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Image<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>
                  <FormControl fullWidth className={classes.selectFormControl + " " + "langupload"}>
                  <InputLabel htmlFor="image" className={classes.selectLabel}>
                   
                  </InputLabel>
                <ImageUpload 
                   mode={"edit"} 
                   name="image" 
                   imageUrl = {(id && typeof values.image === "string") ? values.image : "" } 
                   handleSubmit={(f,e) => this.handleImageFile("image", f, e)}/>

                  <FormHelperText error={errors.image ? true : false}>
                  {errors.image}
                </FormHelperText>
                </FormControl>
                </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Status<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="status" className={classes.selectLabel}>
                    Status
                  </InputLabel>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={values.status || ""}
                    name="status"
                    onChange={(event) => this.handleChange(event)}
                    inputProps={{
                      name: "status",
                      id: "status"
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{ root: classes.selectMenuItem }}
                    >
                      Status
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="Active"
                    >
                      {" "}
                      Active
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="Inactive"
                    >
                      {" "}
                     In Active
                    </MenuItem>
                  </Select>
                  <FormHelperText error={errors.status ? true : false}>
                    {errors.status}
                  </FormHelperText>
                </FormControl>
                </GridItem>
                </GridContainer>

                <Button
                  color="rose"
                  type="submit"
                  className={classes.registerButton}
                  disabled={errors.submitBtn}
                >
                  {id ? "Update" : "Submit"}
                </Button>
                <Button
                  className={classes.roomTypeCancelBtn}
                  onClick={() => this.cancelButtonClick()}
                >
                 Cancel
                </Button>
              </form>
            </CardBody>
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
        </GridItem>
      </GridContainer>
    );
  }
}
var reasons = compose(
  graphql(GET_ADMIN_REASONS, {name: "reasonsInfo"}),
  graphql(UPDATE_REASON, {name: "updateReason"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
  graphql(GET_LANGUAGES, {name: "getLanguages"}),
  graphql(GET_CURRENCIES, {name: "currencyInfo"})
)(ReasonInfo);

export default withStyles(styles)(reasons);
