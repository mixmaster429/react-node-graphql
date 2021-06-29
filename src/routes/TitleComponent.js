import React from "react";
import { graphql, compose } from "react-apollo";
import { GET_META_TAG } from "../queries/index.js";
import {Helmet}  from "react-helmet";

class TitleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      defaultTitle: ""
    };
  }

  componentWillMount() {
    let { getMetatags, titleProps } = this.props;
    getMetatags.refetch().then(({ data }) => {
      if (data && data.getMetatags) {
        const meta = data.getMetatags;
        meta.map(x => {
          if (titleProps && titleProps.location !== "undefined") {
            if (x.pageUrl === titleProps.location.pathname) {
              //console.log("willMount", x.pageUrl === titleProps.location.pathname)
              this.setState({ title: x.pageTitle });
            }
            if (window.location.href.indexOf("products") > -1) {
              if (x.pageUrl.includes("products")) {
                this.setState({ title: x.pageTitle });
              }
            }
            if (window.location.href.indexOf("EditProfile") > -1) {
              if (x.pageUrl.includes("EditProfile")) {
                this.setState({ title: x.pageTitle });
              }
            }
            if (window.location.href.indexOf("SellerDetails") > -1) {
              if (x.pageUrl.includes("SellerDetails")) {
                this.setState({ title: x.pageTitle });
              }
            }
          }
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    let { getMetatags, titleProps } = nextProps;
    getMetatags.refetch().then(({ data }) => {
      if (data && data.getMetatags) {
        const meta = data.getMetatags;
        meta.map(x => {
          if (titleProps && titleProps.location !== "undefined") {
            if (x.pageUrl === titleProps.location.pathname) {
              this.setState({ title: x.pageTitle });
            }
            if (window.location.href.indexOf("products") > -1) {
              if (x.pageUrl.includes("products")) {
                this.setState({ title: x.pageTitle });
              }
            }
            if (window.location.href.indexOf("EditProfile") > -1) {
              if (x.pageUrl.includes("EditProfile")) {
                this.setState({ title: x.pageTitle });
              }
            }
            if (window.location.href.indexOf("SellerDetails") > -1) {
              if (x.pageUrl.includes("SellerDetails")) {
                this.setState({ title: x.pageTitle });
              }
            }
          }
        });
      }
    });
  }

  head() {
    if (this.state.title !== "") {
      return (
        <Helmet>
          <title>{this.state.title}</title>
        </Helmet>
      );
    }
  }

  render() {
    return <>{this.head()}</>;
  }
}

var titleHoc = compose(graphql(GET_META_TAG, { name: "getMetatags" }))(
  TitleComponent
);

export default titleHoc;