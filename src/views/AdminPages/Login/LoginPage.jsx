import React from "react";
import PropTypes from "prop-types";
import { Mutation, graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardFooter from "../../../components/Card/CardFooter.jsx";
import loginPageStyle from "../../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import {SIGNIN_USER, GET_SITE_INFO, GET_CURRENT_ADMIN} from "../../../queries";

const {REACT_APP_User, REACT_APP_Password,REACT_APP_ENV} = process.env;

const initialState = {
  cardAnimaton: "cardHidden",
  userName: REACT_APP_ENV !== "package" ? REACT_APP_User : "",
  password: REACT_APP_ENV !== "package" ? REACT_APP_Password : "",
  errors: {
    userName: "",
    password: ""
  },
  graphqlError:[]
};


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      ...initialState
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  handleChange(event) {
    let {id, value} = event.target;
    this.setState({
        [id]: value
    });
  }

  validateInput() {
    let self = this;
    let required = ["userName", "password"];
    let error = {}, flag = false;
    required.forEach((data) => {
      let name = data === "userName" ? "username" : data;
      if (!self.state[data] && !self.state[data].length) {
        error[data] = `Please enter a valid ${name}.`;
      } else if (data === "password" && self.state[data].length < 4) {
        error["password"] = "Password must have minimun 4 letters.";
      } else {
        error[data] = "";
      }
    });
    this.setState({
      errors: error
    });
    flag = Object.keys(error).find((obj) => {
      if (error[obj]) return true;
      return false;
    });
    return flag;
  }

  clearState() {
    this.setState({...initialState});
  }

  head() {
    return (
        <Helmet>
            <title>{this.state.title}</title>
            <link rel="shortcut icon" href={this.state.favicon}/> 
        </Helmet>
    );
  }

  handleSubmit(event, signinUser) {
    event.preventDefault();
    if (!this.validateInput()) {
      signinUser().then(async ({data}) => {
        if (!!data.adminLogin) {
          await this.props.refetch();
          this.clearState();
          this.props.history.push("/admin/dashboard");
        }
    }).catch((error) => {
        this.setState({
          graphqlError: error.graphQLErrors.map((x) => x.message)
        });
    });
    }
  }

  componentWillMount() {
    let {siteInfo, getCurrentAdmin, history} = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let {name, favicon} = siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon: favicon
      });
    }
    getCurrentAdmin.refetch().then(({data}) => {
      if (data.getCurrentAdmin) {
        history.push("/admin/dashboard");
      }
    }).catch((e) => {
     // console.log(e)
    });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {name, favicon} = nextProps.siteInfo.getSiteInfo;
      this.setState({
        title: name,
        favicon
      });
    }
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount(){
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }


  render() {
    const { userName, password, errors } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
            {this.head()}
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
          <Mutation mutation={SIGNIN_USER} variables={{ userName, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
            <form className="form" onSubmit={(event) => this.handleSubmit(event, signinUser)}>
              <Card login className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="rose"
                >
                  <h2 className={classes.cardTitle} style={{fontSize: "15px", lineHeight: "30px"}}><b>LOGIN</b></h2>
                  {/* <div className={classes.socialLine}>
                    {[
                      "fab fa-facebook-square",
                      "fab fa-twitter",
                      "fab fa-google-plus"
                    ].map((prop, key) => {
                      return (
                        <Button
                          color="transparent"
                          justIcon
                          key={key}
                          className={classes.customButtonClass}
                        >
                          <i className={prop} />
                        </Button>
                      );
                    })}
                  </div> */}
                </CardHeader>
                <CardBody>
                    <CustomInput
                    labelText="UserName"
                    id="userName"
                    error={!!errors.userName}
                    success={!!errors.userName}
                    helpText={errors.userName}
                    formControlProps={{
                      fullWidth: true
                    }}
                    
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Face className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      ),
                      value: userName,
                      onChange: this.handleChange,
                      //autoComplete: "off",
                      autoComplete: "new-password"
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    id="password"
                    error={!!errors.password}
                    success={!!errors.password}
                    helpText={errors.password}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      ),
                      value: password,
                      type: "password",
                      onChange: this.handleChange,
                      autoComplete: "new-password"
                      //autoComplete: "off"
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button type="submit" style={{color: "rgb(245, 91, 112)"}} simple size="lg" block>
                    <h3>Let's Go</h3>
                  </Button>
                </CardFooter>
                {this.state.graphqlError.length ?
                <Snackbar place="bc"
                color="rose"
                message={this.state.graphqlError[0]}
                open={!!this.state.graphqlError.length}
                closeNotification={() => this.setState({ graphqlError: [] })}
                close />: ""}
              </Card>
              </form>
              );
            }}
            </Mutation>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

var login = compose(
  graphql(GET_SITE_INFO, {name: "siteInfo"}),
  graphql(GET_CURRENT_ADMIN, {name: "getCurrentAdmin"})
)(LoginPage);

export default withRouter(withStyles(loginPageStyle)(login));

