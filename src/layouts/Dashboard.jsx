import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import {Helmet} from "react-helmet";
import {graphql, compose} from "react-apollo";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";

// style component
import appStyle from "../assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx";
import image from "../assets/img/sidebar.jpg";
import withAuth from "../hoc/withAuth.js";
import dashboardRoutes from "../routes/dashboard.jsx";
import {GET_SITE_INFO, LOG_OUT} from "../queries";


const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
      if (prop.collapse)
        return prop.views.map((prop, key) => {
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        });
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false,
      popUpDetails: []
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  componentWillMount() {
    let {siteInfo} = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let {name, image, favicon} = siteInfo.getSiteInfo;
      this.setState({
        title: name,
        image: image,
        favicon: favicon
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {name, image, favicon} = nextProps.siteInfo.getSiteInfo;
      this.setState({
        title: name,
        image: image,
        favicon: favicon
      });
    }
  }
  
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  head() {
    return (
        <Helmet>
            <title>{this.state.title}</title>
            <link rel="shortcut icon" href={this.state.favicon}/> 
        </Helmet>
    );
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  handleLogout = () => {
    this.props.mutate().then(async ({data}) => {
      if (data.logOut) {
        this.props.history.push('/admin/login');
      }
  }).catch(error => {
    console.log(error);
      this.setState({
        popUpDetails: error.graphQLErrors.map(x => x.message)
      });
  });
    //console.log('Logged Out');
  }
  handleRef = () => {
    this.props.history.push('/admin/dashboard');
  }
  getRoute() {
    return this.props.location.pathname !== "/maps/full-screen-maps";
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  render() {
    const { classes, ...rest } = this.props;
    var customDashboard = [];
    dashboardRoutes.forEach((dash) => {
      if (!dash.nosideBar) {
        customDashboard.push(dash)
      }
    });
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div className={classes.wrapper}>
             {this.head()}
        <Sidebar
          routes={customDashboard}
          logo={this.state.image}
          image={image}
          handleRef={this.handleRef}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          bgColor="black"
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <Header
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            handleLogout={this.handleLogout}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer fluid name = {this.state.title}/> : null}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

var dashboard = compose(
  graphql(GET_SITE_INFO, {name: "siteInfo"}),
 graphql(LOG_OUT)
)(Dashboard);

export default withAuth(session => session && session.getCurrentAdmin)(withStyles(appStyle)(dashboard));



