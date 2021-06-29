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
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardText from "../../../components/Card/CardText.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import ImageUpload from "../../../components/CustomUpload/ImageUpload.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import {ADD_CATEGORY,GET_FILTERS ,GET_ADMIN_CATEGORIES, GET_LANGUAGES, UPDATE_TOGGLE_STATUS} from "../../../queries";
import ParentTreeView from "./ParentTreeView"
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
     // backgroundColor: "#218698",
    
      height: 20,
      width: 20,
      padding: 0,
      top: -5,
      borderRadius: 50,
      fontSize:9,
      backgroundColor: "#f54a61",
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
class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLanguages: [],
      values: {
        status: "",
        image: "",
        isFeatured: "",
        langCode: "en",
        name: "",
        description: "",
        allFilterId:[],
        allIsMandatory:[]
      },
      properties: { langCode: "en", name: "", description: "" },
      selectedLangData: [],
      popUpDetails: [],
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
      displayForm: false,
      filterTableData:[],
    };
  }
  /**
|----------------------------------------------------------------------------------------
| Check id exists - if exist then form will act as update form otherwise act as add form
|----------------------------------------------------------------------------------------
*/
  async componentDidMount() {
    await this.getCategoryDetailsData();
    await this.getAllLanguagesData();
    await this.getFilterData();
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

//Filter Data for category options
getFilterData = () => {
  let {getFilters} = this.props;
  getFilters.refetch().then(({data}) => {
    if(data && data.getFilters){
      this.setState({
        filterTableData : data.getFilters
      })
    }
  })
}
  /**
|----------------------------------------------------------------------------------------
| Get all existing category details for update form - if id exist
|----------------------------------------------------------------------------------------
*/
getCategoryDetailsData = () => {
  let {categoriesInfo, match} = this.props;
  let id = match.params.id;
  categoriesInfo.refetch().then(({data}) => {
    if(id && data){
      var getCategory = data.getAdminCategoryDetails.find((cat) => {
        return Number(cat.id) === Number(id);
      });
      let res = getCategory.language.map((lang) => {
        return lang;
     })

    let englishProperty = res.filter(
      (x) => x.langCode === "en"
    );
      let selectedLanguage = [];
      res && res.map((item) => {
         return selectedLanguage.push(item.langCode);
      });
      this.setState({
        values:{ ...englishProperty[0], ...getCategory },
        properties:englishProperty[0],
        selectedLangData:res,
        selectedLanguage,
        imageLink: getCategory.image
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
      })
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
    } else if (properties.langCode === currentLang) {
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
  //let cLang = getLangCode && getLangCode.length > 0 ? 
  this.setState({
    currentLang:langCode,
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
updateCategoryData = async (id) => {
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
          isFeatured: values.isFeatured,
          language: finalArray,
          allFilterId: values.allFilterId,
          allIsMandatory: values.allIsMandatory
        } 
      };
    } else {
      variables = {
          id : Number(id),
          data:{
            status: values.status,
            isFeatured: values.isFeatured,
            image: values.image,
            language: finalArray,
            allFilterId: values.allFilterId,
            allIsMandatory: values.allIsMandatory
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
    this.props.updateCategory({
      variables
    }).then(async ({data}) => {
    if (data.updateCategory) {
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message: "Category Updated Successfully"
      }});
      this.props.history.push("/admin/categories");
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
};
  /**
|----------------------------------------------------------------------------------------
| Add all room type details for Add new form after clicking submit 
|----------------------------------------------------------------------------------------
*/

addCategoryData = async () => {
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
      isFeatured: values.isFeatured,
      image: values.image,
      language: finalArray,
      allFilterId: values.allFilterId,
      allIsMandatory: values.allIsMandatory
    } 
  };
  if (
    values.status &&
    values.image &&
    values.name &&
    values.langCode
  ) {
    if(REACT_APP_EDIT_MODE !== "prod"){
    this.props.updateCategory({
      variables
    }).then(async ({data}) => {
    if (data.updateCategory) {
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message: "Category Added Successfully"
      }});
      this.props.history.push("/admin/categories");
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
  if (name === "langCode" || name === "description" || name === "name"
  || name === "isFeatured") {
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
    this.updateCategoryData(id);
  } else {
    this.addCategoryData();
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
    this.props.history.push("/admin/categories");
  };

  /**
  |--------------------------------------------------
  | Validate each field
  |--------------------------------------------------
  */
 validate = ({ values, fieldName, typeData }) => {
  const { status, image, langCode, name } = values;
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
   
    if (status  && image && name && langCode) {
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
  } 

  else {
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
  
 
    if ( status && image && name && langCode && properties.langCode && properties.name) {
      // errors.submitBtn = false;
      this.setState({ errors, disableLang: false });
    }
  }
  return errors;
};

handleCheck = (index) => {
  let {match} = this.props;
  let {values:{allFilterId}} = this.state;
  const id = match.params.id;
  const getValue = allFilterId && allFilterId.some( selected_index => index === selected_index ) ? allFilterId.filter( i => i !== index) : allFilterId && allFilterId.concat([index]);
  this.setState({
    values:{
      ...this.state.values,
      allFilterId: getValue
    }
  });
  if(id){
    this.setState({
      values:{
        ...this.state.values,
        allFilterId : getValue
      },
       editData: Object.assign({}, this.state.editData, id && { values: { allFilterId: getValue }}) 
      });
  }
}

handleSelectMandatory = (index) => {
  let {match} = this.props;
  let {values:{allIsMandatory}} = this.state;
  const id = match.params.id;
  const mandatoryValue = allIsMandatory && allIsMandatory.some( selected_index => index === selected_index ) ? allIsMandatory.filter( i => i !== index) : allIsMandatory && allIsMandatory.concat([index]);
    this.setState({
      values:{
        ...this.state.values,
        allIsMandatory: mandatoryValue
      }
    });
  if(id){
    this.setState({ 
      values:{
      ...this.state.values,
      allIsMandatory: mandatoryValue 
    }, 
      editData: Object.assign({}, this.state.editData, id && { values: {allIsMandatory: mandatoryValue }})
  })
}
}


  /**
|----------------------------------------------------------------------------------------
| Render starts for the page
|----------------------------------------------------------------------------------------
*/
  render() {
    const { values, errors, popUpDetails,properties,disableLang,selectedLanguage,selectedLangData,totalLanguages, addLanguage,displayForm,filterTableData } = this.state;
    const { classes, match} = this.props;
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
          <CardHeader color="rose" text>
        <CardText color="rose">
        <h4 className={classes.cardTitle}>{id ? "Edit Category" : "Add Category"}</h4>
        </CardText>
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
                    Category Name<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>
                <CustomInput
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
                  {/* <FormHelperText error={errors.description ? true : false}>
                    {errors.description}
                  </FormHelperText> */}

                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    {/* Description */}
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>
                  
                 {
                  filteredLang && filteredLang.length > 0 &&
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
                }
                </GridItem>
               </GridContainer>
                
                </> }
                
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Choose Featured
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>
                 <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel
                    htmlFor="isFeatured"
                    className={classes.selectLabel}
                  >
                   Choose Featured
                  </InputLabel>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={values.isFeatured}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "isFeatured",
                      id: "isFeatured"
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{ root: classes.selectMenuItem }}
                    >
                     Choose Featured
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={true}
                    >
                      Yes
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={false}
                    >
                      No
                    </MenuItem>
                  </Select>
                  <FormHelperText error={errors.isFeatured ? true : false}>
                    {errors.isFeatured}
                  </FormHelperText>
                </FormControl>
                </GridItem>
                </GridContainer>
          
                <GridContainer>
                <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    <FormLabel className={classes.labelHorizontal}>
                    Status<span className="validatcolor">*</span>
                    </FormLabel>
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

                <GridContainer>
                <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Image<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

              <FormControl fullWidth className={classes.selectFormControl + " " + "langupload"}>
                 
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
                  Choose Filter attributes
                </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <div className="cls_tablescroll">
                    <table id="FilterTable"  className="table table-bordered table-striped">
                      <thead>
                         <tr> <th> Options</th>
                              <th> Mandatory </th>
                              <th> Filter Name </th>
                              <th> Filter Type </th>
                              <th> Values </th>
                          </tr>
                          </thead>
                          <tbody>
                          <>
                          { filterTableData.length > 0 && filterTableData.map((data, index) => {
                              const { id, name, inputTag,values,max,min } = data
                            let array_data = values.filter(x => (x.valueParent !== null)).map(z => {
                                  return z
                              })
                              return (
                                  <tr key={id}>
                                    <td>
                                      <FormControlLabel
                                          control={
                                            <Checkbox
                                              id="filter"
                                              checked={this.state.values.allFilterId ? this.state.values.allFilterId.some(selected_index => (id) == selected_index ) : ""}
                                              value={this.state.values.allFilterId ? this.state.values.allFilterId : ""}
                                              onChange={(e) => this.handleCheck(parseInt(id))}
                                              iconStyle={{fill: '#e91e63'}}
                                            />
                                        }/>
                                   </td>
                                    <td>   
                                      <FormControlLabel
                                      control={
                                        <Checkbox
                                          id="mandatory"
                                          checked={this.state.values.allIsMandatory ? this.state.values.allIsMandatory.some(selected_index => (id) == selected_index ) : ""}
                                          value={this.state.values.allIsMandatory ? this.state.values.allIsMandatory : ""}
                                          onChange={(e) => this.handleSelectMandatory(parseInt(id))}
                                          iconStyle={{fill: '#e91e63'}}
                                        />
                                      }
                                  /></td>
                                    <td>{name}</td>
                                    <td>{inputTag}</td>
                                    {inputTag === "range" ? <td> {`${min} ; ${max}`} </td> : ""}
                                    {inputTag === "dropdown" ?  <td> {values[0].valueChild.join(" | ")} </td>: ""}
                                    { inputTag === "multilevel" ? <td>{ <ParentTreeView  data={array_data}/> }</td> : ""}  
                                  </tr>
                              )
                            })
                          }
                            </>
                      </tbody>    
                    </table>
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
var categoryAction = compose(
  graphql(GET_ADMIN_CATEGORIES, {name: "categoriesInfo"}),
  graphql(GET_FILTERS, {name: "getFilters"}),
  graphql(ADD_CATEGORY, {name: "updateCategory"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
  graphql(GET_LANGUAGES, {name: "getLanguages"}),
)(Category);

export default withStyles(styles)(categoryAction);
