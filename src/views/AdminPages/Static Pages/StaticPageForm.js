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
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";

import FormLabel from "@material-ui/core/FormLabel";

import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import {GET_STATIC_PAGES,UPDATE_STATIC_PAGES, UPDATE_TOGGLE_STATUS,GET_LANGUAGES} from "../../../queries";
import CKEditor from "react-ckeditor-component";
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

let config = {
  toolbarGroups: [
    { name: "document", groups: ["mode", "document", "doctools"] },
    {
      name: "editing",
      groups: ["find", "selection", "spellchecker", "editing"]
    },
    { name: "forms", groups: ["forms"] },
    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
   
    "/",
    { name: "links", groups: ["links"] },
    { name: "styles", groups: ["styles"] },
    //{ name: "insert", groups: ["insert"] },
    { name: "colors", groups: ["colors"] },
    { name: "tools", groups: ["tools"] },
    "/",
    { name: "clipboard", groups: ["clipboard", "undo"] },
    { name: "others", groups: ["others"] },
    { name: "about", groups: ["about"] }
  ],
  
//   //fontSize_sizes: "16/16px;24/24px;48/48px;",
//  // font_names:
//     "Arial/Arial, Helvetica, sans-serif;" +
//     "Times New Roman/Times New Roman, Times, serif;" +
//     "Verdana",
    allowedContent: true
};

/**
|----------------------------------------------------------------------------------------
| Starting class component
|----------------------------------------------------------------------------------------
*/
class StaticPageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLanguages: [],
      values: {
        status: "",
        langCode: "en",
        title: "",
        content:""
      },
      properties: { langCode: "en", title: "", content: "" },
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
      displayForm: false
    };
    this.onChange = this.onChange.bind(this);
  }
  /**
|----------------------------------------------------------------------------------------
| Check id exists - if exist then form will act as update form otherwise act as add form
|----------------------------------------------------------------------------------------
*/
  async componentDidMount() {
    await this.getStaticPageData();
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

getStaticPageData = () => {
  let {getAdminStaticPageDetails, match} = this.props;
  let id = match.params.id;
  getAdminStaticPageDetails.refetch({}).then(({data}) => {
      if(id && data){
       let test = data.getAdminStaticPageDetails;
        let getStatic = test.map((statical, key) => {
           return statical;
          })

        let responseData = getStatic.find((cat) => {
            return cat.id === match.params.id;
          })

        let res = responseData.language.map((lang) => {
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
          values:{ ...englishProperty[0], ...responseData },
          properties:englishProperty[0],
          selectedLangData:res,
          selectedLanguage
        });
      }
     });
  }
 
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
  if (properties && properties.title && properties.langCode && properties.content) {
    if (properties.langCode !== currentLang) {
      const nextState = [...selectedLanguage, properties.langCode];
      const prevValues = {...values};
      const prevProps = {...properties};
      this.setState({
        selectedLanguage: nextState,
        selectedLangData: [...selectedLangData, properties],
        currentLang: properties.langCode,
        disableLang: false,
        values: { ...values, langCode: "", title: "", content: "" },
        properties: {
          ...properties,
          langCode: "",
          title: "",
          content: ""
        }
      });
      if(totalLanguages.length-1  === selectedLanguage.length){
        this.setState({
          displayForm  : true,
          values: prevValues, 
          properties: prevProps
      });
   }
    } else if (properties && properties.langCode === currentLang && properties.content) {
      let selectedProperty = selectedLangData.filter(
        (o) => o.langCode !== currentLang
      );
      this.setState({
        selectedLangData: [...selectedProperty, properties],
        currentLang: currentLang === "en" ? "" : properties.langCode,
        disableLang: false,
        values: { ...values, langCode: "", title: "", content: "" },
        properties: {
          ...properties,
          langCode: "",
          title: "",
          content: ""
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
updateStaticPagesData = async (id) => {
  let { values, selectedLangData, properties,imageLink } = this.state;
  let finalArray = [];
  this.validate({ values });
  if (values.title && values.title.trim() !== "" && values.langCode) {
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
        title: item.title.trim(),
        content: item.content ? item.content.trim() : ""
      };
    });

    // if(values.isFeatured == "true"){
    //   values.isFeatured = true
    // }else{
    //   values.isFeatured = false
    // }
    
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
            language: finalArray,
          } 
       };
  }
  if (
    values.status &&
    values.title &&
    values.langCode 
  ) {
    
    if(REACT_APP_EDIT_MODE !== "prod"){
      this.props.updateStaticPages({
        variables
      }).then(async ({data}) => {
        if (data) {
          this.props.updateToggle({variables: { 
            toggleStatus: true,
            message: id
            ? "Static Pages Updated Successfully"
            : "Static Pages Added Successfully"
          }});
          this.props.history.push("/admin/staticPages");
        }
      }).catch((error) => {
        console.log(error);
        this.setState({
          popUpDetails: error.graphQLErrors.map((x) => x.message)
        });
      });
    }else{
    this.props.updateToggle({variables: { 
      toggleStatus: true,
      message: "Add/Edit Restricted for Live" 
    }});
    this.props.history.push("/admin/staticPages");
  }
}
};
  /**
|----------------------------------------------------------------------------------------
| Add all room type details for Add new form after clicking submit 
|----------------------------------------------------------------------------------------
*/

addStaticPagesData = async () => {
  let { values, selectedLangData, properties } = this.state;
  this.validate({ values });
  let finalArray = [];
  if (values.title && values.title.trim() !== "" && values.langCode) {
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
          title: item.title.trim(),
          content: item.content ? item.content.trim() : ""
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
      status: values.status,
      language: finalArray
    } 
  };
  if (
    values.status &&
    values.title &&
    values.langCode 
  ) {
    if(REACT_APP_EDIT_MODE !== "prod"){
    this.props.updateStaticPages({
      variables
    }).then(async ({data}) => {
    if (data) {
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message: "StaticPages Added Successfully"
      }});
      this.props.history.push("/admin/staticPages");
    }
  }).catch((error) => {
    this.setState({
      popUpDetails: error.graphQLErrors.map((x) => x.message)
    });
   });
    }
    else{
      this.props.updateToggle({variables: { 
        toggleStatus: true,
        message: "Add/Edit Restricted for Live" 
      }});
      this.props.history.push("/admin/staticPages");
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
  if (name === "langCode" || name === "title" ) {
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
  let id = this.props.match.params.id;
  if (id) {
    this.updateStaticPagesData(id);
  } else {
    this.addStaticPagesData();
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
    this.props.history.push("/admin/staticPages");
  };

  /**
  |--------------------------------------------------
  | Validate each field
  |--------------------------------------------------
  */
 validate = ({ values, fieldName, typeData }) => {
  const { status,langCode,title,content } = values;
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
    if (fieldName === "langCode") {
      if (!langCode) {
        errors.langCode = "Language is required";
        errors.submitBtn = true;
        this.setState({ errors , disableLang: true });
      } else if (errors && errors.langCode !== "" && langCode) {
        delete errors.langCode;
        this.setState({ errors , disableLang: false });
      }
    }
    if (fieldName === "title") {
      if (!title || title.trim() === "") {
        errors.title = "Title is required";
        errors.submitBtn = true;
        this.setState({ errors , disableLang: true });
      } else if (errors && errors.title !== "" && title) {
        delete errors.title;
        this.setState({ errors , disableLang: false });
      }
    }
    if (fieldName === "content") {
        if (!content || content.trim() === "") {
          errors.content = "Content is required";
          errors.submitBtn = true;
          this.setState({ errors , disableLang: true });
        } else if (errors && errors.content !== "" && content) {
          delete errors.content;
          this.setState({ errors , disableLang: false });
        }
      }
    if (status && title && langCode && content) {
      errors.submitBtn = false;
      this.setState({ errors , disableLang: false });
    }
  } else if (typeData === "langValid") {
    if (!langCode) {
      errors.langCode = "Language is required";
      errors.submitBtn = true;
      this.setState({
        errors ,
        disableLang: true,
        addLanguage: true
      });
    } else if (errors && errors.langCode !== "" && langCode) {
      delete errors.langCode;
      this.setState({ errors , disableLang: false });
    }
    if (!title || title.trim() === "") {
      errors.title = "Title is required";
      errors.submitBtn = true;
      this.setState({
        errors ,
        disableLang: true,
        addLanguage: true
      });
    } else if (errors && errors.title !== "" && title) {
      delete errors.title;
      this.setState({ errors , disableLang: false });
    }
    if (!content || content.trim() === "") {
        errors.content = "Content is required";
        errors.submitBtn = true;
        this.setState({
          errors ,
          disableLang: true,
          addLanguage: true
        });
      } else if (errors && errors.content !== "" && content) {
        delete errors.content;
        this.setState({ errors , disableLang: false });
      }
    if (title && langCode && content) {
      errors.submitBtn = false;
      this.setState({ errors, disableLang: false });
    }
  } else {
    if (!langCode) {
      errors.langCode = "Language is required";
      errors.submitBtn = true;
      this.setState({ errors, disableLang: true });
    }
    if (!title) {
      errors.title = "Title is required";
      errors.submitBtn = true;
      this.setState({ errors, disableLang: true });
    }
    if (!status) {
      errors.status = "Status is required";
      errors.submitBtn = true;
      this.setState({ errors });
    }
    if (!content) {
        errors.content = "Content is required";
        errors.submitBtn = true;
        this.setState({ errors });
      }
    if ( status && title && content && langCode && properties.langCode && properties.title && properties.content) {
      // errors.submitBtn = false;
      this.setState({ errors, disableLang: false });
    }
  }
  return errors;
};

onChange(evt) {
    let {values} = this.state;
    let statValues = values;
    var html = evt.editor.getData();
    let name = "content";
    statValues[name] = html;
    let propValues = {};
    propValues = html;
    let val= {
      ...this.state.values,
      content:propValues
    };
    this.setState({
      properties: {
        ...this.state.properties,
       content:propValues
      }
    });
    this.validate({ values: val, fieldName: name });
    this.setState({ values: val});
    
  }


  onBlur(evt) {
    //console.log("onBlur event called with event info: ", evt);
  }

  afterPaste(evt) {
    //  console.log("afterPaste event called with event info: ", evt);
  }


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
                  ? "Edit Static Pages"
                  : "Add Static Pages" }
              </h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={this.handleSubmit}>
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
                    Choose Language<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={10}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel
                    htmlFor="langCode"
                    className={classes.selectLabel}
                  >
                    {/* Choose Language* */}
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
                    Title<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                <CustomInput
                  id="title"
                  formControlProps={{ fullWidth: true }}
                  error={errors.title ? true : false}
                  helperText={errors.title}
                  inputProps={{
                    name: "title",
                    onChange: this.handleChange,
                    value: properties ? properties.title : "",
                    autoComplete: "off"
                  }}
                />
                 <FormHelperText error={errors.title ? true : false}>
                    {errors.title}
                  </FormHelperText>
                  </GridItem>
                  </GridContainer>
             
                {/* <CKEditor
                onBeforeLoad={ ( CKEDITOR ) => ( CKEDITOR.disableAutoInline = true ) }
                data={properties ? properties.content : ""}
                /> */}
                  <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    {/* Description */}
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>

                  
              <FormControl fullWidth className={classes.selectFormControl}>
                <CKEditor 
                    activeClass="p10"
                    config={config}
                    content={properties ? properties.content : "" } 
                    events={{
                        "blur": this.onBlur,
                        "afterPaste": this.afterPaste,
                        "change": this.onChange
                    }}
                    />
                 <FormHelperText error={errors.content ? true : false}>
                    {errors.content}
                  </FormHelperText>
                  </FormControl>
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
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
var staticForm = compose(
  graphql(GET_STATIC_PAGES, {name: "getAdminStaticPageDetails"}),
  graphql(UPDATE_STATIC_PAGES, {name: "updateStaticPages"}),
  graphql(GET_LANGUAGES, {name: "getLanguages"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(StaticPageForm);

export default withStyles(styles)(staticForm);
