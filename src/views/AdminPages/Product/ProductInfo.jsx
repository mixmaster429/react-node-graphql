import React from "react";
import { graphql, Query, compose } from "react-apollo";

// react spinner component
import { css } from "@emotion/core";
import { ClipLoader } from "react-spinners";

// core components
import Wizard from "../../../components/Wizard/Wizard.jsx";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";

import {prepareData} from "../../../helper.js";
import {UPDATE_PRODUCT, GET_ADMIN_BY_PRODUCT, UPDATE_TOGGLE_STATUS} from "../../../queries";

import BasicInfo from "./BasicInfo.jsx";
import ImageInfo from "./ImageInfo.jsx";
import LocationDetails from "./Location.jsx";
import Category from "./Category.jsx";
const {REACT_APP_EDIT_MODE} = process.env;
const initialState = {
  popUpDetails: [],
  loading: false
};

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
  }

  finishButtonClick(e, id) {
      var result = prepareData(e, id);
      this.setState({
        loading: true
      });
      if(REACT_APP_EDIT_MODE !== "prod"){
      this.props.updateProduct({
        variables: { id: Number(id), data: result }
      }).then(async ({data}) => {
        if (data.updateProduct) {
          this.props.updateToggle({variables: { 
            toggleStatus: true,
            message: id
            ? "Product Updated Successfully"
            : "Product Added Successfully"
          }});
          this.props.history.push("/admin/products");
        }
    }).catch((error) => {
      //console.log(error);
      this.setState({
        loading: false
      });
      this.setState({
        popUpDetails: error.graphQLErrors.map((x) => x.message)
      });
    });
  } else{
    let error = ["Add/Edit Restricted for Live"];
    this.setState({
      popUpDetails: error 
    });
  }
  }

  clearState() {
    this.setState({...initialState});
  }
  render() {
    let {match} = this.props;
    let {popUpDetails} = this.state;
    const id = match.params.id;
    return (
      <div>
        <GridContainer style={{
          position: "fixed",
          top: "50%",
          bottom: "50%",
          left: "50%",
          zIndex: 2}}>
        <div className="sweet-loading">
        <ClipLoader
          css={override.styles}
          sizeUnit={"px"}
          size={100}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
      </GridContainer>
         <GridContainer justify="center" style={{zIndex: 1}}>
        <GridItem xs={12} sm={12}>
        <Query query={GET_ADMIN_BY_PRODUCT} variables={{id: Number(id)}} fetchPolicy="no-cache">
      {({ data, loading, error }) => {
              if (loading && id){
                return <div>Loading</div>;
              }
              if (error && id){
                return <div>error</div>;
              } 
          return <Wizard
            match={this.props.match}
            data={data || []}
            validate
            steps={[
              { stepName: "Details", stepComponent: BasicInfo, stepId: "generalInfo" },
              { stepName: "Image Upload", stepComponent: ImageInfo, stepId: "imageInfo" },
              { stepName: "Location", stepComponent: LocationDetails, stepId: "locationInfo" },
              { stepName: "Category & Status", stepComponent: Category, stepId: "categoryInfo" }
            ]}
            title={id ? "Edit Product" : "Create Product"}
            finishButtonText="Submit"
            loading={this.state.loading}
            finishButtonClick={(e) => this.finishButtonClick(e, id)}
          />;
           }}
          </Query>
        </GridItem>
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
        </GridContainer>
      </div>
    );
  }
}

const MutatedProduct = compose(
  graphql(UPDATE_PRODUCT, {name: "updateProduct"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(Product);
export default MutatedProduct;
