import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";

// core components
import Button from "../CustomButtons/Button.jsx";
import pagesRoutes from "../../routes/pages.jsx";

import pagesHeaderStyle from "../../assets/jss/material-dashboard-pro-react/components/pagesHeaderStyle.jsx";

class PagesHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentWillMount() {
    let {siteInfo} = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let {image} = siteInfo.getSiteInfo;
      this.setState({
        logo: image
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {image} = nextProps.siteInfo.getSiteInfo;
      this.setState({
        logo: image
      });
    }
  }
  handleDrawerToggle = () => {
    this.setState({ open: !this.state.open });
  };
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.setState({ open: false });
    }
  }
  render() {
    const { classes, color, history } = this.props;
    var getPath = history.location.pathname;
    var showHeader = history.location.pathname === "/admin/login" ? false : true;
    const { logo } = this.state;
    if (getPath.indexOf("/pages/") < 0) {
      var col = classes.sidebarButton;
    }
    const appBarClasses = cx({
      [" " + classes[color]]: color
    });
    var list = (
      <List className={classes.list}>
        {/* <ListItem className={classes.listItem}>
          <NavLink to={"/dashboard"} className={classes.navLink}>
            <ListItemIcon className={classes.listItemIcon}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText
              primary={"Dashboard"}
              disableTypography={true}
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem> */}
        {pagesRoutes.filter(p => p.short !== "login" && p.short !== "dashboard" && p.short !== "reset").map((prop, key) => {
          if (prop.redirect) {
            return null;
          }
          const navLink =
            classes.navLink +
            cx({
              [" " + classes.navLinkActive]: this.activeRoute(prop.path)
            });
              //var getPath = history.location.pathname;
              const cc = this.state.open ? classes.colorChange : ""
              return (
                <ListItem key={key} className={classes.listItem}>
                  <NavLink to={prop.path} className={navLink + " " + cc}>
                    {/* <ListItemIcon className={classes.listItemIcon}>
                      <prop.icon />
                    </ListItemIcon> */}
                    <ListItemText
                      primary={prop.short}
                      disableTypography={true}
                      className={(getPath === "/" || getPath === "/pages" || getPath === "/reset-password") ? classes.listItemText + "" + {
                        color: "white"
                      } : classes.listItemText}
                    />
                  </NavLink>
                </ListItem>
              );
        })}
      </List>
    );
    return (
      <AppBar position="static" className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <Hidden smDown>
            <div className={classes.flex}>
              <Button href={history.location.pathname === "/admin/login" ? "/admin/login" : "/"} className={classes.title} color="transparent">
              <img src={logo} width="50%" height="auto" alt="..." className="adminlog"/>
              </Button>
            </div>
          </Hidden>
          <Hidden mdUp>
            <div className={classes.flex}>
              <Button href={history.location.pathname === "/admin/login" ? "/admin/login" : "/"} className={classes.title} color="transparent">
              <img src={logo} width="50%" height="auto" alt="..."/>
              </Button>
            </div>
          </Hidden>
          {(showHeader || getPath.indexOf("/pages") >= 0) ?
                    <div><Hidden smDown>{list}</Hidden>
                    <Hidden mdUp>
                      <Button
                        className={col} 
                        color="transparent"
                        justIcon
                        aria-label="open drawer"
                        onClick={this.handleDrawerToggle}
                      >
                        <Menu />
                      </Button>
                    </Hidden>
                    <Hidden mdUp>
                      <Hidden mdUp>
                        <Drawer
                          variant="temporary"
                          anchor={"right"}
                          open={this.state.open}
                          classes={{
                            paper: classes.drawerPaper
                          }}
                          onClose={this.handleDrawerToggle}
                          ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                          }}
                        >
                          {showHeader && list}
                        </Drawer>
                      </Hidden>
                    </Hidden></div> : ""
          }
        </Toolbar>
      </AppBar>
    );
  }
}

PagesHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(pagesHeaderStyle)(PagesHeader);
