import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {animateScroll as scroll} from "react-scroll";
import "../../../views/UserPages/css/style.css";
// style component
import registerPageStyle from "../../../assets/jss/material-dashboard-pro-react/views/registerPageStyle.jsx";
import { compose, graphql } from "react-apollo";
import { GET_SITE_INFO, GET_STATIC_PAGE} from "../../../queries";
import eyes from "../../../assets/img/safety-tip-eyes.png";
import { withTranslation } from "react-i18next";

class SafetyTips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showScroll: false,
      sitename:'',
      staticPages:[],
      Title:'',
      Content:''
    };
 
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentWillMount() {
    let {siteInfo, staticPagesTerms} = this.props;
    siteInfo.refetch();

    if (siteInfo.getSiteInfo) {
      let {name} = siteInfo.getSiteInfo;
      this.setState({
        sitename: name
      });
    }
    let Title ='';
    staticPagesTerms.refetch().then(({ data }) => {
    let aboutUs = data.getstaticPageDetails.filter(a => a.title === "Safety Tips")
     //console.log("object", aboutUs)
    let Title = aboutUs[0].title;
    let Content = aboutUs[0].content;
       this.setState({
         // Title:Title,
         Content:Content
       })
    // console.log("object", Content)   
 }).catch(e => console.log(e));

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let { name} = nextProps.siteInfo.getSiteInfo;
      this.setState({
       sitename: name
      });
    }
  }


  componentDidMount() { 
    window.addEventListener("scroll", () => {
      this.componentScroll()
    }, true)
  }


  componentWillUnmount() {
    window.removeEventListener("scroll", () => {
      this.componentScroll()
    }, true)      
  }

  componentScroll = () => {
    const scope = this;
    var winheight= window.innerHeight || (document.documentElement || document.body).clientHeight
      var D = document;
      var docheight = Math.max(
          D.body.scrollHeight, D.documentElement.scrollHeight,
          D.body.offsetHeight, D.documentElement.offsetHeight,
          D.body.clientHeight, D.documentElement.clientHeight
      )
      var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
      var trackLength = docheight - winheight
      var pctScrolled = Math.floor(scrollTop/trackLength * 100)
     // console.log(pctScrolled);
      if(pctScrolled > 10) {
        scope.setState({
          showScroll: true
        })
      } else {
        scope.setState({
          showScroll: false
        })
      }
  }

  

  scrollToTop() {
    scroll.scrollToTop();
   
  }


  render() {
    const { classes, t, i18n } = this.props;
    const { showScroll, sitename,  Title, Content  } = this.state;
    return (
      <>
      <div className="pageHeaderContainer">
      <div className="bannercontebr">
        <img src={eyes}/>
        <h1>Safety Tips</h1>
      </div>
  </div>

      <div className={classes.landingStyle}>
      <div className="priourpg">
       
      <section className="safetytips">
      <section dangerouslySetInnerHTML={{__html
      : Content}}>
      </section>
      </section>
            { showScroll &&
                      <div className="anchor-fixed" onClick={this.scrollToTop}>
                        <a ><span> <i class="fa fa-chevron-up" aria-hidden="true"></i></span> </a>
                      </div>
                    }
            </div>
            </div>
            </>
    );
  }
}

SafetyTips.propTypes = {
  classes: PropTypes.object.isRequired
};

var Login = compose(
  graphql(GET_SITE_INFO, {name: "siteInfo"}),
  graphql(GET_STATIC_PAGE, {name: 'staticPagesTerms'})
)(SafetyTips);

export default withTranslation('common') (withStyles(registerPageStyle)(Login));

