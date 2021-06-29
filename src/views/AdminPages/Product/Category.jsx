import React from "react";
import { compose, graphql } from "react-apollo";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import TextField from "@material-ui/core/TextField";
import { GET_ADMIN_CATEGORIES, GET_ALL_USERS } from "../../../queries";
import InputRange from "react-input-range";
import style from "react-input-range/lib/css/index.css";
const {REACT_APP_EDIT_MODE} = process.env;
const style1 = {
  ...extendedFormsStyle,
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  },
  textTransform: {
    textTransform: "none !important"
  }
};

var initialState = {
  make: "",
  model: "",
  category: "",
  categoryId: 0,
  type: "",
  year: "",
  bodyType: "",
  transmission: "",
  fuelType: "",
  driveTrain: "",
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
  filterData:[],
  categoryFields:[],
  values:{},
  regexp : /^[0-9\b]+$/,
};

class CategoryInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }
  sendState() {
    return this.state;
  }

  isValidated() {
    var flag = false,
    error = {};
    let { match } = this.props;
    let id = match.params.id;
    let { categoryId,values,filterData,userId,regexp } = this.state;
   
    if (!id && !userId) {
      error["user"] = "The user name field is required";
    }
    if(!categoryId) {
      error["category"] = "The category field is required";
    }
    if(filterData !== [] && filterData.length > 0){
      filterData.map(z => {
        if(z.inputTag === "range" && z.isMandatory && !values[z.isMandatory]){
          error[z.isMandatory] = "This field is required"
        }
        else if(z.inputTag === "dropdown" && z.isMandatory && !values[z.isMandatory]){
          error[z.isMandatory] = "This field is required"
        }
        else if(z.inputTag === "multilevel" && z.isMandatory){
          if(!values[z.isMandatory]){
            error[z.isMandatory] = "This field is required"
          }else if(values[z.isMandatory] && !values[z.isMandatory]["fieldChild"]) {
            for (let key in values) { 
              if (values.hasOwnProperty(key)) {
                  if(values[z.isMandatory] && !values[key].fieldChild){
                    error[z.isMandatory] = "This field is required"
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
                error[z.isMandatory] = `Range value must be ${z.min} - ${z.max}`
              }
           })
          if(!regexp.test(values[z.isMandatory].rangeValue)){
            error[z.isMandatory] = "Range Value must be a Number"
          }
        }
      })
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
    if (flag) {
      return false;
    }
    return true;
  }

 async componentDidMount() {
    await this.getCategoryDetailsData();
  }

  async componentWillMount() {
      this.setState({
          values:{},
          categoryFields:[]
      })
  }


 
getCategoryDetailsData = async() =>{
  let { match, data, categoryInfo } = this.props;
    const id = match.params.id;
    if (id) {
      let {values} = this.state;
      let currentProduct = data.getAdminByProduct[0];
      categoryInfo.refetch().then(({data}) => {
         if(data && data.getAdminCategoryDetails){
            data.getAdminCategoryDetails.filter(x => x.id == currentProduct.categoryId).map(v => {
              this.setState({
                    filterData : v.fields,
                    values:{},
                    categoryFields:[]
                })
            })
            let newObj = currentProduct.categoryFieldsInfo;

            for (var key in newObj) {
              if (newObj.hasOwnProperty(key)) {
              delete newObj[key].__typename
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
              this.setState({ values})
            }
          }

          let categoryFields = [];
          for (var key in values) {
             categoryFields.push(values[key]);
          }
        
          this.setState({
            categoryId: currentProduct.categoryId,
            categoryFields,
            category: currentProduct.categoryId.toString(),
            sellingStatus: currentProduct.sellingStatus,
            status: currentProduct.status
          });
        } 
      })
    }
    else{
      this.setState({
         values:{},
         categoryFields:[]
      })
    }
  }


  componentWillUnmount(){
    this.setState({
      values:{},
      categoryFields:[]
   })
  }

  Rangechange = (value,fieldId,name) => {
    let { match } = this.props;
    let {values} = this.state;
    const id = match.params.id;
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
        editData: Object.assign( {},this.state.editData,id && { categoryFields })
      })
  }


  change(event,fieldId,parentValue) {
    let { match,categoryInfo } = this.props;
    let {values} = this.state;
    const id = match.params.id;
    let { errors } = this.state;
    let {name,value} = event.target
    if (name === "category") {
      categoryInfo.getAdminCategoryDetails && categoryInfo.getAdminCategoryDetails.filter(x => x.id == value).map(v => {
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
        editData: Object.assign( {},this.state.editData,id && { "categoryId": parseInt(value) })
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
          editData: Object.assign( {},this.state.editData,id && { categoryFields })
        })
       }else if(fieldId && parentValue){
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
          editData: Object.assign( {},this.state.editData,id && { categoryFields })
        })
       }
    else if (name === "userId") {
      let userName = (
        this.props.usersInfo.getAllUsers.find(
          (u) => Number(u.id) === Number(value)
        ) || {}
      ).userName;
      this.setState({
        [name]: value,
        userName,
        errors
      });
    }
    else if(name === "status") {
      this.setState({
        [name]: value,
        editData: Object.assign(
          {},
          this.state.editData,
          id && { [name]: value }
        )
      });
    } 
    else if(name === "sellingStatus") {
      this.setState({
        [name]: value,
        editData: Object.assign(
          {},
          this.state.editData,
          id && { [name]: value }
        )
      });
    }
  }

  render() {
    const { classes, categoryInfo, match, usersInfo } = this.props;
    const id = match.params.id;
    const {
      sellingStatus,
      status,
      categoryId,
      category,errors,filterData,values,categoryFields
    } = this.state;
    
    return (
      <GridContainer>
        <GridContainer>
            <GridItem xs={12} sm={2}>
                <FormLabel className={classes.labelHorizontal}>
                  {" "}
                  Category<span className="validatcolor">*</span>{" "}
                </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={5}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="category" className={classes.selectLabel}>
                  {!categoryId && "Choose Category"}
                </InputLabel>
                <Select
                  MenuProps={{ className: classes.selectMenu }}
                  classes={{ select: classes.select }}
                  value={category}
                  onChange={(event) => this.change(event)}
                  inputProps={{ name: "category", id: "category" }}
                >
                  <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
                    {" "}
                    Choose Category{" "}
                  </MenuItem>
                  {categoryInfo.getAdminCategoryDetails
                    ? categoryInfo.getAdminCategoryDetails.map((cat, index) => {
                          let c1 = cat.language
                            .filter((v) => v.langCode === "en")
                            .map((x) => {
                              return x.name;
                            });
                          return (
                            <MenuItem
                              key={index}
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={cat.id}
                            >
                              {c1}
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
            {
              filterData.length > 0 &&  filterData.map((x,index) =>
              x.inputTag === "dropdown" ?
              <GridContainer>
              <GridItem xs={12} sm={2}>
                <FormLabel className={classes.labelHorizontal}>
                 {x.name} {x.isMandatory ? <span className="validatcolor">*</span> : ""}
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={5}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor={x.filterId} className={classes.selectLabel}>
                     choose {x.name}
                  </InputLabel>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={values[x.filterId] && values[x.filterId].fieldChild || []}
                    onChange={(event) => this.change(event, x.filterId)}
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
              <GridItem xs={12} sm={2}>
                <FormLabel className={classes.labelHorizontal}>
                {x.name}{x.isMandatory ? <span className="validatcolor">*</span> : ""}
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={5} className="cls_inrange cls_adinrange">
                <InputRange
                  maxValue={x.max}
                  minValue={x.min}
                  value={values && values[x.filterId] && values[x.filterId].rangeValue || x.min} 
                  onChange={event =>this.Rangechange(event, x.filterId,"rangeValue")}
                />
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
              <GridItem xs={12} sm={2}>
                <FormLabel className={classes.labelHorizontal}>
                  {x.name} {x.isMandatory ? <span className="validatcolor">*</span> : ""}
                </FormLabel>
              </GridItem>
              <GridItem xs={12} sm={5}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor={x.filterId} className={classes.selectLabel}>
                     choose {x.name}
                  </InputLabel>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={values[x.filterId] && values[x.filterId].fieldParent || []}
                    onChange={(event) => this.change(event, x.filterId)}
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
              { values && values[x.filterId] && values[x.filterId].fieldParent &&  <GridContainer>
                <GridItem xs={12} sm={2}>  </GridItem>
                <GridItem xs={12} sm={5}>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel htmlFor={x.filterId} className={classes.selectLabel}>
                      Choose {values && values[x.filterId] && values[x.filterId].fieldParent}
                  </InputLabel>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={values[x.filterId] && values[x.filterId].fieldChild || []}
                    onChange={(event) => this.change(event, x.filterId, values[x.filterId].fieldParent)}
                    inputProps={{ name: "fieldChild", id: "fieldChild" }}
                  >
                    <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
                        Choose {values && values[x.filterId] && values[x.filterId].fieldParent}
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
               ) 
               }
       
        <GridContainer>
          <GridItem xs={12} sm={2}>
            <FormLabel className={classes.labelHorizontal}>
              Selling Status
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={5}>
            <FormControl fullWidth className={classes.selectFormControl}>
              <InputLabel
                htmlFor="sellingStatus"
                className={classes.selectLabel}
              >
                {!sellingStatus && "Choose Selling Status"}
              </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                classes={{
                  select: classes.select
                }}
                value={sellingStatus}
                onChange={(event) => this.change(event)}
                inputProps={{
                  name: "sellingStatus",
                  id: "sellingStatus"
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem
                  }}
                >
                  Choose Selling Status
                </MenuItem>
                {["ForSale", "SoldOut"].map((ss, index) => {
                  return (
                    <MenuItem
                      key={index}
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={ss}
                    >
                      {ss}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={2}>
            <FormLabel className={classes.labelHorizontal}>
              Product Status
            </FormLabel>
          </GridItem>
          <GridItem xs={12} sm={5}>
            <FormControl fullWidth className={classes.selectFormControl}>
              <InputLabel htmlFor="status" className={classes.selectLabel}>
                {!status && "Choose Product Status"}
              </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                classes={{
                  select: classes.select
                }}
                value={status}
                onChange={(event) => this.change(event)}
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
                  Choose Selling Status
                </MenuItem>
                {["Rejected", "Approved"].map((ss, index) => {
                  return (
                    <MenuItem
                      key={index}
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={ss}
                    >
                      {ss}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </GridItem>
        </GridContainer>
        {!id ? (
          <GridContainer>
            <GridItem xs={12} sm={2}>
              <FormLabel className={classes.labelHorizontal}>
                {" "}
                User Name<span className="validatcolor">*</span>{" "}
              </FormLabel>
            </GridItem>
            <GridItem xs={12} sm={5}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel htmlFor="userName" className={classes.selectLabel}>
                  {!this.state.userId && "Choose User Name"}
                </InputLabel>
                <Select
                  MenuProps={{ className: classes.selectMenu }}
                  classes={{ select: classes.select }}
                  value={this.state.userId}
                  onChange={(event) => this.change(event)}
                  inputProps={{ name: "userId", id: "userId" }}
                >
                  <MenuItem disabled classes={{ root: classes.selectMenuItem }}>
                    {" "}
                    Choose User Name
                  </MenuItem>
                  {usersInfo.getAllUsers
                    ? usersInfo.getAllUsers
                        .filter((u) => u.status === "Active")
                        .map((user, index) => {
                          var b = "***";
                          var c = user.email.split("@");
                          var a = c[0].slice(0, -3);
                          var d = a.concat(b).concat("@").concat(c[1]);
                          return (
                            <MenuItem
                              key={index}
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected
                              }}
                              value={user.id}
                            >
                              {user.userName} - {REACT_APP_EDIT_MODE === "prod" ? d : user.email}
                            </MenuItem>
                          );
                        })
                    : ""}
                </Select>
              </FormControl>
              {!!errors["user"] ? (
                <FormHelperText error={!!errors["user"]}>
                  {errors["user"]}
                </FormHelperText>
              ) : (
                ""
              )}
            </GridItem>
          </GridContainer>
        ) : (
          ""
        )}
        </GridContainer>
        )}
      }

var product = compose(
  graphql(GET_ADMIN_CATEGORIES, {
    name: "categoryInfo"
  }),
  graphql(GET_ALL_USERS, { name: "usersInfo" })
);

var enhance = withStyles(style1)(CategoryInfo);

export default product(enhance);
