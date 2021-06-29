import React from "react";
import { compose, graphql } from "react-apollo";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";

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

import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import ImageUpload from "../../../components/CustomUpload/ImageUpload.jsx";
// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import {GET_CURRENCIES, GET_ADMIN_FILTER, GET_LANGUAGES, UPDATE_TOGGLE_STATUS,UPDATE_FILTER, CATE_LANG_REFETCH } from "../../../queries";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import FormLabel from "@material-ui/core/FormLabel";
const { REACT_APP_EDIT_MODE } = process.env;
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
      fontSize: 9,
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
        style={bntEff.three}
        onClick={onClick}
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
class FilterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLanguages: [],
      valuesInfo: {
        status: "",
        image: "",
        langCode: "en",
        inputTag:"",
        name: "",
        values:[{ valueParent: "", valueChild: [] }],
        min:"",
        max:""
      },
      properties: { 
        langCode: "en", 
        name: "", 
        description: "",
        values: [{ valueParent: "", valueChild: [] }] 
      },
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
      currencyList: [],
      displayForm: false,
      popUpDetails: []
    };
  }

  /**
|----------------------------------------------------------------------------------------
| Check id exists - if exist then form will act as update form otherwise act as add form
|----------------------------------------------------------------------------------------
*/
  async componentDidMount() {
    await this.getFilterData();
    await this.getAllLanguagesData();
  }

  
  /**
|----------------------------------------------------------------------------------------
| Get all language details from API
|----------------------------------------------------------------------------------------
*/
  getAllLanguagesData = () => {
    let { getLanguages } = this.props;
    getLanguages.refetch({}).then(({ data }) => {
      if (data) {
        let langData = data && data.getLanguages;
        this.setState({
          totalLanguages: langData
        })
      }
    })
  }

  /**
|----------------------------------------------------------------------------------------
| Get all existing category details for update form - if id exist
|----------------------------------------------------------------------------------------
*/
  getFilterData = () => {
    let {getAdminFilter, match} = this.props;
    let id = match.params.id;
      getAdminFilter.refetch().then(({data}) => {
        if(id && data){
         let test = data.getAdminFilter;
          let getFilter = test.map((z, key) => {
             return z;
            })

          let responseData = getFilter.find((cat) => {
              return cat.id === match.params.id;
            })

          let res = responseData.language.map( (lang) => {
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
            valuesInfo:{ ...englishProperty[0], ...responseData },
            properties: englishProperty[0],
            selectedLangData:res,
            selectedLanguage,
            imageLink: responseData.image
          });
        }
       })
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
      valuesInfo,
      totalLanguages
    } = this.state;
    let typeData = "langValid";
    this.validate({valuesIn:valuesInfo, typeData });
    if (properties && properties.name && properties.langCode && valuesInfo.inputTag) {
      if (properties.langCode !== currentLang) {
        const nextState = [...selectedLanguage, properties.langCode];
        const prevValues = { ...valuesInfo };
        const prevProps = { ...properties };
        this.setState({
          selectedLanguage: nextState,
          selectedLangData: [...selectedLangData, properties],
          currentLang: properties.langCode,
          disableLang: false,
          valuesInfo: { ...valuesInfo, langCode: "", name: ""},
          properties: {
            ...properties,
            langCode: "",
            name: "",
            values:[{ valueParent: "", valueChild: [] }]
          }
        });
        if (totalLanguages.length - 1 === selectedLanguage.length) {
          this.setState({
            displayForm: true,
            valuesInfo: prevValues,
            properties: prevProps
          });
        }
      } else if (properties && properties.langCode === currentLang && valuesInfo.inputTag) {
        let selectedProperty = selectedLangData.filter(
          (o) => o.langCode !== currentLang
        );
        this.setState({
          selectedLangData: [...selectedProperty, properties],
          currentLang: currentLang === "en" ? "" : properties.langCode,
          disableLang: false,
          valuesInfo: { ...valuesInfo, langCode: "", name: ""},
          properties: {
            ...properties,
            langCode: "",
            name: "",
            values:[{ valueParent: "", valueChild: [] }]
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
    const { totalLanguages, selectedLangData, valuesInfo } = this.state;
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
    let currentValues = { ...valuesInfo, ...propertyData };
    this.setState({
      currentLang: langCode,
      properties: propertyData,
      addLanguage: false,
      valuesInfo: { ...valuesInfo, ...propertyData },
      displayForm: false
    });
    this.validate({ valuesIn: currentValues, typeData: "langValid" });
  };
  /**
|----------------------------------------------------------------------------------------
| Action starts after clicking individual selected language - delete
|----------------------------------------------------------------------------------------
*/
  handleItemRemove = (item) => {
    let { selectedLanguage, selectedLangData, valuesInfo } = this.state;
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
      valuesInfo: { ...valuesInfo, ...propertyValue },
      displayForm: false
    });
  };

  /**
|----------------------------------------------------------------------------------------
| Update all existing room type details for update form after clicking update - if id exist
|----------------------------------------------------------------------------------------
*/
  updateFilterData = async (id) => {
    let { valuesInfo, selectedLangData, properties, imageLink } = this.state;
    let finalArray = [];
    this.validate({ valuesIn: valuesInfo });
    if (valuesInfo.name && valuesInfo.name.trim() !== "" && valuesInfo.langCode) {
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
        if(item && item.values && item.values.length > 0){
          item.values.map(data => {
            return delete data.__typename
          })
        }
        return delete item.__typename;
      });
    }

    // Remove duplicate objects in array

    var uniqueArray =
      selectedLangData &&
      selectedLangData.length > 0 &&
      selectedLangData.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });

    uniqueArray &&
      uniqueArray.length > 0 &&
      uniqueArray.map((item, index) => {
        return finalArray[index] = {
          langCode: item.langCode,
          name: item.name.trim(),
          values:item.values
        };
      });


    var variables;
    if(valuesInfo.inputTag === "range"){
      for (var key in finalArray) {
        finalArray[key]['values'] = []
      }

      variables = {
        id : Number(id),
        data: {
          status: valuesInfo.status,
          language: finalArray,
          inputTag: valuesInfo.inputTag,
          min: Number(valuesInfo.min),
          max: Number(valuesInfo.max)
        }
      };
    }else if(valuesInfo.inputTag === "dropdown"){
      variables = {
        id : Number(id),
        data: {
          status: valuesInfo.status,
          language: finalArray,
          inputTag: valuesInfo.inputTag
        }
      };
    }else if(valuesInfo.inputTag === "multilevel"){
      variables = {
        id : Number(id),
        data: {
          status: valuesInfo.status,
          language: finalArray,
          inputTag: valuesInfo.inputTag
        }
      };
    }
    if (
      valuesInfo.name &&
      valuesInfo.langCode &&
      valuesInfo.inputTag 
    ) {
      if (REACT_APP_EDIT_MODE !== "prod") {
        this.props.updateFilter({
          variables
        }).then(async ({ data }) => {
          if (data.updateFilter) {
            this.props.updateToggle({
              variables: {
                toggleStatus: true,
                message: "Filters Added Successfully"
              }
            });
             this.props.history.push("/admin/filters");
           }
        }).catch((error) => {
          this.setState({
            popUpDetails: error.graphQLErrors.map(x => x.message)
          });
        });
      }
      else {
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

  addFilterData = async () => {
    let { valuesInfo, selectedLangData, properties } = this.state;
   
    let finalArray = [];
    if (valuesInfo.name && valuesInfo.name.trim() !== "" && valuesInfo.langCode) {
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
      let uniqueArray = selectedLangData.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });
      uniqueArray &&
        uniqueArray.length > 0 &&
        uniqueArray.map((item, index) => {
          return finalArray[index] = {
            langCode: item.langCode,
            name: item.name.trim(),
            values:item.values
          };
        });
    }

  var variables;
    if(valuesInfo.inputTag === "range"){
      for (var key in finalArray) {
        finalArray[key]['values'] = []
      }
      variables = {
        data: {
          status: valuesInfo.status,
          language: finalArray,
          inputTag: valuesInfo.inputTag,
          min: Number(valuesInfo.min),
          max: Number(valuesInfo.max)
        }
      };
    }else if(valuesInfo.inputTag === "dropdown"){
      variables = {
        data: {
          status: valuesInfo.status,
          language: finalArray,
          inputTag: valuesInfo.inputTag
        }
      };
    }else if(valuesInfo.inputTag === "multilevel"){
      variables = {
        data: {
          status: valuesInfo.status,
          language: finalArray,
          inputTag: valuesInfo.inputTag
        }
      };
    }

    if (
      valuesInfo.name &&
      valuesInfo.langCode &&
      valuesInfo.inputTag 
    ) {
      if (REACT_APP_EDIT_MODE !== "prod") {
        this.props.updateFilter({
          variables
        }).then(async ({ data }) => {
          if (data.updateFilter) {
            this.props.updateToggle({
              variables: {
                toggleStatus: true,
                message: "Filters Added Successfully"
              }
            });
             this.props.history.push("/admin/filters");
           }
        }).catch((error) => {
          this.setState({
            popUpDetails: error.graphQLErrors.map((x) => x.message)
          });
        });
      } else {
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
    const { valuesInfo } = this.state;
    let statValues = valuesInfo;
    let name = event.target.name;
    statValues[name] = event.target.value;
    if (name === "langCode" || name === "name") {
      let propValues = {};
      propValues = {
        ...this.state.properties,
        [name]: event.target.value
      };
      this.validate({ valuesIn: statValues, fieldName: name });
      this.setState({
        properties: propValues,
        valuesInfo: statValues
      });

    }else if(name === "inputTag"){
        this.validate({ valuesIn: statValues, fieldName: name });
        this.setState({
          valuesInfo: {
            ...valuesInfo,
            inputTag: event.target.value,
            values:[{ valueParent: "", valueChild: [] }],
            min:"",
            max:""
          }
        });
    }
    else{
      this.validate({ valuesIn: statValues, fieldName: name });
      this.setState({
        valuesInfo: statValues
      });
    }
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
      this.updateFilterData(id);
    } else {
      this.addFilterData();
    }
  };

  onKeyPress = (event) => {
      if (event.which === 13) {
        event.preventDefault();
    }
  }

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
    this.props.history.push("/admin/filters");
  };

  /**
  |--------------------------------------------------
  | Validate each field
  |--------------------------------------------------
  */
  validate = ({ valuesIn, fieldName, typeData }) => {
    const { status,langCode,name,min,max,inputTag,values } = valuesIn;
    const { properties,errors,valuesInfo } = this.state;
   
    if(fieldName){
      if(fieldName === "name"){
        delete errors.name
        this.setState({ errors });
      }
      if(fieldName === "status"){
        delete errors.status
        this.setState({ errors });
      }

      if(fieldName === "inputTag"){
        delete errors.inputTag
        this.setState({ errors });
      }

      if(fieldName === "langCode"){
        delete errors.langCode
        this.setState({ errors });
      }

      if(inputTag === "dropdown"){
        if(properties.values && properties.values[0].valueChild.length === 0){
          errors.dropdown = "Dropdown values are required"
          errors.submitBtn = true;
          this.setState({ errors, disableLang: true, addLanguage: false });
        }
        else if(properties.values[0].valueChild.length > 0){
          delete errors.dropdown
          this.setState({ errors, disableLang: false, addLanguage: false });
          if(!status){
            errors.status = "Status is required";
            errors.submitBtn = true;
            this.setState({ errors });
          }else{
            delete errors.status
            errors.submitBtn = false;
            this.setState({ errors, disableLang: false, addLanguage: false });
          }
          
        }
      }

      if(name && inputTag && langCode){
        if(inputTag === "dropdown"){
          if(properties.values && (properties.values[0].valueChild.length === 0)){
            errors.dropdown = "Dropdown values are required"
            errors.submitBtn = true;
            this.setState({ errors, disableLang: true });
          }
         else if(properties.values[0].valueChild.length > 0){
            delete errors.dropdown
            this.setState({ errors, disableLang: false });
          }
        } else if(inputTag === "multilevel"){
          properties.values && properties.values.map(val => {
            if((val.valueParent === "")){
              errors.multiLevel = "Parent and child fields are required"
              errors.submitBtn = true;
              this.setState({ errors, disableLang: true });
            }
            if(val.valueChild.length === 0){
              errors.multiLevel = "Parent and child fields are required"
              errors.submitBtn = true;
              this.setState({ errors, disableLang: true });
            }
            else if(val.valueParent !== "" && val.valueChild.length > 0 ){
              delete errors.multiLevel
              this.setState({ errors, disableLang: false });
            }
          })
          }
          else if(inputTag === "range"){
          this.setState({ disableLang : false });
        }
      } 
    }
    
    else if(typeData === "langValid"){
      if (!langCode) {
        errors.langCode = "Language is required";
        errors.submitBtn = true;
        this.setState({
          errors,
          disableLang: true
        });
      } else if (errors && errors.langCode !== "" && langCode) {
        delete errors.langCode;
        this.setState({ errors, disableLang: false,  addLanguage: false });
      }

      if (!name || name.trim() === "") {
        errors.name = "Name is required";
        errors.submitBtn = true;
        this.setState({
          errors,
          disableLang: true
        });
      } else if (errors && errors.name !== "" && name) {
        delete errors.name;
        this.setState({ errors, disableLang: false });
      }

      if(name && inputTag && langCode){
        if(inputTag === "dropdown"){
          if(properties.values && properties.values[0].valueChild.length === 0 && (valuesIn.dropdown && valuesIn.dropdown.length === 0) ){
            errors.dropdown = "Dropdown values are required"
            errors.submitBtn = true;
            this.setState({ errors, disableLang: true });
          }
         else if(properties.values[0].valueChild.length > 0){
            delete errors.dropdown
            this.setState({ errors, disableLang: false });
          }
        } else if(inputTag === "multilevel"){
          properties.values && properties.values.map(val => {
            if((val.valueParent === "" && valuesInfo.langCode !== "")){
              errors.multiLevel = "Parent and child fields are required"
              errors.submitBtn = true;
              this.setState({ errors, disableLang: true });
            }
            if(val.valueChild.length === 0 && valuesInfo.langCode !== ""){
              errors.multiLevel = "Parent and child fields are required"
              errors.submitBtn = true;
              this.setState({ errors, disableLang: true });
            }
            else if(val.valueParent !== "" && val.valueChild.length > 0 && valuesInfo.langCode !== ""){
              delete errors.multiLevel
              this.setState({ errors, disableLang: false });
            }
          })
        }
        else if(inputTag === "range"){
          this.setState({ disableLang : false });
        }
      } 
    }

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
      if (!inputTag) {
        errors.inputTag = "Filter Type is required";
        errors.submitBtn = true;
        this.setState({ errors });
      }
  
      if(langCode && name && status){
        if(inputTag === "range"){
          if((max === 0 || max === "")){
            errors.max = "Maximum Field is required";
            errors.submitBtn = true;
            this.setState({ errors });
          }
          else if(min > max){
            errors.max = "Maximum value must be greater than minimum value";
            errors.submitBtn = true;
            this.setState({ errors });
          }
          else{
            delete errors.max
            errors.submitBtn = false;
            this.setState({ errors });
          }
          if(min === max){
            errors.max = "Maximum value must be greater than minimum value";
            errors.submitBtn = true;
            this.setState({ errors });
          }
         }

        if(inputTag === "dropdown"){
          if(properties.values && (properties.values[0].valueChild.length === 0) && (valuesIn.dropdown && valuesIn.dropdown.length === 0)){
              errors.dropdown = "Dropdown values is required"
              errors.submitBtn = true;
              this.setState({ errors, disableLang: true });
          }
          else if(properties.values[0].valueChild.length > 0){
           delete errors.dropdown
           errors.submitBtn = false;
           this.setState({ errors, disableLang: false });
         }
       }

        if(inputTag === "multilevel"){
        properties.values && properties.values.map(val => {
          if((val.valueParent === "" && valuesInfo.langCode !== "")){
            errors.multiLevel = "Parent and child fields are required"
            errors.submitBtn = true;
            this.setState({ errors, disableLang: true });
          }
          if(val.valueChild.length === 0 && valuesInfo.langCode !== ""){
            errors.multiLevel = "Parent and child fields are required"
            errors.submitBtn = true;
            this.setState({ errors, disableLang: true });
          }
          else if(val.valueParent !== "" && val.valueChild.length > 0 && valuesInfo.langCode !== "" ){
            delete errors.multiLevel
            errors.submitBtn = false;
            this.setState({ errors, disableLang: false });
          }
        })
      }
    }
    return errors;
  };


  minMaxChanges = (event) => {
     let {valuesInfo} = this.state;
     let {name,value} = event.target
    if(name === "min"){
      valuesInfo.min = Number(value)
    }else if(name === "max"){
      valuesInfo.max = Number(value)
    }
    this.validate({ valuesIn: valuesInfo, fieldName: "MinMax" });
    this.setState({ valuesInfo });
  };

  addClick = (e,fieldName) => {
    let {valuesInfo,errors,properties} = this.state;
    this.setState({
      properties:{
        ...properties,
        values: [...properties.values, {valueParent:"", valueChild:[]} ]
      }
    })
    
    this.validate({ valuesIn: valuesInfo, fieldName: fieldName  });
  }


  removeClick(i,checkEvent) {
    let {properties,valuesInfo} = this.state;
    let values = [...properties.values];
    values.splice(i, 1);
    this.setState(prevState => ({
      properties:{
        ...prevState.properties, values
      }
    }))
    this.validate({ valuesIn: valuesInfo, fieldName: checkEvent });
  }

  createUI(checkEvent) {
    let {properties,errors} = this.state;
    const bntEff = {
      one: { position: "relative" },
      two: {
        position: "absolute",
        right: 0,
        fontSize: 9,
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
        paddingRight: 42,
        position: "absolute",
        backgroundColor: "#f54a61",
        right: 0,
        fontSize: 9,
      }
    };
    return properties && properties.values.map((el, i) => (
      <div key={i}> 
        <GridContainer>
          <GridItem xs={12} sm={10}>
            <CustomInput
              id="valueParent"
              formControlProps={{ fullWidth: true }}
              inputProps={{
                name: "valueParent",
                placeholder: "Enter your parentData",
                onChange: (e) => this.parentDataChange(i,e,checkEvent),
                value: el ? el.valueParent : "",
                autoComplete: "off"
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={10}>
            <TagsInput
              id="valueChild"
              onlyUnique={true}
              value={el && el.valueChild}
              onChange={(e) => this.handleTagsChange(i, e,checkEvent)}
            />
          </GridItem>
        </GridContainer>
       {(i > 0) && <Button
          color="info"
          round
          //className="languagechange"
          style={bntEff.three}
          onClick={this.removeClick.bind(this, i, checkEvent)}
          value="remove"
        >   
           Remove 
        </Button>}
      </div>
    ))
  }

  parentDataChange = (i, e,checkEvent) => {
    const { name, value } = e.target;
    let {properties,valuesInfo} = this.state;
    let users = [...properties.values];
    properties.values[i] = {...users[i], [name]: value};
    this.validate({ valuesIn: valuesInfo, fieldName: checkEvent });
    this.setState({ properties });
  }

  handleTagsChange = (i, e, checkEvent) => {
    const name = "valueChild";
    let {properties,valuesInfo} = this.state;
    let users = [...properties.values];
    properties.values[i] = { ...users[i], [name]: e };
    this.validate({ valuesIn: valuesInfo, fieldName: checkEvent });
    this.setState({ properties });
  }

 
  dropdownTagsChange = (tags) =>{
    let {valuesInfo,properties} = this.state;
     let statValues = valuesInfo;
     let name = "dropdown"
     statValues[name] = tags;
        let propValues = {};
        propValues = tags;
        properties.values[0].valueChild = propValues
        let val= {
          ...this.state.valuesInfo
        }
        this.setState({
          properties: {
            ...this.state.properties
          }
        });
        this.validate({ valuesIn: val, fieldName: "dropdown" });
        this.setState({ valuesInfo: val});
  
  }
  /**
|----------------------------------------------------------------------------------------
| Render starts for the page
|----------------------------------------------------------------------------------------
*/
  render() {
    const { valuesInfo, errors, popUpDetails, properties, disableLang, selectedLanguage, selectedLangData, totalLanguages, addLanguage, currencyList, displayForm } = this.state;
    const { classes, match } = this.props;
    const id = match.params.id;
    let filteredLang = totalLanguages.filter(
      (o) => !selectedLanguage.includes(o.value)
    );

    const bntEff = {
      one: { position: "relative" },
      two: {
        position: "absolute",
        right: 0,
        fontSize: 9,
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
        paddingRight: 42,
        position: "absolute",
        backgroundColor: "#f54a61",
        right: 0,
        fontSize: 9,
      }
    };

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
                  ? "Edit Filter"
                  : "Add Filter"}
              </h4>
            </CardHeader>
            <CardBody>
              <form onKeyPress={this.onKeyPress} onSubmit={this.handleFormSubmit}>
                <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Filter Type<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={10}>
                    <FormControl fullWidth className={classes.selectFormControl}>
                      <InputLabel htmlFor="status" className={classes.selectLabel}>
                        choose Type
                  </InputLabel>
                      <Select
                        MenuProps={{ className: classes.selectMenu }}
                        classes={{ select: classes.select }}
                        value={valuesInfo.inputTag || ""}
                        name="inputTag"
                        onChange={(event) => this.handleChange(event)}
                        inputProps={{
                          name: "inputTag",
                          id: "inputTag"
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{ root: classes.selectMenuItem }}
                        >
                          Filter Type
                    </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="dropdown"
                        >
                          {" "}
                          Dropdown
                    </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="range"
                        >
                          {" "}
                          Range
                    </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="multilevel"
                        >
                          {" "}
                          Multi level
                    </MenuItem>
                      </Select>
                      <FormHelperText error={errors.inputTag ? true : false}>
                        {errors.inputTag}
                      </FormHelperText>
                    </FormControl>
                  </GridItem>
                </GridContainer>

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
                          Choose Language*
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
                  {
                    valuesInfo.inputTag === "dropdown" &&
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>
                          Filter values<span className="validatcolor">*</span>
                        </FormLabel>
                      </GridItem>

                      <GridItem xs={12} sm={10}>
                        <FormControl fullWidth className={classes.selectFormControl}>
                          <GridContainer>
                            <GridItem xs={12} sm={12}>
                              <FormLabel>
                                <FormHelperText>
                                  Note: Press Enter to add more Filter values
                                </FormHelperText>
                              </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={12}>
                              <TagsInput
                                onlyUnique={true}
                                value = {properties.values[0].valueChild}
                                onChange={this.dropdownTagsChange}
                              />
                            </GridItem>
                            <FormHelperText error={errors.dropdown ? true : false}>
                            {errors.dropdown}
                          </FormHelperText>
                          </GridContainer>
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                  }

                  {
                    valuesInfo.inputTag === "multilevel" && 
                    <GridContainer>
                      <GridItem xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal}>
                          Filter values<span className="validatcolor">*</span>
                        </FormLabel>
                      </GridItem>

                      <GridItem xs={12} sm={10}>
                        <FormControl fullWidth className={classes.selectFormControl}>
                          <GridContainer>
                            <GridItem xs={12} sm={12}>
                              <>
                              {this.createUI(valuesInfo.inputTag)}
                                <Button
                                  color="info"
                                  round
                                  value='add more'
                                  type="button"
                                  onClick={(e) => this.addClick(e,"multilevel")}
                                >
                                  Add More
                                 </Button>
                           </>
                            </GridItem>
                            <FormHelperText error={errors.multiLevel ? true : false}>
                                      {errors.multiLevel}
                             </FormHelperText>
                          </GridContainer>
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                  }



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
                </>}
                {
                  valuesInfo.inputTag === "range" &&
                  <GridContainer>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Filter values<span className="validatcolor">*</span>
                      </FormLabel>
                    </GridItem>

                 <GridItem xs={12} sm={10}>
                      <CustomInput
                        id="min"
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          type: "number",
                          name: "min",
                          onChange: this.minMaxChanges,
                          value: valuesInfo.min,
                          autoComplete: "off",
                          placeholder:"Minimum"
                        }}
                      />
                      <CustomInput
                        id="max"
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          type: "number",
                          name: "max",
                          placeholder:"Maximum",
                          onChange: this.minMaxChanges,
                          value: valuesInfo.max,
                          autoComplete: "off"
                        }}
                      />
                      <FormHelperText error={errors.max ? true : false}>
                      {errors.max}
                      </FormHelperText>
                      </GridItem>
                  </GridContainer>
                }

            
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
                        value={valuesInfo.status || ""}
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
                  this.setState({ popUpDetails: [] });
                }
                }
                close /> : ""}
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
var featuredInfo = compose(
  graphql(GET_ADMIN_FILTER, {name: "getAdminFilter"}),
  graphql(UPDATE_FILTER, { name: "updateFilter" }),
  graphql(UPDATE_TOGGLE_STATUS, { name: "updateToggle" }),
  graphql(GET_LANGUAGES, { name: "getLanguages" }),
  graphql(GET_CURRENCIES, { name: "currencyInfo" })
)(FilterView);

export default withStyles(styles)(featuredInfo);
