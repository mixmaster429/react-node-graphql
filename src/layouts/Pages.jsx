import React from "react";
import PropTypes from "prop-types";
import { graphql, Query, compose } from "react-apollo";
import { Switch, Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import routes from "../routes/pages.jsx";
import Header from "../views/UserPages/Header/index.jsx";
import { ProductConsumer } from "../views/UserPages/ProductContext.js";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import PagesHeader from "../components/Header/PagesHeader.jsx";
import Snackbar from "../components/Snackbar/Snackbar.jsx";

//style component
import pagesStyle from "../assets/jss/material-dashboard-pro-react/layouts/pagesStyle.jsx";
import appStore from "../assets/img/appstore.png";
import playStore from "../assets/img/googleplay.png";
import mobile from "../assets/img/mobile.png";
import arrow from "../assets/img/arrow.png";
import {
  GET_SITE_INFO,
  GET_TOGGLE_STATUS,
  UPDATE_TOGGLE_STATUS,
  GET_CURRENT_USER,
  INACTIVE,
  ISOPEN
} from "../queries";

class Pages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      favicon: "",
      iosLink: "",
      androidLink: "",
      adminloginImage: "",
      contextConsumerInner: {}
    };

    this.handleActiveScreen = this.handleActiveScreen.bind(this);
    this.setRef = this.setRef.bind(this);
    this.bRef = this.bRef.bind(this);
  }

  setRef(node) {
    this.wrapperRef = node;
  }
  bRef(node) {
    this.blockRef = node;
  }

  componentWillMount() {
    let { siteInfo, currentUser } = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let {
        name,
        favicon,
        iosLink,
        androidLink,
        adminloginImage
      } = siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon: favicon,
        iosLink: iosLink,
        androidLink: androidLink,
        adminloginImage: adminloginImage
      });
    }

    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser
    });
  }
  handleActiveScreen(e) {
    e.preventDefault();
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.props.inActiveScreen({ variables: { inActive: false } });
    }
    if (this.blockRef && !this.blockRef.contains(e.target)) {
      this.props.isOpenScreen({ variables: { open: false } });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { currentUser } = nextProps;
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {
        name,
        favicon,
        iosLink,
        androidLink,
        adminloginImage
      } = nextProps.siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon: favicon,
        iosLink: iosLink,
        androidLink: androidLink,
        adminloginImage: adminloginImage
      });
    }
    currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser,
      contextConsumerInner: nextProps.contextConsumer
    });
  }

  componentDidMount() {
    document.body.style.overflow = "unset";
    document.body.style.margin = "0px";
    var url = window.location.href; //replace with window.location.href
    if (url.indexOf("device=mobile") !== -1) {
      document.getElementsByTagName("header")[0].style.display = "none";
      if (
        document.getElementsByTagName("header")[1] &&
        document.getElementsByTagName("header")[1]
      ) {
        document.getElementsByTagName("header")[1].style.display = "none";
      }
    }
  }

  head() {
    return (
      <Helmet>
        <title>{this.state.title}</title>
        <link rel="shortcut icon" href={this.state.favicon} />
      </Helmet>
    );
  }

  render() {
    const { classes, match, ...rest } = this.props;
    var {
      iosLink,
      androidLink,
      adminloginImage,
      cUser,
      contextConsumerInner
    } = this.state;
    var Path = this.props.history.location.pathname;
    //let inActiveStyle = inActive ? classes.inActive : "";
    let { history, location } = this.props;

    //var bgImage = Path.indexOf("/admin") >= 0 ? registerImage : landingImage;
    let $imagePreview = adminloginImage;

    return (
      <div>
        {this.head()}

        {Path.indexOf("/pages/") >= 0 ||
        Path.indexOf("/reset-password/") >= 0 ||
        Path.indexOf("/EditProfile") >= 0 ||
        Path.indexOf("/products") >= 0 ||
        Path.indexOf("/dashboard") >= 0 ||
        Path.indexOf("/SellerDetails") >= 0 ||
        Path.indexOf("/Info/contact") >= 0 ||
        Path.indexOf("/chat/conversation") >= 0 ? (
          <div>
            <ProductConsumer>
              {value => (
                <>
                  <Header
                    match={match}
                    setRef={this.setRef}
                    location={location}
                    history={history}
                    currentUser={cUser}
                    contextConsumerInner={contextConsumerInner}
                    categorySubmitted={value.categorySubmitted}
                    showValue={value.showValue}
                    postDone={value.postDone}
                  />
                </>
              )}
            </ProductConsumer>

            <Switch>
              {routes
                .filter(r => {
                  return r.short !== "login";
                })
                .map((prop, key) => {
                  if (prop.collapse) {
                    return null;
                  }
                  if (prop.redirect) {
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key} />
                    );
                  }
                  return (
                    <Route
                      path={prop.path}
                      render={() => {
                        return <prop.component {...this.props} />;
                      }}
                      // component={prop.component}
                      key={key}
                    />
                  );
                })}
            </Switch>
          </div>
        ) : (
          <div>
            <PagesHeader {...rest} />
            <div className={classes.wrapper} ref="wrapper">
              <div
                className={classes.fullPage}
                style={{
                  backgroundImage: `url(${$imagePreview})`,
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}
              >
                {(Path.indexOf("/pages") >= 0 ||
                  (Path.indexOf("/") >= 0 && Path.indexOf("/admin") < 0)) && (
                  <div className={classes.homeContent}>
                    <div className={classes.container}>
                      <div className={classes.homeContentWrap}>
                        {/* <div className={classes.bannerText}><h1 className={classes.header1}>Any swipe can change your life</h1></div> */}

                        <div className={classes.appButton}>
                          <a
                            href={androidLink}
                            target="blank"
                            className={classes.ahref}
                          >
                            <img
                              className={classes.appImage}
                              src={playStore}
                              alt=""
                            />
                          </a>

                          {/* ** coming soon *** */}
                          <a
                            href={iosLink}
                            target="blank"
                            className={classes.ahref}
                          >
                            <img
                              className={classes.appImage}
                              src={appStore}
                              alt=""
                            />
                          </a>
                          <span>(coming soon)</span>
                        </div>

                        <div className={classes.startsBlock}>
                          <div className={classes.startsInfo}>
                            <h3>It starts here</h3>
                            <img src={arrow} width="" height="" alt="starts" />
                          </div>
                          <div className={classes.startsImage}>
                            <img src={mobile} width="" height="" alt="starts" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Switch>
                  {routes
                    .filter(r => r.short === "login")
                    .map((prop, key) => {
                      if (prop.collapse) {
                        return null;
                      }
                      if (prop.redirect) {
                        return (
                          <Redirect
                            from={prop.path}
                            to={prop.pathTo}
                            key={key}
                          />
                        );
                      }
                      return (
                        <Route
                          path={prop.path}
                          render={() => {
                            return <prop.component {...this.props} />;
                          }}
                          // component={prop.component}
                          key={key}
                        />
                      );
                    })}
                </Switch>

                <Query query={GET_TOGGLE_STATUS}>
                  {({ loading, data }) => (
                    <Snackbar
                      place="tc"
                      color="rose"
                      message={data.message}
                      open={!!data.toggleStatus}
                      closeNotification={() =>
                        this.props.updateToggle({
                          variables: {
                            toggleStatus: false,
                            message: ""
                          }
                        })
                      }
                      close
                    />
                  )}
                </Query>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Pages.propTypes = {
  classes: PropTypes.object.isRequired
};

var pages = compose(
  graphql(UPDATE_TOGGLE_STATUS, { name: "updateToggle" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" })
)(Pages);

export default withStyles(pagesStyle)(pages);
