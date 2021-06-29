// import React from "react";
// import { Mutation, compose, graphql } from "react-apollo";
// // @material-ui/core components
// import withStyles from "@material-ui/core/styles/withStyles";
// import FormLabel from "@material-ui/core/FormLabel";
// import FormHelperText from "@material-ui/core/FormHelperText";
// // material ui icons
// import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// // core components
// import GridContainer from "../../../components/Grid/GridContainer.jsx";
// import GridItem from "../../../components/Grid/GridItem.jsx";
// import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
// import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
// import Button from "../../../components/CustomButtons/Button.jsx";
// import Card from "../../../components/Card/Card.jsx";
// import CardHeader from "../../../components/Card/CardHeader.jsx";
// import CardText from "../../../components/Card/CardText.jsx";
// import CardBody from "../../../components/Card/CardBody.jsx";
// import CardFooter from "../../../components/Card/CardFooter.jsx";
// // style for this view
// import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
// import extendedFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

// import {
//   UPDATE_FEEDBACK,
//   GET_FEEDBACK,
//   UPDATE_TOGGLE_STATUS
// } from "../../../queries";

// const styles = {
//   ...validationFormsStyle,
//   ...extendedFormsStyle,
//   cardTitle: {
//     ...validationFormsStyle.cardTitle,
//     color: "white"
//   }
// };

// const initialState = {
//   name: "",
//   description: "",
//   feedbackType: "",
//   status: "",
//   nameState: {},
//   errors: {},
//   descriptionState: {},
//   popUpDetails: [],
//   editData: {}
// };

// class FeedBackInfo extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       ...initialState
//     };
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.change = this.change.bind(this);
//   }

//   componentWillMount() {
//     let { getfeedBackInfo, match } = this.props;
//     let id = match.params.id;
//     if (id) {
//       getfeedBackInfo.refetch({ id: Number(id) });
//     }
//   }
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.getfeedBackInfo && nextProps.getfeedBackInfo.getFeedBack) {
//       let {
//         name,
//         description,
//         feedbackType,
//         status
//       } = nextProps.getfeedBackInfo.getFeedBack;
//       this.setState({
//         name: name,
//         description: description,
//         status: status,
//         feedbackType: feedbackType
//       });
//     }
//   }

//   clearState() {
//     this.setState({ ...initialState });
//   }

//   validateInput() {
//     let { name, errors, feedbackType, status, description } = this.state;
//     let { match } = this.props;
//     let id = match.params.id;
//     let error = {},
//       flag = false;
//     if (errors.image){
//       error.image = errors.image;
//     }
//     if (!name){
//       error.name = "The name field is required.";
//     }
//     else{
//       error.name = "";
//     } 
//     if (!feedbackType){
//       error.feedbackType = "The type field is required.";
//     } 
//     else{
//       error.feedbackType = "";  
//     } 
//     if (!status){
//       error.status = "The status field is required";
//     } 
//     else {
//       error.status = "";
//     }
//     if (!description) {
//       error.description = "The description field is required";
//     }
//     else {
//       error.description = "";
//     }
//     this.setState({
//       errors: error
//     });

//     flag = Object.keys(error).find((obj) => {
//       if (error[obj]){
//         return true;
//       } 
//       return false;
//     });
//     if (id) {
//       if (Object.keys(this.state.editData).length) return flag;
//       else return true;
//     }
//     return flag;
//   }

//   handleSubmit(event, feedBack) {
//     event.preventDefault();
//     let id = this.props.match.params.id;
//     if (!this.validateInput()) {
//       feedBack()
//         .then(async ({ data }) => {
//           if (data.updateFeedBack) {
//             this.props.updateToggle({
//               variables: {
//                 toggleStatus: true,
//                 message: id
//                   ? "FeedBack Updated Successfully"
//                   : "FeedBack Added Successfully"
//               }
//             });
//             this.props.history.push("/admin/feedbacks");
//           }
//         })
//         .catch((error) => {
//           this.setState({
//             popUpDetails: error.graphQLErrors.map(x => x.message)
//           });
//         });
//     }
//   }

//   change(id, event, stateName) {
//     this.setState({ [stateName]: event.target.value });
//     if (id) {
//       this.setState({
//         editData: Object.assign({}, { id: Number(id) }, this.state.editData, {
//           [stateName]: event.target.value && event.target.value.trim()
//         })
//       });
//     }
//   }

//   render() {
//     const { classes, match } = this.props;
//     //var gotCategoryies = this.propscategoriesInfo.getCategoryDetails && categoriesInfo.getCategoryDetails.category;
//     const id = match.params.id;
//     const {
//       name,
//       description,
//       feedbackType,
//       editData,
//       errors,
//       popUpDetails,
//       status
//     } = this.state;
//     const variables = id
//       ? editData
//       : {
//           name: name.trim(),
//           description: description.trim(),
//           feedbackType: feedbackType.trim(),
//           status: status.trim()
//         };
//     return (
//       <GridContainer>
//         <GridItem xs={12} sm={12} md={12}>
//           <Mutation mutation={UPDATE_FEEDBACK} variables={variables}>
//             {(feedBack, { data, loading, error }) => {
//               return (
//                 <form onSubmit={event => this.handleSubmit(event, feedBack)}>
//                   <Card>
//                     <CardHeader color="rose" text>
//                       <CardText color="rose">
//                         <h4 className={classes.cardTitle}>
//                           {id ? "Edit Feedback" : "Add Feedback"}
//                         </h4>
//                       </CardText>
//                     </CardHeader>
//                     <CardBody>
//                       <GridContainer>
//                         <GridItem xs={12} sm={2}>
//                           <FormLabel className={classes.labelHorizontal}>
//                             Name<span className="validatcolor">*</span>
//                           </FormLabel>
//                         </GridItem>
//                         <GridItem xs={12} sm={10}>
//                           <CustomInput
//                             id="name"
//                             error={!!errors.name}
//                             success={!!errors.name}
//                             helpText={errors.name}
//                             formControlProps={{
//                               fullWidth: true
//                             }}
//                             inputProps={{
//                               onChange: (event) => this.change(id, event, "name"),
//                               type: "text",
//                               value: name,
//                               autoComplete: "off"
//                             }}
//                           />
//                         </GridItem>
//                       </GridContainer>
//                       <GridContainer>
//                         <GridItem xs={12} sm={2}>
//                           <FormLabel className={classes.labelHorizontal}>
//                             Description
//                           </FormLabel>
//                         </GridItem>
//                         <GridItem xs={12} sm={10}>
//                           <CustomInput
//                             id="description"
//                             error={!!errors.description}
//                             success={!!errors.description}
//                             helpText={errors.description}
//                             formControlProps={{
//                               fullWidth: true
//                             }}
//                             inputProps={{
//                               onChange: (event) =>
//                                 this.change(id, event, "description"),
//                               type: "text",
//                               value: description,
//                               autoComplete: "off"
//                             }}
//                           />
//                         </GridItem>
//                       </GridContainer>
//                       <GridContainer>
//                         <GridItem xs={12} sm={2}>
//                           <FormLabel className={classes.labelHorizontal}>
//                             Type<span className="validatcolor">*</span>
//                           </FormLabel>
//                         </GridItem>
//                         <GridItem xs={12} sm={3}>
//                           <FormControl
//                             fullWidth
//                             className={classes.selectFormControl}
//                           >
//                             <InputLabel
//                               htmlFor="feedbackType"
//                               className={classes.selectLabel}
//                             >
//                               {!feedbackType && "Choose Type"}
//                             </InputLabel>
//                             <Select
//                               MenuProps={{
//                                 className: classes.selectMenu
//                               }}
//                               classes={{
//                                 select: classes.select
//                               }}
//                               inputProps={{
//                                 onChange: (event) =>
//                                   this.change(id, event, "feedbackType"),
//                                 value: feedbackType,
//                                 autoComplete: "off",
//                                 name: "feedbackType",
//                                 id: "feedbackType"
//                               }}
//                             >
//                               <MenuItem
//                                 disabled
//                                 classes={{
//                                   root: classes.selectMenuItem
//                                 }}
//                               >
//                                 Choose Type
//                               </MenuItem>
//                               {["primary", "secondary"].map((t, i) => {
//                                 return (
//                                   <MenuItem
//                                     key={i}
//                                     classes={{
//                                       root: classes.selectMenuItem,
//                                       selected: classes.selectMenuItemSelected
//                                     }}
//                                     value={t}
//                                   >
//                                     {t}
//                                   </MenuItem>
//                                 );
//                               })}
//                             </Select>
//                           </FormControl>
//                           <FormHelperText error={errors["type"]}>
//                             {errors["type"]}
//                           </FormHelperText>
//                         </GridItem>
//                       </GridContainer>
//                       <GridContainer>
//                         <GridItem xs={12} sm={2}>
//                           <FormLabel className={classes.labelHorizontal}>
//                             Status<span className="validatcolor">*</span>
//                           </FormLabel>
//                         </GridItem>
//                         <GridItem xs={12} sm={4}>
//                           <FormControl
//                             fullWidth
//                             className={classes.selectFormControl}
//                           >
//                             <InputLabel
//                               htmlFor="status"
//                               className={classes.selectLabel}
//                             >
//                               {!status && "Choose Status"}
//                             </InputLabel>
//                             <Select
//                               MenuProps={{
//                                 className: classes.selectMenu
//                               }}
//                               classes={{
//                                 select: classes.select
//                               }}
//                               value={status}
//                               onChange={(event) =>
//                                 this.change(id, event, "status")
//                               }
//                               inputProps={{
//                                 name: "status",
//                                 id: "status"
//                               }}
//                             >
//                               <MenuItem
//                                 disabled
//                                 classes={{
//                                   root: classes.selectMenuItem
//                                 }}
//                               >
//                                 Choose Status
//                               </MenuItem>
//                               <MenuItem
//                                 classes={{
//                                   root: classes.selectMenuItem,
//                                   selected: classes.selectMenuItemSelected
//                                 }}
//                                 value="Active"
//                               >
//                                 Active
//                               </MenuItem>
//                               <MenuItem
//                                 classes={{
//                                   root: classes.selectMenuItem,
//                                   selected: classes.selectMenuItemSelected
//                                 }}
//                                 value="Inactive"
//                               >
//                                 Inactive
//                               </MenuItem>
//                             </Select>
//                           </FormControl>
//                           <FormHelperText error={errors.status}>
//                             {errors.status}
//                           </FormHelperText>
//                         </GridItem>
//                       </GridContainer>
//                     </CardBody>
//                     <CardFooter className={classes.justifyContentCenter}>
//                       <Button type="submit" color="rose">
//                         Submit
//                       </Button>
//                     </CardFooter>
//                     {popUpDetails.length ? (
//                       <Snackbar
//                         place="tc"
//                         color="rose"
//                         message={popUpDetails[0]}
//                         open={!!popUpDetails.length}
//                         closeNotification={() => {
//                           this.setState({ popUpDetails: [] });
//                         }}
//                         close
//                       />
//                     ) : (
//                       ""
//                     )}
//                   </Card>
//                 </form>
//               );
//             }}
//           </Mutation>
//         </GridItem>
//       </GridContainer>
//     );
//   }
// }

// var feedbacks = compose(
//   graphql(GET_FEEDBACK, {
//     name: "getfeedBackInfo"
//   }),
//   graphql(UPDATE_TOGGLE_STATUS, { name: "updateToggle" })
// )(FeedBackInfo);

// export default withStyles(styles)(feedbacks);
