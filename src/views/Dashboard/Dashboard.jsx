import React from "react";
import PropTypes from "prop-types";
import { compose, graphql } from "react-apollo";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import UsersIcon from "@material-ui/icons/SupervisorAccount";
import ProductsIcon from "@material-ui/icons/ShoppingBasket";
import SoldIcon from "@material-ui/icons/ShoppingCart";
// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";
// style component
import dashboardStyle from "../../assets/jss/material-dashboard-pro-react/views/dashboardStyle.jsx";
import {GET_ALL_USERS, GET_ALL_ADMIN_PRODUCTS} from "../../queries";


var styles = {
  ...dashboardStyle,
  smallButton: {
    backgroundColor: "white",
    color: "green",
    border: "solid 1px",
    "&:hover": {
      backgroundColor: "#22c4d8 !important",
      color: "white !important",
      borderColor: "#22c4d8 !important"
    }
  }
}
var todayCount = function(data, type) {
  var filtered = data.filter(function (data) {
    var date = new Date();
    let dateList = type === "sold" ? data.sellingTimeStamp ? data.sellingTimeStamp : 0 : data.createdAt;
    return (dateList >= date.setHours(0,0,0) && dateList <= date.setHours(23,59,59));
  });
  return filtered && filtered.length;
};

class Dashboard extends React.Component {
  render() {
    const { classes, usersInfo, productInfo } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="success" stats icon>
              <CardIcon color="success">
                  <UsersIcon/>
                </CardIcon>
                <h3 className={classes.cardTitle}>{usersInfo.getAllUsers && usersInfo.getAllUsers.length}</h3>
                <p className={classes.cardCategory}>Total Users</p>
              </CardHeader>
              <CardFooter stats >
              <div>
              <Button 
              className={classes.smallButton}
              size="sm"
              onClick={() => this.props.history.push("/admin/users")}>More Info</Button></div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                <UsersIcon/>
                </CardIcon>
                <h3 className={classes.cardTitle}>{usersInfo.getAllUsers && todayCount(usersInfo.getAllUsers)}</h3>
                <p className={classes.cardCategory}>Today Users</p>
              </CardHeader>
              <CardFooter stats >
              <Button 
              className={classes.smallButton}
              size="sm"
              onClick={() => this.props.history.push("/admin/users")}>More Info</Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                <ProductsIcon />
                </CardIcon>
                <h3 className={classes.cardTitle}>{productInfo.getAllAdminProducts && productInfo.getAllAdminProducts.length}</h3>
                <p className={classes.cardCategory}>Total Products</p>
              </CardHeader>
              <CardFooter stats >
              <div>
              <Button 
              className={classes.smallButton}
              size="sm"
              onClick={() => this.props.history.push("/admin/products")}>More Info</Button>
              </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                <ProductsIcon />
                </CardIcon>
                <h3 className={classes.cardTitle}>{productInfo.getAllAdminProducts && todayCount(productInfo.getAllAdminProducts)}</h3>
                <p className={classes.cardCategory}>Today Products</p>
              </CardHeader>
              <CardFooter stats >
              <Button 
              className={classes.smallButton}
              size="sm"
              onClick={() => this.props.history.push("/admin/products")}>More Info</Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                <SoldIcon />
                </CardIcon>
                <h3 className={classes.cardTitle}>{productInfo.getAllAdminProducts && productInfo.getAllAdminProducts.filter((gp) => gp.sellingStatus === "SoldOut").length}</h3>
                <p className={classes.cardCategory}>Total Sold Out</p>
              </CardHeader>
              <CardFooter stats >
              <div>
              <Button 
              className={classes.smallButton}
              size="sm"
              onClick={() => this.props.history.push("/admin/products")}>More Info</Button>
              </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                <SoldIcon />
                </CardIcon>
                <h3 className={classes.cardTitle}>{productInfo.getAllAdminProducts && todayCount(productInfo.getAllAdminProducts.filter((gp) => gp.sellingStatus === "SoldOut"), "sold")}</h3>
                <p className={classes.cardCategory}>Today Sold Out</p>
              </CardHeader>
              <CardFooter stats >
              <div>
              <Button
              className={classes.smallButton}
              size="sm"
              onClick={() => this.props.history.push("/admin/products")}>More Info</Button>
              </div>
              </CardFooter>
            </Card>
          </GridItem>
             </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

var dashboard = compose(
  graphql(GET_ALL_USERS, {
     name: "usersInfo"
  }),
  graphql(GET_ALL_ADMIN_PRODUCTS, {
     name: "productInfo",
     options: () => ({
      variables: {
        filter: {}
      }
    })
  }),
)(Dashboard);

export default withStyles(styles)(dashboard);
