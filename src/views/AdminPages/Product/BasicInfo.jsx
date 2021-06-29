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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

// style for this view
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import { GET_CURRENCIES, GET_LANGUAGES, UPDATE_TOGGLE_STATUS} from "../../../queries";
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


class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLanguages: [],
      values: {
        langCode: "en",
        title: "",
        description: ""
      
      },
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
      displayForm: false,
      isFree: true,
      rate: 0,
      likedUsers: '',
      viewers: '',
      currencyCode: '',
      editData: {},
      errors:{},
      defaultCurrency: '',
      titleError:'',
      langcodeError:'',
      mulTilang:false,
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
  }

  /**
|----------------------------------------------------------------------------------------
| Get all language details from API
|----------------------------------------------------------------------------------------
*/
getAllLanguagesData = () =>{
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
    values,
    totalLanguages
  } = this.state;
  let typeData = "langValid";
  
  this.isValidated();

  if (properties && properties.title && properties.langCode) {
    if (properties.langCode !== currentLang) {
      const nextState = [...selectedLanguage, properties.langCode];
      const prevValues = {...values};
      const prevProps = {...properties};
      this.setState({
        selectedLanguage: nextState,
        selectedLangData: [...selectedLangData, properties],
        currentLang: properties.langCode,
        disableLang: false,
        values: { ...values, langCode: "", title: "", description: "" },
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
            values: prevValues, 
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
        values: { ...values, langCode: "", title: "", description: "" },
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
          //disableLang: true
        });
  }
   if(values.title === '' && values.langCode === ''){
    this.setState ({
    mulTilang:true
    })
    }

};

  /**
|----------------------------------------------------------------------------------------
| Action starts after clicking individual selected language - Button Label
|----------------------------------------------------------------------------------------
*/
handleItemClick = e => {
  const { totalLanguages, selectedLangData, values } = this.state;
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
  let currentValues = { ...values, ...propertyData };
  //let cLang = getLangCode && getLangCode.length > 0 ? 
  this.setState({
    currentLang:langCode,
    properties: propertyData,
    addLanguage: false,
    values: { ...values, ...propertyData },
    displayForm: false
  });
  //this.isValidated();

};
  /**
|----------------------------------------------------------------------------------------
| Action starts after clicking individual selected language - delete
|----------------------------------------------------------------------------------------
*/
handleItemRemove = item => {
  let { selectedLanguage, selectedLangData, values } = this.state;
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
    values: { ...values, ...propertyValue },
    displayForm: false
  });
};

 
handleChange = event => {
  event.persist();
  const { values } = this.state;
  let statValues = values;
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
    values: statValues
  });
  // this.isValidated();

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
|----------------------------------------------------------------------------------------
| Get all existing category details for update form - if id exist
|----------------------------------------------------------------------------------------
*/
getCategoryDetailsData = () =>{
  let {data, match} = this.props;
  let id = match.params.id;
  if(id){
    var getCategory = data && data.getAdminByProduct[0]
     
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
      values:{ ...englishProperty[0], ...getCategory },
      properties:englishProperty[0],
      selectedLangData:res,
      selectedLanguage,
      //imageLink: getCategory.image
    });
  }
 
}



  /**
|----------------------------------------------------------------------------------------
| Image upload action renders
|----------------------------------------------------------------------------------------
*/

sendState() {
    return this.state;
  }

  isValidated() {

    let self = this;
    var error = {}, flag;
    var required = [ "rate"];
    const re =/^(?![0.]+$)\d+(\.\d{1,2})?$/; 
    required.forEach((data) => {
      if (data === "rate") {
        error[data] = (!self.state["isFree"] && !self.state[data]) ? `The ${data} field is required.` : ""
        if(data === "rate" && self.state.rate && (!!(re.test(self.state.rate) === false ) || !!(self.state.rate <= 0))) {
        error[data] = `Please enter valid amount`
        }
      }
      else if (data !== "rate" && !self.state[data]) {
        error[data] = `The ${data} field is required.`;
      } 
      else {
        error[data] = "";
      }
    });
    if(this.state.values.title === ''){
      error.title = 'title required'
      this.setState({
        titleError: "Title is required"
      });
    }
    else{
      error.title = ''
      this.setState({
        titleError: ""
      });
    }
    if(this.state.values.langCode === ''){
      error.langCode = 'langCode required'
      this.setState({
        langcodeError: "Language is required"
      });
    }
    else{
      error.langCode = ''
      this.setState({
        langcodeError: ""
      });
    }


  this.setState({
    errors: error
  });
  flag = Object.keys(error).find((obj) => {
    if (error[obj]) return true;
    return false;
  });
  if (flag) {
    return false;
  }
  return true;
   
  }
  
  

change(event, stateName) {
  
  let {match} = this.props;
  const id = match.params.id;
  var isTrueSet;
  if (stateName === 'isFree') {
    isTrueSet = event.target.value === 'true';
  this.setState({ [stateName]: !isTrueSet});
  } else if (stateName === 'rate' && event.target.value) {
    this.setState({ [stateName]: event.target.value });
  } else {
  this.setState({ [stateName]: event.target.value });
  }

  if (id) {
    if (stateName === 'isFree') {
      isTrueSet = event.target.value === 'true';
      if (!isTrueSet) {
        this.setState({
          editData: Object.assign({}, this.state.editData, {rate: 0, currencyCode: '', [stateName]: !isTrueSet})
        });
      } else {
        this.setState({
          editData: Object.assign({}, this.state.editData, {[stateName]: !isTrueSet})
        });
      }
  } else if (stateName === 'rate') {
    this.setState({
      editData: Object.assign({}, this.state.editData, {[stateName]: Number(event.target.value), currencyCode: this.state.currencyCode})
    });
  } else {
      this.setState({
        editData: Object.assign({}, this.state.editData, {[stateName]: event.target.value})
      });
    }
  }
  //this.isValidated();


}

  /**
|----------------------------------------------------------------------------------------
| Render starts for the page
|----------------------------------------------------------------------------------------
*/

componentWillMount() {
  let {match, data, currencyInfo} = this.props;
  var self = this;
  var defaultCurrency;
  currencyInfo.refetch().then(function(result) {
    if (result && result.data && result.data.getCurrencies.length) {
      var currency = result.data.getCurrencies.find(c => !!c.default);
      defaultCurrency = currency && currency.code
      self.setState({
        defaultCurrency: defaultCurrency
      });
    }
    const id = match.params.id;
    if (id) {
      let currentProduct = data.getAdminByProduct[0]
      self.setState({
        // title: currentProduct.title,
        // description: currentProduct.description,
        isFree: currentProduct.isFree,
        rate: currentProduct.rate,
        likedUsers: currentProduct.likedUsers.length,
        viewers: currentProduct.viewers,
        currencyCode: currentProduct.currencyCode 
        ? currentProduct.currencyCode : defaultCurrency
      })
    } else {
      self.setState({
        currencyCode: defaultCurrency
      });
    }
  });
    // expected output: "foo"
  // if (currencyInfo && currencyInfo.getCurrencies) {
  //   defaultCurrency = currencyInfo.getCurrencies.find(c => !!c.default);
  //   this.setState({
  //     defaultCurrency: defaultCurrency && defaultCurrency.code
  //   });
  // }
}

  render() {
    const {
      title, description, isFree, currencyCode, rate, likedUsers,defaultCurrency,
      values,
      errors,
      popUpDetails,
      properties,
      disableLang,
      selectedLanguage,
      selectedLangData,
      totalLanguages, titleError, langcodeError,
      addLanguage,
      displayForm
    } = this.state;
    const { classes,  currencyInfo, match} = this.props;
    const id = match.params.id;

    let filteredLang = totalLanguages.filter(
        o => !selectedLanguage.includes(o.value)
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
        
            <CardBody>
            
              <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    {/* Choose Language*<span className="validatcolor">*</span> */}
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={5}>
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
                  <GridItem xs={12} sm={5}>
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
                          Choose Language
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

                    <FormHelperText error={langcodeError ? true : false}>
                    {langcodeError}
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

                  <GridItem xs={12} sm={5}>
                <CustomInput
                  id="title"
                  formControlProps={{ fullWidth: true }}
                  error={titleError}
                  helperText={titleError}
                  inputProps={{
                    name: "title",
                    onChange: this.handleChange,
                    value: properties ? properties.title : "",
                    autoComplete: "off"
                  }}
                />
               
               <FormHelperText error={titleError ? true : false}>
                    {titleError}
                  </FormHelperText>
                  </GridItem>
                  </GridContainer>

                  <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                    Description
                    </FormLabel>
                  </GridItem>

                  <GridItem xs={12} sm={5}>
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

                  <GridItem xs={12} sm={5}>
                  
                 {
                  filteredLang && filteredLang.length > 0 &&
                  <>
                  <Button
                  color="rose"
                  type="button"
                  className={this.state.values.title === '' && this.state.values.langCode === '' && this.state.mulTilang == true ? classes.registerButton + ' opacvluw': classes.registerButton + ' noopacvluw' }
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
                
                {/* {id && <GridContainer>
                <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Liked Users
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={5}>
                    <CustomInput
                      id="likedUsers"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event =>
                          this.change(event, "likedUsers"),
                        type: "text",
                        disabled: true,
                        autoComplete: "off",
                        value:likedUsers
                      }}
                    />
                  </GridItem>
                </GridContainer>} */}
               
                      <GridContainer>
                <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Is Free
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={2}>
                  <div style={{paddingTop:'25px'}}><FormControlLabel
                        control={
                          <Switch
                            checked={isFree}
                            onChange={
                              event =>
                              this.change(event, "isFree")
                            }
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
                      /></div>
                  </GridItem>
                  </GridContainer>
                  {!isFree && <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Price<span className="validatcolor">*</span>
                    </FormLabel>
                  </GridItem>
                  
                  <GridItem xs={12} sm={5}>
                    <CustomInput
                      id="rate"
                      error={!!errors['rate']}
                      success={!!errors['rate']}
                      helpText={errors['rate']}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event =>
                          this.change(event, "rate"),
                        type: "number",
                        autoComplete: "off",
                        value:rate
                      }}
                    />
                    <FormHelperText >NOTE: Price Format Like(example: 12.00, 0.48,10000)</FormHelperText>
                  </GridItem>
                </GridContainer>}
                {!isFree && <GridContainer>
                  <GridItem xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Currency Code 
                    </FormLabel>
                  </GridItem>
                  <GridItem xs={12} sm={5}>
                  {/* <FormLabel className={classes.labelHorizontal}>
                      <p><b>USD</b></p>
                  </FormLabel> */}
                     <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="currency"
                            className={classes.selectLabel}
                          >
                            {!id && !(currencyCode || defaultCurrency) && 'Choose Currency'}
                          </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            value={!!currencyCode ? currencyCode : defaultCurrency} 
                            onChange={
                              event =>
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
                              Choose Currency
                            </MenuItem>
                            {
                              currencyInfo.getCurrencies ? currencyInfo.getCurrencies.map((cur, i) => {
                                return <MenuItem
                                key={i}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={cur.code}
                              >
                                {cur.code}
                              </MenuItem>
                              })
                            : ''}
                          </Select>
                        </FormControl> 
                  </GridItem>
                  </GridContainer>}


              
             
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
var product = compose(
 
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
  graphql(GET_LANGUAGES, {name: "getLanguages"}),
  graphql(GET_CURRENCIES, {name: "currencyInfo"})
  
)
var enhance = withStyles(styles)(BasicInfo);

export default product(enhance);

