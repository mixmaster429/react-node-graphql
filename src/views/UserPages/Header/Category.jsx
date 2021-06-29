import React from "react";
/* global google */
import { compose, graphql } from "react-apollo";
import { compose as pose } from "recompose";
import {
  GET_CATEGORIES,
  GET_CURRENCIES,
  UPDATE_PRODUCT,
  CATEGORY_ID,
  GET_CURRENT_USER,
  GET_ALL_PRODUCTS,
  GET_SITE_INFO,
  POPUP_STATE_UPDATE,
  GET_LANGUAGES,
  PRODUCT_ID,
  REDIRECT_HOME_FILTER,
  GET_REDIRECTFILTER_STATE
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import DropzoneComponent from "react-dropzone-component";
import ReactDOMServer from "react-dom/server";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import style from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import TextField from "@material-ui/core/TextField";
import { withTranslation } from "react-i18next";
import Button from "../../../components/CustomButtons/Button.jsx";

import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";

// react components used to create a google map
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import marker from "../../../assets/img/marker.png";
import Geocode from "react-geocode";
//import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
// react components used for map searchbox
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import { mapLocation } from "../../../helper.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { css } from "@emotion/core";
import * as Toastr from '../Toast.jsx'
import tick from "../../../assets/img/tick.png";
import StaicImg from "../../../assets/img/bike.webp"
import StaicImg1 from "../../../assets/img/congrats-ps4.webp"
import StaicImg2 from "../../../assets/img/congrats-tv.webp"
import Payments from "../Dashboard/Payments.jsx";
import InputRange from "react-input-range-rtl";
import style12 from "react-input-range/lib/css/index.css";
const {REACT_APP_ENV} = process.env;


var styles = {
  ...style,
  ...headerStyles(),
  customBtn: {
    borderColor: "white !important",
    "&:hover": {
      borderColor: "white !important"
    }
  }
  // cardIconTitle: {
  //   ...cardTitle,
  //   marginTop: "15px",
  //   marginBottom: "0px"
  // }
};


var initialState = {
  make: "",
  model: "",
  category: "",
  //categoryId: 5,
  type: "",
  year: "",
  bodyType: "",
  transmission: "",
  fuelType: "",
  seats: "",
  mileage: "",
  unit: "",
  service: "",
  serviceCategory: "",
  sellingStatus: "",
  status: "",
  userId: "",
  editData: {},
  errors: {},
  categories: [],
  images: [],
  imagePreviewUrl: [],
  deleteImages: [],
  validCount: 0,
  title: "",
  description: "",
  isFree: true,
  rate: "",
  likedUsers: "",
  viewers: "",
  currencyCode: "USD",
  defaultCurrency: "",
  popUpDetails: [],
  loading: false,
  lat: "",
  lng: "",
  center: {
    lat: 40.7127753,
    lng: -74.0059728
  },
  bounds: null,
  location: {
    lat: "",
    lng: ""
  },
  filterData:[],
  categoryFields:[],
  regexp : /^[0-9\b]+$/,
  categoryError: false,
  locationError: false,
  titleError: false,
  descError: false,
  HQimageError: false,
  categoryWhileEdit: true,
  editID: "",
  enableDropZone: false,
  editUploadError: false,
  previewLength: 0,
  innerPageEditClicked: false,
  isButtonDisabled: false,
  notCarServiceCategory: false,
  errorsSellStuff : {},
  serviceId:"",
  descCount: ""
};

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

var years = [];
for (let i = 1940; i <= new Date().getFullYear(); i++) {
  years.push(i);
}

var seatCount = [];
for (let i = 1; i <= 15; i++) {
  
  if (i === 15) {
    seatCount.push("15");
  } else if (i < 15) {
    seatCount.push(String(i));
  }
}

var locationUpdate = document.getElementsByClassName("location");

const CustomSkinMap = pose(withScriptjs, withGoogleMap)((props) => {  
 
  return (
    <GoogleMap
      ref={props.onMapLoad}
      center={{ lat: parseFloat(props.center.lat), lng: parseFloat(props.center.lng) }}
      defaultZoom={13}
      //defaultCenter={{ lat: props.lat, lng: props.lng }}
      onDragEnd={props.onDragEnd}
      onBoundsChanged={props.onBoundsChanged}
      defaultOptions={{
        scrollwheel: true,
        disableDefaultUI: true,
        defaultVisible: true,
        zoomControl: true
      }}
    >
      <SearchBox
        ref={props.onSearchBoxMounted}
        onPlacesChanged={props.onPlacesChanged}
        bounds={props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
      >
        <input
          type="text"
          className="location"
          placeholder={props.t("Homepageheader._AddAddress")}
          onChange={props.changeInMap}
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            margin: "10px 10px 0 10px",
            width: "95%",
            height: "32px",
            padding: "0 12px",
            borderRadius: "3px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "14px",
            outline: "none",
            textOverflow: "ellipses"
          }}
        />
      </SearchBox>
    </GoogleMap>
  );
});

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
  let itemName = itemDetails.filter(o => o.value === value);
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
      ...initialState,
      activeItem: 1,
      photoupload: true,
      catemap: false,
      postproduct: true,
      productlist: false,
      postinganother: true,
      postListmsg: "",
      addedproductURL: "",
      EditAddressStatus: true,
      futureList:true,
      totalLanguages: [],
      values: {},
      valuesInfo:{ langCode: "en",
      title: "",
      description: ""},
      properties: { langCode: "en", title: "", description: "" },
      selectedLangData: [],
      popUpDetails: [],
      errors: {
        submitBtn: false
      },
      notifyclr: "rose",
      message: "",
      messageOpen: false,
      //id: "",
      imageLink: null,
      selectedLanguage: ["en"],
      currentLang: "en",
      addLanguage: false,
      disableLang: false,
      displayForm: false

    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapDrag = this.handleMapDrag.bind(this);
    this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this);
    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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
        let langData = data && data.getLanguages
        this.setState({
            totalLanguages : langData
        })
      }
    })
}


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

if (properties && properties.title && properties.langCode) {
  if (properties.langCode !== currentLang) {
    const nextState = [...selectedLanguage, properties.langCode];
    const prevValues = {...valuesInfo};
    const prevProps = {...properties};
    this.setState({
      selectedLanguage: nextState,
      selectedLangData: [...selectedLangData, properties],
      currentLang: properties.langCode,
      disableLang: false,
      valuesInfo: { ...valuesInfo, langCode: "", title: "", description: "" },
      properties: {
        ...properties,
        langCode: "",
        title: "",
        description: ""
      }
    });
   if(totalLanguages.length-1  === selectedLanguage.length){
        this.setState({
          displayForm  : true,
          valuesInfo: prevValues, 
          properties: prevProps
      })
   }

  } else if (properties.langCode === currentLang) {
    let selectedProperty = selectedLangData.filter(
      o => o.langCode !== currentLang
    );
    this.setState({
      selectedLangData: [...selectedProperty, properties],
      currentLang: currentLang === "en" ? "" : properties.langCode,
      disableLang: false,
      valuesInfo: { ...valuesInfo, langCode: "", title: "", description: "" },
      properties: {
        ...properties,
        langCode: "",
        title: "",
        description: ""
      }
    });

  }
  this.setState({
    addLanguage: true
  });
}
else {
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
handleItemClick = e => {


const { totalLanguages, selectedLangData, valuesInfo } = this.state;
let checkHtmlContent = e.target.children[0].innerHTML;
let getLangCode = totalLanguages.filter(o => o.name === checkHtmlContent);
let langCode =
  getLangCode && getLangCode.length > 0 ? getLangCode[0].value : "";
let selectedProperty = selectedLangData.filter(
  o => o.langCode === langCode
);
let propertyData =
  selectedProperty && selectedProperty.length > 0
    ? selectedProperty[0]
    : { langCode: "", title: "", description: "" };
let currentValues = { ...valuesInfo, ...propertyData };
//let cLang = getLangCode && getLangCode.length > 0 ? 
this.setState({
  currentLang:langCode,
  properties: propertyData,
  addLanguage: false,
  valuesInfo: { ...valuesInfo, ...propertyData },
  displayForm: false
});

};
/**
|----------------------------------------------------------------------------------------
| Action starts after clicking individual selected language - delete
|----------------------------------------------------------------------------------------
*/
handleItemRemove = item => {
let { selectedLanguage, selectedLangData, valuesInfo } = this.state;
let langData = selectedLangData;
selectedLanguage = selectedLanguage.filter(x => x !== item);
selectedLangData = selectedLangData.filter(x => x.langCode !== item);
let propertiesData = langData.filter(x => x.langCode === "en");
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

  isValidated() {
    var flag = false,
      required = [],
      error = {};
    var self = this;
    let { categoryId, values,filterData, images, deleteImages, previewLength,regexp } = this.state;
    let {t} = this.props;
    if(images.length === 0 && deleteImages.length === previewLength) {
      this.setState({
        editUploadError : true
      });
      return false
    }
    if (!categoryId) {
      error["category"] = t("Homepageheader._categoryfield")
    }
    if(filterData !== [] && filterData.length > 0){
      filterData.map(z => {
        if(z.inputTag === "range" && z.isMandatory && !values[z.isMandatory]){
          error[z.isMandatory] = t("Homepageheader._FieldIsRequired")
        }
        else if(z.inputTag === "dropdown" && z.isMandatory && !values[z.isMandatory]){
          error[z.isMandatory] =  t("Homepageheader._FieldIsRequired")
        }
        else if(z.inputTag === "multilevel" && z.isMandatory){
          if(!values[z.isMandatory]){
            error[z.isMandatory] = t("Homepageheader._FieldIsRequired")
          }else if(values[z.isMandatory] && !values[z.isMandatory]["fieldChild"]) {
            for (let key in values) { 
              if (values.hasOwnProperty(key)) {
                  if(values[z.isMandatory] && !values[key].fieldChild){
                    error[z.isMandatory] = t("Homepageheader._FieldIsRequired")
                  }
              } 
            } 
          }
        }
        else if(z.inputTag === "range" && z.isMandatory && values[z.isMandatory]){
          filterData && filterData.length > 0 && filterData.map(z => {
            if(((z.filterId == (values[z.isMandatory] &&  values[z.isMandatory].fieldId)) 
            &&  (Number(values[z.isMandatory].rangeValue) >= z.min)) 
              &&  
              ((z.filterId == (values[z.isMandatory] && values[z.isMandatory].fieldId)) && (Number(values[z.isMandatory].rangeValue) <= z.max)) && (z.inputTag === "range") 
            ){
                delete error[z.isMandatory]; 
            }else if((z.inputTag === "range") && z.isMandatory && values[z.isMandatory]){ 
              error[z.isMandatory] = `${t("Homepageheader._rangeValue")} ${z.min} - ${z.max}`
            }
          })
          if(!regexp.test(values[z.isMandatory].rangeValue)){
            error[z.isMandatory] = t("Homepageheader._rangeNumber") 
          }
        }
      })
    }
    this.setState({
      errors: error
    });
    flag = Object.keys(error).find(obj => {
      if (error[obj]) return true;
      return false;
    });
    if (flag) {
      return false;
    }
    return true;

    if (this.state.validCount) {
      this.setState({
        errors: "Please upload the images like JPG,JPEG,PNG File Only"
      });
      return false;
    }
    if (
      (this.state.imagePreviewUrl && this.state.imagePreviewUrl.length) +
        (this.state.images && this.state.images.length) >
      10
    ) {
      {
        this.setState({
          errors: "Oops! you can upload 10 images only"
        });
        return false;
      }
    }
    if (this.state.imagePreviewUrl && this.state.imagePreviewUrl.length) {
      this.setState({
        errors: ""
      });
      return true;
    } else if (this.state.images && this.state.images.length) {
      this.setState({
        errors: ""
      });
      return true;
    } else if (this.state.images) {
      this.setState({
        errors: "Product Images is required"
      });
      return false;
    }
     required = ["title", "rate"];
    required.forEach(data => {
      if (data === "rate") {
        error[data] =
          !self.state["isFree"] && !self.state[data]
            ? `The ${data} field is required.`
            : "";
        if (
          data === "rate" &&
          self.state.rate &&
          (!!isNaN(Number(self.state.rate)) || !!(self.state.rate <= 0))
        ) {
          error[data] = "rate must be a positive number.";
        }
      } else if (data !== "rate" && !self.state[data]) {
        error[data] = `The ${data} field is required.`;
      } else {
        error[data] = "";
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
    if (flag) {
      return false;
    }
    return true;
  }


handleChange = event => {
  event.persist();
  const { valuesInfo } = this.state;
  let statValues = valuesInfo;
  let name = event.target.name;
  statValues[name] = event.target.value;
  if (name === "langCode" || name === "description" || name === "title") {
    let propValues = {};
    propValues = {
      ...this.state.properties,
      [name]: event.target.value
    };
    this.setState({
      properties: propValues
    });
  }
  this.setState({
    valuesInfo: statValues
  });
  // this.isValidated();

};


  imageClick = () => {
    this.setState({
      clicked: true
    });
    this.props.getCategoryId({ variables: { categoryId: "" } });
    this.setState({ categoryId: "" });
  };

  FormCategory() {
    let location = this.state.location;
    let langCode= this.state.valuesInfo.langCode
    let title = this.state.valuesInfo.title;
   // let description = this.state.values.description;
    let isFree = this.state.isFree;
    let rate =  this.state.rate;
    let errorsSellStuff = {};
    let formIsValid = true;    
    if (!location.hasOwnProperty('lat_lon')) {
      formIsValid = false;
      errorsSellStuff["location"] = this.props.t('Homepageheader._Locationempty');
    }   

    if (!langCode) {
      formIsValid = false;
      errorsSellStuff["langCode"] = this.props.t("Homepageheader._entertitle");
    }   

    if (!title) {
      formIsValid = false;
      errorsSellStuff["title"] = this.props.t("Homepageheader._entertitle");
    }  

    // if (!description) {
    //   formIsValid = false;
    //   errorsSellStuff["description"] = this.props.t("Homepageheader._enterdescription");
    // } 

    if(!isFree) {
      if(rate === "" || rate === 0 || rate < 0) {
        formIsValid = false;
        errorsSellStuff["isFree"] = this.props.t("Homepageheader._enterRate");
      }
    }

    if(isNaN(rate)) {
      formIsValid = false;
      errorsSellStuff["isFree"] = this.props.t("Homepageheader._entervalidRate");
    }

    this.setState({
      errorsSellStuff: errorsSellStuff
    });

    return formIsValid;
  }

  handleSubmit(e) {     
    let {
      categoryId,
      categoryFields,
      images,
      sellingStatus,
      status,
      isFree,
      currencyCode,
      rate,
      location,
      deleteImages,
      innerPageEditClicked,
      selectedLangData,
      valuesInfo,
      properties,

    } = this.state;
    
    
   let finalArray = [];
    if (valuesInfo.title && valuesInfo.title.trim() !== "" && valuesInfo.langCode) {
      if (selectedLangData && selectedLangData.length > 0) {
           let foundIndex = selectedLangData.findIndex(
             x => x.langCode === properties.langCode
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
       const enIndex = selectedLangData.findIndex(lang => lang.langCode === "en");
       selectedLangData.push(...selectedLangData.splice(0, enIndex));
     
       if (selectedLangData && selectedLangData.length > 0) {
         selectedLangData.map(item => {
           return delete item.__typename;
         });
       }
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
         description: item.description ? item.description.trim() : ""
         };
     });

    let { currentUser, updateLoginPopupStatus } = this.props;    
      let assingHQ = '';
      // const modifyImage = images.map(imgData => {
      //   if(imgData.size > 5000000) {
      //     assingHQ = 'HQimageFound'
      //   }
      // })
      if(assingHQ ==="HQimageFound") {
        this.setState({
          HQimageError: true
        })
      } else {
        if (currentUser.getCurrentUser !== null) {
          var result = {
            language:selectedLangData,
            categoryFields: categoryFields,
            isFree: isFree,
            categoryId: Number(categoryId),
            rate: Number(rate),
            images: images.filter(i => i !== null),
            deleteImages,
            location: location,
            currencyCode: !isFree ? currencyCode : "",
            userId: Number(currentUser.getCurrentUser.id),
            userName: currentUser.getCurrentUser.userName
          };
          if (sellingStatus) {
            result = Object.assign({}, result, { sellingStatus });
          }
          if (status) {
            result = Object.assign({}, result, { status });
          }
          if(this.FormCategory()) {
            if (this.isValidated()) {
              const { editID } = this.state;
              let sendVariables;
              if(editID) {
                sendVariables = { id: Number(editID) ,data: result }               
              } else {
                sendVariables = { data: result }                
              }
              this.setState({
                isButtonDisabled: true
              })
              this.props
              .updateProduct({
                variables: sendVariables,
                refetchQueries: [{ query: GET_ALL_PRODUCTS,variables: {filter:{}}  }]
              })
              .then(async ({ data }) => {
              if(this.props.innerPageEditClicked === "InnerEditProduct") {              
                this.props.closeDiscardAfterSubmit()
              }
                this.props.getProductId({ variables: { productId: data.updateProduct.id } })
                this.setState({ 
                  postproduct: false,
                  isButtonDisabled: false,
                  productlist: true,
                  locationError : false,
                  editID: "",
                  addedproductURL: `${process.env.REACT_APP_Domain_Url}products/${data.updateProduct.id}`
                });              

                this.props.refetchValue.ApigetAllProducts(data)     
                this.props.refetchValue.CategorySubmittedinProducts() 
                this.props.refetchValue.clearValue()  
                if(editID) {
                  this.setState({
                    postListmsg: this.props.t("Homepageheader._updated"), futureList:false
                  })
                  Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"green"}} ><path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path></svg></div><div>{this.props.t("Homepageheader._Congratulationsmsg")}</div></div>)
                } else {
                  this.setState({
                    postListmsg: this.props.t("Homepageheader._posted"),  futureList:true
                  })
                  Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"green"}} ><path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path></svg></div><div>{this.props.t("Homepageheader._Congratulationsadd")}</div></div>)
                }
                if(innerPageEditClicked) {
                  this.props.propsHistory.push({
                    pathname: `/products/${editID}/`,
                    state: { some: data.updateProduct }
                  })
                }
                this.clearState();
                this.props.redirectHomeFilter({ variables: { pageCountFilter: true } })
              })
              .catch(error => {
                Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"red"}}><path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path></svg></div><div>{this.props.t("Homepageheader._Erroroccured")}</div></div>)
                this.setState({
                  isButtonDisabled: false
                })
                console.log(error);
              });
            }
          }
        } else {        
          this.props.refetchValue.sellYourStuffBeforeLogin(this.state)
          updateLoginPopupStatus({
            variables: {
              isOpen: true
            }
          });
        }
      }
  }


  componentWillReceiveProps(nextProps){
    let {categoryInfo,editProductData} = nextProps;
    let {values} =  this.state;
   if(nextProps.manageBeforeLogin !== this.props.manageBeforeLogin) {
      this.setState({
        ...nextProps.manageBeforeLogin
      })
    }        
    
    if(nextProps.discardStuffValue !== this.props.discardStuffValue) {         
      this.props.refetchValue.discardYourStuff()
    }

    if(nextProps.userEditClicked !== this.props.userEditClicked) {     
      
      var getCategory = nextProps.editProductData && nextProps.editProductData
      let res = getCategory.language.map(lang =>{
        return lang
     })
  
     let englishProperty = res.filter(
      x => x.langCode === "en"
    );
      let selectedLanguage = [];
      res && res.map(item => {
         return selectedLanguage.push(item.langCode);
      });
      this.setState({
        valuesInfo:{ ...englishProperty[0], ...getCategory },
        properties:englishProperty[0],
        selectedLangData:res,
        selectedLanguage
      
      });
      if(getCategory){
        categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.filter(x => x.id == editProductData.categoryId).map(v => {
          this.setState({
              filterData : v.fields
          })
      })

      let newObj = editProductData.categoryFieldsInfo
      for (var key in newObj) {
        if (newObj.hasOwnProperty(key)) {
          delete newObj[key].__typename
          delete newObj[key].fieldChildName
          delete newObj[key].fieldName

          if(newObj[key]['fieldChild'] === null){
            delete newObj[key].fieldChild
          } 
          if(newObj[key]['fieldParent'] === null){
          delete newObj[key].fieldParent
          }
          if(newObj[key]['rangeValue'] === null){
            delete newObj[key].rangeValue
          }
        values[newObj[key]['fieldId']] = newObj[key];
        this.setState({ values : values})
      }
    }

      let categoryFields = [];
      for (var key in values) {
       categoryFields.push(values[key]);
      }
        this.setState({
          categoryFields
        })
  }
      this.setState({
        categoryWhileEdit: false,
        enableDropZone: true,
        catemap: true,
        descCount: nextProps.editProductData.description.length,
        location: {
          lat_lon: [nextProps.editProductData.location.lat_lon[0], nextProps.editProductData.location.lat_lon[1]] ,
          city: nextProps.editProductData.location.city,
          state:nextProps.editProductData.location.state,
          pincode: nextProps.editProductData.location.pincode
        },       
        category: nextProps.editProductData.category,
        categoryId: String(nextProps.editProductData.categoryId),
        editID: nextProps.editProductData.id,        
        imagePreviewUrl: nextProps.editProductData.images,
        previewLength: nextProps.editProductData.images.length,
        center: {
          lat: nextProps.editProductData.location.lat_lon[0],
          lng: nextProps.editProductData.location.lat_lon[1]
        },
        isFree: nextProps.editProductData.isFree,
        rate: nextProps.editProductData.rate,
        currencyCode: (nextProps.editProductData.currencyCode) ? nextProps.editProductData.currencyCode: this.state.currencyCode,
      })
      let {siteInfo} = this.props;
      siteInfo.refetch();
      if (siteInfo.getSiteInfo) {
        let googleApi = siteInfo.getSiteInfo && siteInfo.getSiteInfo.googleApi;
        this.setState({ googleApi });
      }

      Geocode.setApiKey(this.state.googleApi);
      Geocode.fromLatLng(nextProps.editProductData.location.lat_lon[0], nextProps.editProductData.location.lat_lon[1]).then(
        (response) => {
          const address = response.results[0].formatted_address;  
          if (typeof(address) !== "undefined" && typeof(this._searchBox) !== "undefined" && this._searchBox && this._searchBox.containerElement) {
             this._searchBox.containerElement.getElementsByClassName(
              "location"
              )[0].value =  address   //`${this.state.city}${this.state.state}`                    
              this.setState({
                EditAddressStatus: false
              })    
          }
        },
        (error) => {
          //console.error(error);
        }
      );
    }
  }
 

  handleClick(stateName,value) { 
    let {categoryInfo} = this.props;
    let {values,categoryFields} = this.state;  
    this.setState((prevState) => {
      if(prevState.images.length > 0) {
        return { 
          //photoupload: false,
           catemap: true, 
           categoryError: false }
      }
    })

    if (stateName === "category") {
      categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.filter(x => x.id == value).map(v => {
        this.setState({
            filterData : v.fields
        })
      })
      this.setState({
        [stateName]: value,
        categoryId: Number(value),
        values:{},
        categoryFields:[]
      });
    }    
  }

  FilterCategorychange(event,fieldId,parentValue) {
    let { match,categoryInfo } = this.props;
    let {values} = this.state;
    let { errors } = this.state;
    let {name,value} = event.target
    if (name === "category") {
      categoryInfo.getCategoryDetails && categoryInfo.getCategoryDetails.category.filter(x => x.id == value).map(v => {
        this.setState({
            filterData : v.fields
        })
      })
      this.setState({
        [name]: value,
        categoryId: Number(value),
        values:{},
        errors:{},
        categoryFields:[],
        editData: Object.assign( {},this.state.editData && { [name]: parseInt(value) })
      });
    }
    if(fieldId && !parentValue){
        let newObj = {...values, [fieldId]:{["fieldId"]:String(fieldId),[name]: value}}
        this.setState({
          values: newObj
        })

        let categoryFields = [];
          for (var key in newObj) {
            categoryFields.push(newObj[key]);
          }
          this.setState({
            categoryFields,
            editData: Object.assign( {},this.state.editData && { categoryFields })
          })
       }
       else if(fieldId && parentValue){
        let newObj = {...values, [fieldId]:{["fieldId"]:String(fieldId),"fieldParent":parentValue,[name]: value}}
        this.setState({
          values: newObj
        })

        let categoryFields = [];
          for (var key in newObj) {
            categoryFields.push(newObj[key]);
          }
          this.setState({
            categoryFields,
            editData: Object.assign( {}, this.state.editData && { categoryFields })
          })
       }
  }

      Rangechange = (value,fieldId,name) => {
        let {values} = this.state;
        let newObj = {...values, [fieldId]:{["fieldId"]:String(fieldId),[name]: value}}
        this.setState({
          values: newObj
        })

      let categoryFields = [];
          for (var key in newObj) {
            categoryFields.push(newObj[key]);
          }
          this.setState({
            categoryFields,
            editData: Object.assign( {},this.state.editData && { categoryFields })
          })
      }



      change(event, stateName) {
        if (stateName === "description"){
          this.setState({
            descCount : event.target.value.length
          })
        }
        if(this.state.editID) {
          if(this.props.innerPageEditClicked === "InnerEditProduct") {
            this.props.showDiscardForProduct()
          }
          this.props.refetchValue.CategoryWithImageEdit()
        }
        let { errors } = this.state;
        var isTrueSet;

        if (stateName === "userId") {
          let userName = (
            this.props.usersInfo.getAllUsers.find(
              (u) => Number(u.id) === Number(event.target.value)
            ) || {}
          ).userName;
          this.setState({
            [stateName]: event.target.value,
            userName: userName,
            errors
          });
        } 
        else if(stateName !== "rate") {
          this.setState({
            [stateName]: event.target.value,
            editData: Object.assign({}, this.state.editData, {
              [stateName]: event.target.value
            })
          });
        }

        if (stateName === "isFree") {
          isTrueSet = event.target.value === "true";
          this.setState({ [stateName]: !isTrueSet });
        } 
        else if (stateName === "rate") {
          const reg = /^(?![0.]+$)\d+(\.\d{1,2})?$/;
          if (event.target.value === " " || reg.test(event.target.value)) {
            this.setState({ [stateName]: event.target.value });
        }
        }
      }

      preloadImages(dropzone) {        
        (this.state.imagePreviewUrl || []).forEach(function(i) {
          var name = i.split("/");
          var file = { url: i, name: name[name.length - 1] };    
          dropzone.emit("addedfile", file);
          dropzone.emit("thumbnail", file, i);
          dropzone.emit("complete", file);
        });
      }

  handleAdd(file) {    
    //if(file.size < 5000000) {      
      if (!file.url) {
        var allFiles = this.state.images;
        allFiles = allFiles.concat([file]);      
        this.setState({
          images: allFiles,
          errors: ""
        });
        this.setState(prevState => {
          if(prevState.images.length > 0 && prevState.categoryId !== 0) {
            this.props.refetchValue.CategoryWithImage()
            return { 
             // photoupload: false, 
              catemap: true, 
              categoryError: false }
          }
        })
      }      
    //}
  }


  handleRemove(file) {    
    var count;
    if (file.url) {
      if(this.state.editID) {
        if(this.props.innerPageEditClicked === "InnerEditProduct") {
          this.props.showDiscardForProduct()
        }
      }      
      var del = this.state.deleteImages;
      var delName = file.url.split("/");
      var fileName = delName[delName.length - 1];
      del.push(fileName);
      var pre = this.state.imagePreviewUrl;
      pre.forEach((url, i) => {
        if (url === file.url) {
          pre.splice(i, 1);
        }
      });
      this.setState({
        deleteImages: del,
        imagePreviewUrl: pre
      });
    } else {
      let images = this.state.images;
      images.forEach((img, i) => {
        if (file.status === "error") {
          count = this.state.validCount - 1;
        }
        if (file.upload.uuid === img.upload.uuid) {
          images.splice(i, 1);
        }
      });
      this.setState({
        images: images,
        validCount: count
      });
      if(this.state.images.length === 0) {
        var element = document.getElementsByClassName("dz-clickable")[0];
        element.classList.remove("dz-started");
      }
    }

  }

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  sendState() {
    return this.state;
  }

  onBoundsChanged() {
    this.setState({
      bounds: this._mapComponent.getBounds(),
      center: this._mapComponent.getCenter()
    });
  }

  handleMapDrag() {
    let mapRef = this._mapComponent;
    //let { match } = this.props;
    //const id = match.params.id;
    this.setState({
      center: mapRef.getCenter()
    });
    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey(this.state.googleApi);
    // Enable or disable logs. Its optional.
    Geocode.enableDebug();
    // Get address from latidude & longitude.
    Geocode.fromLatLng(mapRef.getCenter().lat(), mapRef.getCenter().lng()).then(
      (response) => {
        const address = response.results[0].formatted_address;
        locationUpdate[0].value = address;
        const lat_lon = response.results[0].geometry.location;
        var locationSet = mapLocation(response.results);
        var location = {
          address: locationSet.street_name
            ? locationSet.street_name
            : "" + locationSet.route
            ? locationSet.route
            : "",
          city: locationSet.locality || locationSet.administrative_area_level_2,
          state: locationSet.administrative_area_level_1,
          country: locationSet.country,
          pincode: locationSet.postal_code,
          lat_lon: [lat_lon.lat, lat_lon.lng]
        };
        this.setState({
          location: location,
          editData:  location ,
          errors: ""
        });
        this.setState({
          locationError : false
        })
      },
      (error) => {
        // console.error(error);
       }
    );
  }

  handleSearchBoxMounted(searchBox) {            
    this._searchBox = searchBox;
    let { location, googleApi } = this.state;
    let l =
      location.lat_lon && location.lat_lon.length
        ? location.lat_lon[0]
        : 40.748817;
    let lo =
      location.lat_lon && location.lat_lon.length
        ? location.lat_lon[1]
        : -73.985428;
    if (this.state.location && this._searchBox) {
      // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
      Geocode.setApiKey(googleApi);
      // Enable or disable logs. Its optional.Geocode.enableDebug();
      Geocode.fromLatLng(l, lo).then(
        response => {
          //const address = response.results[0].formatted_address;
          //if (this._searchBox && this._searchBox.containerElement) {
            // this._searchBox.containerElement.getElementsByClassName(
            //   "location"
            // )[0].value = address;            
         // }
        },
        (error) => {
          //console.error(error);
        }
      );
    }
  }

  changeInMap = (e) => {    
    if(e.target.value === "") {
      if(this.state.editID) {
        if(this.props.innerPageEditClicked === "InnerEditProduct") {
          this.props.showDiscardForProduct()
        }
        this.props.refetchValue.CategoryWithImageEdit()
      }
      this.setState({
        location: {}
      })
    }
  }            

  // componentDidUpdate(pP,pS) {     
  //  console.log(this)
  //   if(typeof(this._searchBox) !== 'undefined') {
  //     if(this.state.editID) {    
  //       if(this.state.EditAddressStatus) {
  //         Geocode.setApiKey(config.googleApi);
  //         Geocode.fromLatLng(this.state.location.lat_lon[0], this.state.location.lat_lon[1]).then(
  //           response => {
  //             const address = response.results[0].formatted_address;  
  //             //console.log(address)  
  //             if (typeof(address) !== 'undefined' && typeof(this._searchBox) !== 'undefined' && this._searchBox && this._searchBox.containerElement) {
  //               console.log("didUpdate")     
  //                this._searchBox.containerElement.getElementsByClassName(
  //                 "location"
  //                 )[0].value = address;                    
  //                 this.setState({
  //                   EditAddressStatus: false
  //                 })    
  //             }
  //           },
  //           error => {
  //             console.error(error);
  //           }
  //         );
  //       }
        
  //     }
  //   }
  // }

  componentDidMount() { 
    if(this.props.headerStuffClicked === true) {
      this.setState({
        enableDropZone: true  
      })
      this.props.refetchValue.showValue()
    }

    if(this.props.innerPageEditClicked === "InnerEditProduct") {
      this.setState({
        innerPageEditClicked: true
      })
    }
    document.addEventListener("keydown", this.handleKeyPress);

     this.getAllLanguagesData();

  }

  

    componentWillUnmount(){
      document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress(e) {
      if(e.key === "Tab") {
          e.preventDefault();
      }
    }


  handlePlacesChanged() {
    if(this.state.editID) {
      if(this.props.innerPageEditClicked === "InnerEditProduct") {
        this.props.showDiscardForProduct()
      }
      this.props.refetchValue.CategoryWithImageEdit()
    }
    const places = this._searchBox.getPlaces();
    if (places && places.length) {
      var locationSet = mapLocation(places);
      var location = {
        address: locationSet.street_name
          ? locationSet.street_name
          : "" + locationSet.route
          ? locationSet.route
          : "",
        city: locationSet.locality || locationSet.administrative_area_level_2,
        state: locationSet.administrative_area_level_1,
        country: locationSet.country,
        pincode: locationSet.postal_code,
        lat_lon: [
          places[0].geometry.location.lat(),
          places[0].geometry.location.lng()
        ]
      };
      this.setState({
        center: {
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng()
        },
        location: location,
        editData: { location },
        errors: ""
      });      
    }
    //this.props.getLocation({variables:{lat_lon:location.lat_lon}});
  }

  clearState() {
    this.setState({ ...initialState });
  }

  componentWillMount() {
    let { currencyInfo, siteInfo } = this.props;
    var self = this;
    var defaultCurrency;
    currencyInfo.refetch().then(function(result) {
      if (result && result.data && result.data.getCurrencies.length) {
        var currency = result.data.getCurrencies.find(c => !!c.default);
        defaultCurrency = currency && currency.code;
        self.setState({
          defaultCurrency: defaultCurrency,
          //currencyCode: defaultCurrency
        });
      }
    });
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let googleApi = siteInfo.getSiteInfo && siteInfo.getSiteInfo.googleApi;
      this.setState({ googleApi });
    }
  }
  upLoadbtn = () => {
    this.setState(prevState => {
      if(prevState.categoryId !== 0 && prevState.images.length > 0) {
        return { photoupload: false, catemap: true, categoryError: false  }
      } else {
        //return { categoryError: true } 
      }
    })
    //this.setState({ photoupload: false, catemap: true });
  };


  postOther = () => {
    this.props.refetchValue.PostProduct()
    this.setState({
      ...initialState,
      activeItem: 1,
      photoupload: true,
      catemap: false,
      postproduct: true,
      productlist: false,
      postinganother: true,
      enableDropZone: true,
      futureList: true
      

    })
    //this.setState({ postinganother: true, productlist: false });
  };
  addMoredetails = () => {
    this.setState({ catemap: true, productlist: false });
  };

  removedfile = file => {
    this.props.onRemoveFile(file);
  };

  dynamicUpload = () => {
    const { editID, imagePreviewUrl } = this.state;   

    if(editID) {
      return  imagePreviewUrl.length < 1 && "sfsdfd"
    } else {
      return (<div className="dz-clickable">
          <div className="dropZoneDefault">
            <svg
              viewBox="0 0 24 24"
              width="48px"
              height="48px"
              className="sc-jTzLTM eneTjs"
              fill="#EEEEEE"
            >
              <path d="M19.389 18.3V5.1c0-.221-.194-.4-.425-.4H4.514c-.235 0-.425.176-.425.4v12.786l4.098-5.802c.261-.37.728-.402 1.046-.075l4.233 4.358 1.523-1.438a.836.836 0 0 1 1.175.022l3.225 3.349zm0-15.3c.938 0 1.7.893 1.7 1.995v14.01c0 1.102-.762 1.995-1.7 1.995h-15.3c-.939 0-1.7-.893-1.7-1.995V4.995C2.389 3.893 3.15 3 4.089 3h15.3zm-5.525 7.275a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4z"></path>
            </svg>
            <div className="bzPLnz">
              <h1>
                {" "}
                <span>{this.props.t("Homepageheader._Dragdrop")} </span>
              </h1>
            </div>
            <p className="egCyIy">
              <span>
              {this.props.t("Homepageheader._Upload10photos")}.
              </span>
              <br />
              <span>
              {this.props.t("Homepageheader._ImagesPNGJPG")}
              </span>
            </p>
          </div>
        </div>)
    }
  }

  copyData = () => {
    Toastr.success( <div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"green"}} ><path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path></svg></div><div>{this.props.t("Homepageheader._linkcopied")}</div></div>)
  }

  render() {

    let { classes, categoryInfo, currencyInfo,  t } = this.props;
    var self = this;

    const {
      errors,
      filterData,
      category,categoryId,
      isFree,
      currencyCode,
      rate,
      defaultCurrency,
      lat,
      lng,
      bounds,
      center,
      googleApi,
      HQimageError,      
      categoryWhileEdit,
      enableDropZone,
      editUploadError,
      isButtonDisabled,

      postListmsg,
      
      properties,
      disableLang,
      selectedLanguage,
      selectedLangData,
      totalLanguages, 
      addLanguage,
      displayForm,
      langcodeError,
      values,
      categoryFields
    } = this.state;
   
    let filteredLang = totalLanguages.filter(
      o => !selectedLanguage.includes(o.value)
  );

    var size = 6;    
   
    let categorysiz = categoryInfo.getCategoryDetails
    && categoryInfo.getCategoryDetails.category.map((cat, index) => {
      return (
        <div className="whpls">
          {" "}
          <div className="category-deat" onClick={() => this.handleClick("category",cat.id)}>
            {cat.id == this.state.categoryId ? (
              <div className="hgbg">
                {" "}
                <div
                  className="catrgyr"
                  key={index}
                  value={cat.id}
                  onClick={() => this.handleClick("category",cat.id)}
                >
                  <div>
                    <a>
                    <img src={cat.image} width={50} height={50} alt="" />{" "}
                    </a>
                  </div>
                  <div className="categoryname">{cat.name}</div>
                  <div class={"delete"}>
                    <button className={classes.dioYWW}>
                      <img src= {tick} onClick={this.imageClick} alt=""/>
                      {this.state.clicked}
                    </button>
                  </div>
                </div>{" "}
              </div>
            ) : (
              <div
                className="catrgyr"
                key={index}
                value={cat.id}
                onClick={() => this.handleClick("category",cat.id)}
              >
                <div>
                  <a>
                    <img src={cat.image} width={50} height={50} alt="" />{" "}
                  </a>
                </div>
                <div className="categoryname">{cat.name}</div>
              </div>
            )}
          </div>
        </div>
      );
    });
  
    return (
      <div>
      {this.state.postproduct ? (
        <div className="sell-stuff">
          <div className="overflowiss">
            {this.state.postinganother ? (
              <div>
                {this.state.photoupload ? (
                  <> 
                   {errors.category && <small style={{ color: "red" }}>{ t("Homepageheader._categoryfield")}</small>}
                  <GridContainer>
                      <GridItem xs={12} sm={12}>
                  <div className="jJdLlm editcateselect">
                    {!categoryWhileEdit && <span className="text-alignpg"> 
                    <GridContainer>
                    <GridItem xs={12} sm={12}>
                <FormLabel className={classes.labelHorizontal}>
                  {" "}
                  {t("Homepageheader._Categories")}<span className="validatcolor">*</span>{" "}
                </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={12}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="category" className={classes.selectLabel}>
                  {!categoryId && t("Homepageheader._ChooseCategory")}
                </InputLabel>
                <Select
                  MenuProps={{ className: classes.selectMenu }}
                  classes={{ select: classes.select }}
                  value={String(categoryId)}
                  onChange={(event) => this.FilterCategorychange(event)}
                  inputProps={{ name: "category", id: "category" }}
                >
                  <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
                    {" "}
                   {t("Homepageheader._ChooseCategory")}
                  </MenuItem>
                  {categoryInfo.getCategoryDetails
                    ? categoryInfo.getCategoryDetails.category.map((cat, index) => {  
                          return (
                            <MenuItem
                              key={index}
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={cat.id}
                            >
                              {cat.name}
                            </MenuItem>
                          );
                        })
                    : ""}
                </Select>
              </FormControl>
                {!!errors["category"] ? (
                  <FormHelperText error={!!errors["category"]}>
                    {errors["category"]}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </GridItem>
          </GridContainer>
                 </span>}
              {categoryWhileEdit && categorysiz}
                  </div>
                  </GridItem>
                      </GridContainer>
                  </>) :(
                 ""
                  )}
                    { editUploadError && <small style={{ color: "red" }}>*{ t("Homepageheader._Choosecategory")}</small>}
                    <GridContainer style={{ display: "block" }}>
                      <div className="mgrhd">
                        {" "}
                        <h6 className="cls_h6">{ t("Homepageheader._Photos")} </h6>
                        <div
                         className= { this.state.images.length < 2 ? "dquJfs ezTDQq addimg" : "dquJfs ezTDQq "}
                          onClick={e => this.upLoadbtn()}
                        >
                          {enableDropZone && <DropzoneComponent
                            config={{
                              postUrl: "no-url",
                              iconFiletypes: [".jpg", ".png"],
                              showFiletypeIcon: true,
                            }}
                            eventHandlers={{
                              addedfile: file => this.handleAdd(file),
                              init: async (dropzone) => {
                                dropzone.autoDiscover = false;
                                await self.preloadImages(dropzone);
                              },                      
                              removedfile: file => this.handleRemove(file),                                         
                              thumbnail: file => {                    
                                let images = this.state.images;                          
                                let checkErrorOccur = images.find(image => image.status === "error")
                                if(checkErrorOccur || images.length > 10) {
                                  images.forEach((img, i) => {
                                    img.previewElement.remove()                                 
                                  });
                                  this.setState({
                                    ...this.props.editProductData,
                                    images: [],
                                    //imagePreviewUrl: [],
                                    validCount: 0
                                  });
                                  var element = document.getElementsByClassName("dz-clickable")[0];
                                  element.classList.remove("dz-started");
                                  if(images.length > 10) {
                                    Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"red"}}><path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path></svg></div><div>{ t("Homepageheader._youveselected")}</div></div>);
                                  } else if(file.size > 5000000) {
                                    Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"red"}}><path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path></svg></div><div>{ t("Homepageheader._Imageover")}</div></div>)
                                  }                                                                    
                                } /* else {
                                  var element = document.getElementsByClassName("dz-clickable")[0];
                                  element.add.remove("dz-started");
                                } */
                              },
                              error: file => {                                                            
                                let _FileName = file.name.split(".").pop();                                
                                if(_FileName !== "png" && _FileName !== "jpg" && _FileName !== "jpeg") {
                                  Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"red"}}><path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path></svg></div><div>{ t("Homepageheader._ImageInvalid")}</div></div>)
                                } else if(file.size > 5000000) {
                                  this.state.images.forEach((img, i) => {
                                    img.previewElement.remove()                                 
                                  });
                                  Toastr.success(<div className="msgg"><div><svg viewBox="0 0 24 24" width="32" height="32" style={{fill:"red"}}><path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path></svg></div><div>{ t("Homepageheader._ImageInvalid")}</div></div>)
                                }
                                this.setState({
                                  ...this.props.editProductData,
                                  images: [],
                                  validCount: 0
                                });
                                //file.previewElement.innerHTML = "";
                                file.previewElement.remove()     
                                var element = document.getElementsByClassName("dz-clickable")[0];
                                element.classList.remove("dz-started");                                
                                /* if (file.status === "error") {
                                  var element = document.getElementsByClassName("dz-clickable")[0];
                                  element.classList.remove("dz-started");
                                  Toastr.success("Image is invalid format. Please select another one and try again")
                                  this.setState({
                                    images: [],
                                    imagePreviewUrl: [],
                                    validCount: 0
                                  });
                                } */
                                /* if(file.size > 5000000) {
                                  var errorDisplay = document.querySelectorAll("[data-dz-errormessage]");
                                  errorDisplay[errorDisplay.length - 1].innerHTML = "Upload Image Must be less than 5mb";
                                } */                                
                                /* let images = this.state.images;
                                console.log(images)
                                let checkErrorOccur = images.find(image => image.status === "error")
                                console.log(checkErrorOccur)
                                if(checkErrorOccur) {
                                } */
                                /* var count;
                                images.forEach((img, i) => {
                                  if (file.status === "error") {
                                    count = this.state.validCount - 1;
                                  }
                                  if (file.upload.uuid === img.upload.uuid) {
                                    images.splice(i, 1);
                                  }
                                });
                                this.setState({
                                  images: [],
                                  validCount: 0
                                }); */
                              }
                            }}

                            djsConfig={{
                              acceptedFiles: ".png, .jpg, .jpeg", //image/jpeg,image/png,image/jpg
                              maxFilesize: 5,
                             // maxFiles: 10,
                              autoProcessQueue: false,
                              clickable: true,
                              thumbnailWidth:"400",  //415
                              thumbnailHeight:"400", //375
                              createImageThumbnails: true,
                              dictInvalidFileType: "invalid file type",
                              previewTemplate: ReactDOMServer.renderToStaticMarkup(
                                <div className="dz-preview dz-file-preview dz-clickable fx_img">
                                  <div className="dz-details">
                                    <div className="img_cvr">
                                      <img data-dz-thumbnail="true"   alt="" />
                                      <button data-dz-remove>
                                        <svg viewBox="0 0 24 24"><path d="M5.176 6.706a1.176 1.176 0 1 1 0-2.353h4.706a2.353 2.353 0 0 1 4.706 0h4.706a1.176 1.176 0 1 1 0 2.353V20a2 2 0 0 1-2 2H7.176a2 2 0 0 1-2-2V6.706zm4.706 2.353c-.65 0-1.176.421-1.176.941v7.53c0 .52.527.94 1.176.94.65 0 1.177-.42 1.177-.94V10c0-.52-.527-.941-1.177-.941zm4.706 0c-.65 0-1.176.421-1.176.941v7.53c0 .52.526.94 1.176.94.65 0 1.177-.42 1.177-.94V10c0-.52-.527-.941-1.177-.941z"></path></svg>
                                      </button>
                                    </div>
                                    <div className="dz-error-message">
                                      <span
                                        style={{ color: "red" }}
                                        data-dz-errormessage="true"
                                      ></span>
                                    </div>
                                  </div>
                                </div>
                              ),
                              dictDefaultMessage: ReactDOMServer.renderToStaticMarkup(
                                // this.dynamicUpload()
                                <>
                                {!this.state.editID && <div className="dz-clickable">
                                <div className="dropZoneDefault">
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="48px"
                                    height="48px"
                                    className="sc-jTzLTM eneTjs"
                                    fill="#EEEEEE"
                                  >
                                    <path d="M19.389 18.3V5.1c0-.221-.194-.4-.425-.4H4.514c-.235 0-.425.176-.425.4v12.786l4.098-5.802c.261-.37.728-.402 1.046-.075l4.233 4.358 1.523-1.438a.836.836 0 0 1 1.175.022l3.225 3.349zm0-15.3c.938 0 1.7.893 1.7 1.995v14.01c0 1.102-.762 1.995-1.7 1.995h-15.3c-.939 0-1.7-.893-1.7-1.995V4.995C2.389 3.893 3.15 3 4.089 3h15.3zm-5.525 7.275a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4z"></path>
                                  </svg>
                                  <div className="bzPLnz">
                                    <h1>
                                      {" "}
                                      <span>{ t("Homepageheader._Dragdrop")} </span>
                                    </h1>
                                  </div>
                                  <p className="egCyIy">
                                    <span>
                                    { t("Homepageheader._Upload10photos")}.
                                    </span>
                                    <br />
                                    <span>
                                    { t("Homepageheader._ImagesPNGJPG")}
                                    </span>
                                  </p>
                                </div>
                              </div>}
                              {this.state.editID && <div className="addImage"><svg viewBox="0 0 24 24" width="32" height="32" class="sc-jTzLTM fznnpf"><path d="M10.75 10.75H8a1.25 1.25 0 0 0 0 2.5h2.75V16a1.25 1.25 0 0 0 2.5 0v-2.75H16a1.25 1.25 0 0 0 0-2.5h-2.75V8a1.25 1.25 0 0 0-2.5 0v2.75zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg></div>}
                                </>
                                )
                              //addRemoveLinks: true,
                             
                            }}
                          />}
                        </div>
                      </div>
                    </GridContainer>
                  </div>
                ) : (
                  ""
                )}
                <div className="aligntrllocat"> 
                {HQimageError && <small style={{ color: "red" }}> { t("Homepageheader._RemoveImages")}</small>}</div>               
                {this.state.catemap ? (
                  <div>
                    {" "} 
                    { <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <Card>
                          <CardBody>
                          <div className="aligntrllocat"> 
                          {this.state.errorsSellStuff.location && <small style={{ color: "red" }}>{this.state.errorsSellStuff.location}</small>}
                           </div>
                            <CustomSkinMap
                              onBoundsChanged={this.onBoundsChanged}
                              onMapLoad={this.handleMapLoad}
                              onDragEnd={this.handleMapDrag}
                              onSearchBoxMounted={this.handleSearchBoxMounted}
                              bounds={bounds}
                              onPlacesChanged={this.handlePlacesChanged}
                              onCenterChanged={this.onCenterChanged}
                              center={center}
                              changeInMap={this.changeInMap}
                              lat={lat}
                              lng={lng}
                              t={t}
                              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleApi}&libraries=places`}
                              loadingElement={
                                <div style={{ height: `100%` }} />
                              }
                              containerElement={
                                <div
                                  style={{
                                    height: `280px`,
                                    borderRadius: "6px",
                                    overflow: "hidden"
                                  }}
                                />
                              }
                              mapElement={<div style={{ height: `100%` }} />}
                            />
                            <img
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%"
                              }}
                              src={marker}
                              alt="..."
                            />
                          </CardBody>
                        </Card>
                      </GridItem>
                    </GridContainer>}
                {
                    filterData.length > 0 &&  filterData.map((x,index) =>
                    x.inputTag === "dropdown" ?
                    <GridContainer>
                    <GridItem xs={12} sm={12}>
                      <h6 className="cls_h6">{x.name} {x.isMandatory ? <span className="validatcolor">*</span> : ""}</h6>
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel htmlFor={x.filterId} className={classes.selectLabel}>
                          choose {x.name}
                        </InputLabel>
                        <Select
                          MenuProps={{ className: classes.selectMenu }}
                          classes={{ select: classes.select }}
                          value={values[x.filterId] && values[x.filterId].fieldChild || []}
                          onChange={(event) => this.FilterCategorychange(event, x.filterId)}
                          inputProps={{ name: "fieldChild", id: "fieldChild" }}
                        >
                          <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
                            Choose {x.name}
                          </MenuItem>
                        {
                          x.values[0].valueChild.map((z,i) =>{
                              return  <MenuItem
                              key={i}
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={z.valueChildId}
                            >
                          {z.valueChildData}
                          </MenuItem>
                          })
                        }
                        
                        </Select>
                      </FormControl>
                      {!!errors[x.filterId] ? (
                        <FormHelperText error={!!errors[x.filterId]}>
                          {errors[x.filterId]}
                        </FormHelperText>
                      ) : (
                        ""
                      )}
              </GridItem>
            </GridContainer>
            : x.inputTag === "range" ? <GridContainer>
            <GridItem xs={12} sm={12}>
            <h6 className="cls_h6">{x.name} {x.isMandatory ? <span className="validatcolor">*</span> : ""}</h6>
            </GridItem>
            <GridItem xs={12} sm={12} className="cls_inrange">
            {localStorage.getItem("lang") === "ar" ? (
              <InputRange
                maxValue={x.max}
                minValue={x.min}
                direction="rtl"
                value={values && values[x.filterId] && values[x.filterId].rangeValue || x.min} 
                onChange={event =>this.Rangechange(event, x.filterId,"rangeValue")}
              />
               ) : (
                <InputRange
                maxValue={x.max}
                minValue={x.min}
                value={values && values[x.filterId] && values[x.filterId].rangeValue || x.min} 
                onChange={event =>this.Rangechange(event, x.filterId,"rangeValue")}
              />
              )}
                {!!errors[x.filterId] ? (
                  <FormHelperText error={!!errors[x.filterId]}>
                    {errors[x.filterId]}
                  </FormHelperText>
                ) : (
                  ""
                )}
             </GridItem>
       </GridContainer> 
         : x.inputTag === "multilevel" &&
         <>
            <GridContainer>
              <GridItem xs={12} sm={12}>
                <h6 className="cls_h6">{x.name} {x.isMandatory ? <span className="validatcolor">*</span> : ""}</h6>
              </GridItem>
              <GridItem xs={12} sm={12}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="multilevel" className={classes.selectLabel}>
                      choose {x.name}
                  </InputLabel>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={values[x.filterId] && values[x.filterId].fieldParent || []}
                    onChange={(event) => this.FilterCategorychange(event, x.filterId)}
                    inputProps={{ name: "fieldParent", id: "fieldParent" }}
                  >
                    <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
                      Choose {x.name}
                    </MenuItem>
                    {
                      x.values.map((z,i) =>{
                          return <MenuItem
                          key={i}
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value={z.valueParent}
                        >
                       {z.valueParent}
                      </MenuItem>
                      })
               
                  }
                  </Select>
                </FormControl>
                {(!!errors[x.filterId] && !(values && values[x.filterId] && values[x.filterId].fieldParent)) ? (
                  <FormHelperText error={!!errors[x.filterId]}>
                    {errors[x.filterId]}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </GridItem>
              </GridContainer>
              { values && values[x.filterId] && values[x.filterId].fieldParent && <GridContainer>
              <GridItem xs={12} sm={12}>
              </GridItem>
              <GridItem xs={12} sm={12}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor="multi childlevel" className={classes.selectLabel}>
                      Choose {values[x.filterId] && values[x.filterId].fieldParent}
                  </InputLabel>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={values[x.filterId] && values[x.filterId].fieldChild || []}
                    onChange={(event) => this.FilterCategorychange(event, x.filterId, values[x.filterId].fieldParent)}
                    inputProps={{ name: "fieldChild", id: "fieldChild" }}
                  >
                    <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
                        Choose {values[x.filterId] && values[x.filterId].fieldParent}
                    </MenuItem>
                          {
                             x.values && ( (x.values.find((v) => {
                              return v.valueParent === (values[x.filterId] && values[x.filterId].fieldParent)
                             }) || {}).valueChild || []).map((z,i) =>{
                              return <MenuItem
                                      key={i}
                                      classes={{
                                        root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value={z.valueChildId}
                                        >
                                      {z.valueChildData}
                                </MenuItem>
                              })
                          }
                  </Select>
                </FormControl>
                {(!!errors[x.filterId] && !(values && values[x.filterId] && values[x.filterId].fieldChild)) ? (
                  <FormHelperText error={!!errors[x.filterId]}>
                    {errors[x.filterId]}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </GridItem>
              </GridContainer>  }
              </>
            
          )}
            <GridContainer>
              <GridItem xs={12} sm={12}>
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
                              <GridItem xs={12} sm={12}>
                               <h6 className="cls_h6">{ t("Homepageheader._ChooseLanguage")}
                            {properties.langCode === "" ? (
                              <>
                            {this.state.errorsSellStuff.langCode && <small style={{ color: "red" }}>{this.state.errorsSellStuff.langCode}</small>} </> ) : "" }
                            </h6>
                              </GridItem>
                              <GridItem xs={12} sm={12}>
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
                                    filteredLang.filter(item => item.status === "Active").map((item, index) => {
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
                                  { t("Homepageheader._ChooseLanguage")}
                                  </MenuItem>
                                  {totalLanguages &&
                                    totalLanguages.length > 0 &&
                                    totalLanguages.filter(item => item.status === "Active").map((item, index) => {
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

                         
                              </FormControl>
                              </GridItem>
                            </GridContainer>
                            <br></br>
                          <GridContainer>
                              <GridItem xs={12} sm={12}>
                               <h6 className="cls_h6"> {" "}
                           { t("Homepageheader._Title")}{" "}
                            {properties.title === "" ? (
                              <>
                            {this.state.errorsSellStuff.title && <small style={{ color: "red" }}>{this.state.errorsSellStuff.title}</small>} </> ) : "" }
                            </h6>
                                
                              </GridItem>

                              <GridItem xs={12} sm={12}>
                              <CustomInput
                              id="title"
                              formControlProps={{ fullWidth: true }}
                              error={!!errors["title"]}
                              success={!!errors["title"]}
                              helpText={errors["title"]}
                              inputProps={{
                                name: "title",
                                onChange: this.handleChange,
                                value: properties ? properties.title : "",
                                autoComplete: "off"
                              }}
                              />

                              </GridItem>
                              </GridContainer>

                              <GridContainer>
                             

                              <GridItem xs={12} sm={12}>
                              <h6 class="cls_h6">  { t("Homepageheader._Description")}</h6>
                            

                           <TextField
                              id="description"
                              multiline
                              rows="5"
                              //defaultValue="Default Value"
                              color="secondary"
                              className={classes.textField+" textArea"}
                              inputProps={{
                                name: "description",
                                onChange: this.handleChange,
                                value: properties ? properties.description : "",
                                maxLength: 1500,
                                autoComplete: "off"
                              }}    
                            />
                            {this.state.descCount != "" ? this.state.descCount : 0 }/1500
                              </GridItem>

                              </GridContainer>
                              <GridContainer>
                            

                              <GridItem xs={12} sm={12}>

                              {
                              filteredLang && filteredLang.length > 0 &&
                              <>
                              <Button
                              color="rose"
                              type="button"
                              onClick={this.onClick}
                              //disabled={disableLang}
                              >
                              Add Language
                              </Button>
 
                                </>
                              }
                              </GridItem>
                              </GridContainer>

                             </> }

                    <GridContainer>
                      <GridItem xs={12} sm={4}>
                        <h6 class="cls_h6">  { t("Homepageheader._IsFree")} </h6>
                      </GridItem>
                      <GridItem xs={12} sm={8}>
                        <div style={{ paddingTop: "25px" }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={isFree}
                                onChange={event => this.change(event, "isFree")}
                                value={String(isFree)}
                                classes={{
                                  switchBase: classes.switchBase,
                                  checked: classes.switchChecked,
                                  icon: classes.switchIcon,
                                  iconChecked: classes.switchIconChecked,
                                  bar: classes.switchBar
                                }}
                              />
                            }
                          />
                        </div>
                      </GridItem>
                    </GridContainer>
                    {!isFree && (
                      <GridContainer>
                        <GridItem xs={12} sm={12}>
                          <h6 class="cls_h6">  {" "}
                             { t("Homepageheader._Rate")} <span class="validatcolor">*</span>{" "}
                            {this.state.errorsSellStuff.isFree && <small style={{ color: "red" }}>{this.state.errorsSellStuff.isFree}</small>} </h6>
                          <CustomInput
                            id="rate"
                            error={!!errors["rate"]}
                            success={!!errors["rate"]}
                            helpText={errors["rate"]}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: event => this.change(event, "rate"),
                              type: "number",
                              autoComplete: "off",
                              value: rate
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    )}
                    {!isFree && (
                      <GridContainer>
                        <GridItem xs={12} sm={12}>
                         <h6 class="cls_h6"> { t("Homepageheader._CurrencyCode")} </h6>
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                          >
                            <InputLabel
                              htmlFor="currency"
                              className={classes.selectLabel}
                            >
                              {!(currencyCode || defaultCurrency) &&
                                "Choose Currency"}
                            </InputLabel>
                            <Select
                            value={currencyCode}
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              classes={{
                                select: classes.select
                              }}
                              
                              onChange={event =>
                                this.change(event, "currencyCode")
                              }
                              inputProps={{
                                name: "currency",
                                id: "currency"
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                { t("Homepageheader._ChooseCurrency")}
                              </MenuItem>
                              {currencyInfo.getCurrencies
                                ? currencyInfo.getCurrencies.map((cur, i) => {
                                    return (
                                      <MenuItem
                                        key={i}
                                        classes={{
                                          root: classes.selectMenuItem,
                                          selected:
                                            classes.selectMenuItemSelected
                                        }}
                                        value={cur.code}
                                      >
                                        {cur.code}
                                      </MenuItem>
                                    );
                                  })
                                : ""}
                            </Select>
                          </FormControl>
                        </GridItem>
                      </GridContainer>
                    )} 
                    <div className="fottebtnd">
                      <GridItem xs={12} sm={12}>
                        <button
                          size="sm"
                          className= { classes.btnPrimary + " " + "djLvqt"}
                          onClick={this.handleSubmit} 
                          disabled={isButtonDisabled}                         
                        >
                          {" "}
                          { t("Homepageheader._Done")}
                        </button>
                      </GridItem>{" "}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}

          <div>
          {this.state.productlist ? (
              <div className={REACT_APP_ENV !== "package" ? "": "conmess"}>
                <div className={REACT_APP_ENV !== "package" ? "": "wrat"}>
                  
                      <div className={REACT_APP_ENV !== "package" ? "nopacke": "innercongrat"}>
                        <h1> { t("Homepageheader._Congratulations")}</h1>
                        <p className="hEdZD"> { t("Homepageheader._Yourlisting")} {postListmsg}. </p>
                        <div> 
                          { this.state.futureList ?  (
                            <Payments closeSlidingPanel = {this.props.closeSlidingPanel} />):(<div>
                              <div className="postingg">
                                <button type="button" className="bcSoLl">
                                  {" "}
                                  <span onClick={this.postOther}>
                                    {" "}
                                    { t("Homepageheader._Postanother")}
                                  </span>
                                </button>
                               
      
                              </div>
                            
                         
                        { REACT_APP_ENV !== "package" && <div className={REACT_APP_ENV !== "package" ? "peolpnear nopacke": "peolpnear "} >
                            <p className="peoplenearvalue">
                             
                            { t("Homepageheader._Peoplenear")} <br />
                              <b>{ t("Homepageheader._gotany")}</b>
                            </p>
                            <div className="tss">
                              <div className="cgKAdd">
                                <div className="gcWmdh">
                                <img src={StaicImg2} alt="" />
                                </div>
                                <div className="bvCUu mgdf">
                                  <p className="hHaDQu">
                                    <span> { t("Homepageheader._PS4")} </span>
                                  </p>
                                </div>
                                <div className="bvCUu">
                                  <div className="svficon">
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="16"
                                      height="16"
                                      class="sc-jTzLTM cwKMSO"
                                      fill="#BDBDBD"
                                    >
                                      <path d="M15.75 10a5.75 5.75 0 1 0-11.5 0 5.75 5.75 0 0 0 11.5 0zm1.048 4.676l4.263 4.263a1.5 1.5 0 0 1-2.122 2.122l-4.263-4.263a8.25 8.25 0 1 1 2.121-2.121z"></path>
                                    </svg>
                                  </div>
                                  <p className="jjQxhd">
                                    <span>82,801 </span>
                                  </p>
                                </div>
                              </div>
      
                              <div className="cgKAdd">
                                <div className="gcWmdh">
                                <img src={StaicImg1} alt="" />
                                </div>
                                <div className="bvCUu mgdf">
                                  <p className="hHaDQu">
                                    <span>  { t("Homepageheader._TVs")} </span>
                                  </p>
                                </div>
                                <div className="bvCUu">
                                  <div className="svficon">
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="16"
                                      height="16"
                                      class="sc-jTzLTM cwKMSO"
                                      fill="#BDBDBD"
                                    >
                                      <path d="M15.75 10a5.75 5.75 0 1 0-11.5 0 5.75 5.75 0 0 0 11.5 0zm1.048 4.676l4.263 4.263a1.5 1.5 0 0 1-2.122 2.122l-4.263-4.263a8.25 8.25 0 1 1 2.121-2.121z"></path>
                                    </svg>
                                  </div>
                                  <p className="jjQxhd">
                                    <span>82,801 </span>
                                  </p>
                                </div>
                              </div>
      
                              <div className="cgKAdd">
                                <div className="gcWmdh">
                                <img src={StaicImg} alt="" />
                                </div>
                                <div className="bvCUu mgdf">
                                  <p className="hHaDQu">
                                    <span>  { t("Homepageheader._Bikes")} </span>
                                  </p>
                                </div>
                                <div className="bvCUu">
                                  <div className="svficon">
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="16"
                                      height="16"
                                      class="sc-jTzLTM cwKMSO"
                                      fill="#BDBDBD"
                                    >
                                      <path d="M15.75 10a5.75 5.75 0 1 0-11.5 0 5.75 5.75 0 0 0 11.5 0zm1.048 4.676l4.263 4.263a1.5 1.5 0 0 1-2.122 2.122l-4.263-4.263a8.25 8.25 0 1 1 2.121-2.121z"></path>
                                    </svg>
                                  </div>
                                  <p className="jjQxhd">
                                    <span>82,801 </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>  }
                          </div>)
                          }
                        </div>
                       {/*  <div className="detal" onClick={this.addMoredetails}>
                          {" "}
                          Add more details{" "}fKYHrH middle
                        </div> */}
                        {/* <div className="bwlsAW">
                          <div className="dividerOr">
                            <span> OR </span>
                          </div>
                        </div> */}
                       
                    </div>
                  </div>
                </div>

            ) : (
              ""
            )}
          </div>
      </div>
    );
  }
}

var categorylist = compose(
  graphql(GET_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(GET_LANGUAGES, {name: "getLanguages"}),
  graphql(GET_CURRENCIES, { name: "currencyInfo" }),
  graphql(UPDATE_PRODUCT, { name: "updateProduct" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(CATEGORY_ID, { name: "getCategoryId" }),
  graphql(PRODUCT_ID, { name: "getProductId" }),
  graphql(POPUP_STATE_UPDATE, { name: "updateLoginPopupStatus" }),
  graphql(REDIRECT_HOME_FILTER, {
    name: "redirectHomeFilter"
  }),
  graphql(GET_REDIRECTFILTER_STATE, {
      name: "pageCountFilter",
      options: () => ({
        fetchPolicy: 'cache-only'
      })
    }),
)(Category);

export default withTranslation('common') (withStyles(styles)(categorylist));