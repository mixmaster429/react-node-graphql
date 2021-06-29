import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { animateScroll as scroll } from "react-scroll";
import "../../../views/UserPages/css/style.css";
// style component
import registerPageStyle from "../../../assets/jss/material-dashboard-pro-react/views/registerPageStyle.jsx";
import { GET_STATIC_PAGE,GET_META_TAG } from "../../../queries";
import { compose, graphql } from "react-apollo";
import { withTranslation } from "react-i18next";
import Footer from "./Footer.jsx";
import { Helmet } from "react-helmet";

class StaticFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      showScroll: false,
      sitename: "",
      staticPages: [],
      title: "",
      Content: []
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }

  componentWillReceiveProps(nextProps) {
    let { staticPagesTerms, match } = nextProps;
    staticPagesTerms.refetch().then(({ data }) => {
      if (match.url) {
        if (data && data.getstaticPageDetails) {
          let aboutUs =data.getstaticPageDetails && data.getstaticPageDetails.filter(a => a.url === match.url);
          if (aboutUs && aboutUs.length > 0) {
            this.setState({
              Content: aboutUs[0].content,
              title: aboutUs[0].title
            });
          }
        }
      }
    });

  
  }

  componentWillMount() {
    let { staticPagesTerms,match } = this.props;
    staticPagesTerms.refetch().then(({ data }) => {
      if (match.url) {
        if (data && data.getstaticPageDetails) {
          let aboutUs =data.getstaticPageDetails && data.getstaticPageDetails.filter(a => a.url === match.url);
          if (aboutUs && aboutUs.length > 0) {
            this.setState({
              Content: aboutUs[0].content,
              title: aboutUs[0].title
            });
          }
        }
      }
    });
  }

  componentDidMount() {
    window.addEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "scroll",
      () => {
        this.componentScroll();
      },
      true
    );
  }

  componentScroll = () => {
    const scope = this;
    var winheight =
      window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
    var D = document;
    var docheight = Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight
    );
    var scrollTop =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
    var trackLength = docheight - winheight;
    var pctScrolled = Math.floor((scrollTop / trackLength) * 100);
    if (pctScrolled > 10) {
      scope.setState({
        showScroll: true
      });
    } else {
      scope.setState({
        showScroll: false
      });
    }
  };

  scrollToTop() {
    scroll.scrollToTop();
  }

 head(){
  if(this.state.title !== ""){
    return(
      <Helmet>
        <title>{this.state.title}</title>
      </Helmet>
    )
  }
 }

  render() {
    const { classes } = this.props;
    const { showScroll, Content } = this.state;
    return (
      <>
       {this.head()}
        <div className={classes.landingStyle}>
          <div className="priourpg">
            <section dangerouslySetInnerHTML={{ __html: Content }}></section>
            {showScroll && (
              <div className="anchor-fixed" onClick={this.scrollToTop}>
                  <span>
                    {" "}
                    <i class="fa fa-chevron-up" aria-hidden="true"></i>
                  </span>{" "}
              </div>
            )}
          </div>
        </div>
        {Content.length > 0 && <Footer />}
      </>
    );
  }
}

StaticFooter.propTypes = {
  classes: PropTypes.object.isRequired
};
var SP = compose(
  graphql(GET_STATIC_PAGE, { name: "staticPagesTerms" }),
  graphql(GET_META_TAG, {name: "getMetatags"})
)(StaticFooter);

export default withTranslation("common")(withStyles(registerPageStyle)(SP));
