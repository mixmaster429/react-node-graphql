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
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import {GET_ADMIN_CATEGORIES, GET_LANGUAGES, UPDATE_TOGGLE_STATUS, GET_ADMIN_METAS, ADD_METATAGS} from "../../../queries";

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
class ServiceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLanguages: [],
      values: {
        status: "",
        langCode: "en",
        pageTitle: "",
        metaDescription: "",
        keywords:"",
       // categories:[]
       pageUrl:""
      },
      properties: { langCode: "en", pageTitle: "", metaDescription: "",  keywords:""},
      selectedLangData: [],
      errors: {
        submitBtn: false
      },
      notifyclr: "rose",
      message: "",
      messageOpen: false,
      selectedLanguage: ["en"],
      currentLang: "en",
      addLanguage: false,
      disableLang: false,
      displayForm: false
  
    };
  }
  /**
|----------------------------------------------------------------------------------------
| Check id exists - if exist then form will act as update form otherwise act as add form
|----------------------------------------------------------------------------------------
*/
  async componentDidMount() {
    await this.getMetaData();
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
getMetaData = () => {
  let {getAdminMetatags, match} = this.props;
  let id = match.params.id;
  getAdminMetatags.refetch({fetch:"all"}).then(({data}) => {
   // console.log( id && data)
    if(id && data){
        let test = data.getAdminMetatags;
         let getFeatured = test.map((feature, key) => {
            return feature;
           })
         let responseData = getFeatured.find((cat) => {
             return cat.id === match.params.id;
           })
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
           //imageLink: responseData.image
         });
       }
     });
  }
 
  /**
|----------------------------------------------------------------------------------------
| Tags Action
|----------------------------------------------------------------------------------------
*/

// handleTagsChange = tags =>{
//   let {properties,values} = this.state;
//   let statValues = values;
//   let name = "categories";
//   statValues[name] = tags;
//       let propValues = {};
//       propValues = tags
//       let val= {
//         ...this.state.values,
//         categories:propValues
//       }
//       this.setState({
//         properties: {
//           ...this.state.properties,
//          categories:propValues
//         }
//       });
//       this.validate({ values: val, fieldName: name });
//       this.setState({ values: val});

// }


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
  if (properties && properties.pageTitle && properties.langCode) {
    if (properties.langCode !== currentLang) {
      const nextState = [...selectedLanguage, properties.langCode];
      const prevValues = {...values};
      const prevProps = {...properties};
      this.setState({
        selectedLanguage: nextState,
        selectedLangData: [...selectedLangData, properties],
        currentLang: properties.langCode,
        disableLang: false,
        values: { ...values, langCode: "", pageTitle: "", metaDescription: "" , keywords:""},
        properties: {
          ...properties,
          langCode: "",
          pageTitle: "",
          metaDescription: "",
          keywords:""
         // categories:[]
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
        values: { ...values, langCode: "", pageTitle: "", metaDescription: "",  keywords:"" },
        properties: {
          ...properties,
          langCode: "",
          pageTitle: "",
          metaDescription: "",
          keywords:""
         // categories:[]
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
      : { langCode: "", pageTitle: "", metaDescription: "",  keywords:""};
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
updateMetaData = async (id) => {
  let { values, selectedLangData, properties } = this.state;
  let finalArray = [];
  this.validate({ values });
  if (values.pageTitle && values.pageTitle.trim() !== "" && values.langCode) {
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
        pageTitle: item.pageTitle,
        keywords: item.keywords,
        metaDescription: item.metaDescription ? item.metaDescription : ""
        //categories:item.categories
      };
    });

    // if(values.isFeatured == "true"){
    //   values.isFeatured = true
    // }else{
    //   values.isFeatured = false
    // }
    
    let variables = {
          id : Number(id),
          data:{
            pageUrl: values.pageUrl,
            language: finalArray
          } 
  };
  if (
    values.pageTitle &&
    values.langCode
  ) {
    this.props.updateMetatags({
      variables
    }).then(async ({data}) => {
    if (data) {
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message: id
        ? "Metas Updated Successfully"
        : "Metas Added Successfully"
      }});
      this.props.history.push("/admin/MetasList");
    }
  }).catch((error) => {
    this.setState({
      popUpDetails: error.graphQLErrors.map((x) => x.message)
    });
   });
  }
};
  /**
|----------------------------------------------------------------------------------------
| Add all room type details for Add new form after clicking submit 
|----------------------------------------------------------------------------------------
*/

addMetaData = async () => {
  let { values, selectedLangData, properties } = this.state;
  this.validate({ values });
  let finalArray = [];
  if (values.pageTitle && values.pageTitle !== "" && values.langCode) {
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
          pageTitle: item.pageTitle,
          metaDescription: item.metaDescription ? item.metaDescription : "",
          keywords: item.keywords ? item.keywords : "",
         // categories:item.categories
        };
      });
  }

  // if(values.isFeatured == "true"){
  //   values.isFeatured = true
  // }else{
  //   values.isFeatured = false
  // }

  let variables = {
    data:{
      pageUrl: values.pageUrl,
      language: finalArray
    } 
  };
  if (
    values.pageUrl &&
    values.pageTitle
  ) {
    this.props.updateMetatags({
      variables
    }).then(async ({data}) => {
    if (data) {
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message: "Metas Added Successfully"
      }});
      this.props.history.push("/admin/MetasList");
    }
  }).catch((error) => {
    this.setState({
      popUpDetails: error.graphQLErrors.map((x) => x.message)
    });
   });
  }
};

  /**
|----------------------------------------------------------------------------------------
| Works after chaning individual fields
|----------------------------------------------------------------------------------------
*/
handleChange = (event) => {
  const { values } = this.state;
  let statValues = values;
  let name = event.target.name;
  statValues[name] = event.target.value;
  if (name === "langCode" || name === "pageTitle" || name === "metaDescription" || name === "keywords" || name === "pageUrl" ) {
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
handleSubmit = (e) => {
  e.preventDefault();
  let { errors } = this.state;
  errors.submitBtn = true;
  this.setState({
    errors
  });
  let id = this.props.match.params.id;
  if (id) {
    this.updateMetaData(id);
  } else {
    this.addMetaData();
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
    this.props.history.push("/admin/MetasList");
  };

  /**
  |--------------------------------------------------
  | Validate each field
  |--------------------------------------------------
  */
 
 validate = ({ values, fieldName, typeData }) => {
    const { langCode, pageTitle,pageUrl } = values;
    const { properties } = this.state;
    let { errors } = this.state;
    if (fieldName) {
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
      if (fieldName === "pageTitle") {
        if (!pageTitle) {
          errors.pageTitle = "pageTitle is required";
          errors.submitBtn = true;
          this.setState({ errors, disableLang: true });
        } else if (errors && errors.pageTitle !== "" && pageTitle) {
          delete errors.pageTitle;
          this.setState({ errors, disableLang: false });
        }
      }
      if (pageTitle && langCode && pageUrl) {
        errors.submitBtn = false;
        this.setState({ errors, disableLang: false });
      }
    }
    
    else if (typeData === "langValid") {
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
      if (!pageTitle || pageTitle.trim() === "") {
        errors.pageTitle = "pageTitle is required";
        errors.submitBtn = true;
        this.setState({
          errors,
          disableLang: true,
          addLanguage: true
        });
      } else if (errors && errors.pageTitle !== "" && pageTitle) {
        delete errors.pageTitle;
        this.setState({ errors, disableLang: false });
      }
      if (pageTitle && langCode) {
        errors.submitBtn = false;
        this.setState({ errors, disableLang: false });
      }
    }
    
    else {
      if (!langCode) {
        errors.langCode = "Language is required";
        errors.submitBtn = true;
        this.setState({ errors, disableLang: true });
      }
      if (!pageTitle) {
        errors.pageTitle = "pageTitle is required";
        errors.submitBtn = true;
        this.setState({ errors});
      }
     
      if (
        pageTitle &&
        langCode &&
        properties.langCode &&
        properties.pageTitle 
      
      ) {
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
    const { values,errors,properties,disableLang,selectedLanguage,selectedLangData,totalLanguages,addLanguage,displayForm } = this.state;

    const { classes,match} = this.props;
    const id = match.params.id;
    let filteredLang = totalLanguages.filter(
        (o) => !selectedLanguage.includes(o.value)
    );
    return (
      <div className="serviseadmin"> 
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
                  ? "Edit Metas"
                  : "Add Metas" }
              </h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={(e) => this.handleSubmit(e)}>
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
                    Page title<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                <CustomInput
                 
                  id="pageTitle"
                  formControlProps={{ fullWidth: true }}
                  error={errors.pageTitle ? true : false}
                  helperText={errors.pageTitle}
                  inputProps={{
                    name: "pageTitle",
                    onChange: this.handleChange,
                    value: properties ? properties.pageTitle : "",
                    autoComplete: "off"
                  }}
                />
                 <FormHelperText error={errors.pageTitle ? true : false}>
                    {errors.pageTitle}
                  </FormHelperText>
                  </GridItem>
                  </GridContainer>

                  <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Meta description
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                <CustomInput
                  
                  id="metaDescription"
                  formControlProps={{ fullWidth: true }}
                  error={errors.metaDescription ? true : false}
                  helperText={errors.metaDescription}
                  inputProps={{
                    name: "metaDescription",
                    onChange: this.handleChange,
                    value: properties ? properties.metaDescription : "",
                    autoComplete: "off"
                  }}
                />
                 </GridItem>
               
               </GridContainer>

               <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Keywords
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                <CustomInput
                  id="keywords"
                  formControlProps={{ fullWidth: true }}
                  error={errors.keywords ? true : false}
                  helperText={errors.keywords}
                  inputProps={{
                    name: "keywords",
                    onChange: this.handleChange,
                    value: properties ? properties.keywords : "",
                    autoComplete: "off"
                  }}
                />
                <FormHelperText error={errors.keywords ? true : false}>
                    {errors.keywords}
                  </FormHelperText>
                  </GridItem>
               
               </GridContainer>
               <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    {/* Keywords */}
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
                    Page Url<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                <div className={match.params.id ? "disabledEditurl" : ""}>
                <CustomInput
                  id="pageUrl"
                  formControlProps={{ fullWidth: true }}
                  error={errors.pageUrl ? true : false}
                  helperText={errors.pageUrl}
                  inputProps={{
                    name: "pageUrl",
                    onChange: this.handleChange,
                    value: values.pageUrl,
                    autoComplete: "off"
                  }}
                />
                 <FormHelperText error={errors.pageUrl ? true : false}>
                    {errors.pageUrl}
                  </FormHelperText>
                  </div>
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
          </Card>
        </GridItem>
      </GridContainer>
      </div>
    );
  }
}
var serviceAction = compose(
  graphql(GET_ADMIN_CATEGORIES, {
     name: "categoriesInfo", options: () => ({variables: {fetch: "all"}})
  }),

  graphql(GET_ADMIN_METAS, {name: "getAdminMetatags",options: () => ({variables: {fetch: "all"}})}),
  graphql(ADD_METATAGS, {name: "updateMetatags"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
  graphql(GET_LANGUAGES, {name: "getLanguages"}),
)(ServiceInfo);

export default withStyles(styles)(serviceAction);
