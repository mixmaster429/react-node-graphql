import React from "react";
import { compose, graphql } from "react-apollo";
import {
  GET_CURRENCIES,
  GET_SITE_INFO,
  GET_ALL_PRODUCTS,
  GET_CATEGORIES,
  GET_LANGUAGES,
  GET_STATIC_PAGE,
  CATE_LANG_REFETCH
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
//import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { Link } from "react-router-dom";
//import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import pagesStyle from "../../../assets/jss/material-dashboard-pro-react/layouts/pagesStyle.jsx";
import googleplay from "../../../assets/img/badge_googleplay.svg";
import appstroe from "../../../assets/img/badge_appstore.svg";
import { withTranslation } from "react-i18next";
import "../css/style.css";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// var styles = {
//   ...loginStyles,
//   ...headerStyles(),
//   customBtn: {
//     borderColor: "white !important",
//     "&:hover": {
//       borderColor: "white !important"
//     }
//   }
// };

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iosLink: "",
      androidLink: "",
      sitename: "",
      facebookLink: "",
      twitterLink: "",
      instagramLink: "",
      image: "",
      footerLogo: "",
      footerBatch: "",
      footerBackground: "",
      currency: "",
      totalLanguages: []
    };
  }
  change = e => {
    let { productsInfo, currencyInfo } = this.props;
    localStorage.setItem("currency", e.target.value);
    productsInfo.refetch({ filter: {} }).then(({ data }) => {});

    currencyInfo.getCurrencies.map((cur, i) => {
      if (cur.code === e.target.value) {
        localStorage.setItem("currencySymbol", cur.symbol);
      }
    });
    this.props.getRefetch({ variables: { categoryRefetch: true } });
  };

  changeLng = (e, i18n) => {
    let arr = ["ar", "fr", "en"];
    let langList = e;
    let { categoryInfo, staticPagesTerms, productsInfo,AdvancedFilter } = this.props;
    localStorage.setItem("lang", e);
    if(AdvancedFilter && AdvancedFilter !== undefined){
        this.props.AdvancedFiltersubmit({
          fieldChild: [],
          rangeFilter: []
        });
    }
    localStorage.setItem("langList", e);
    if (window.location.pathname === "/") {
      categoryInfo.refetch().then(({ data }) => {
        this.props.getCategory(data);
      });
    }
    staticPagesTerms.refetch().then(({ data }) => {});

    productsInfo.refetch({ filter: {} }).then(({ data }) => {
    })

    if (e === "ar") {
      document.getElementById("rtlsz").style.fontSize = "35px";
      document.body.setAttribute("dir", "rtl");
      localStorage.setItem("rtl", "rtl");
    } else if (e === "fr") {
      document.getElementById("rtlsz").style.fontSize = "35px";
      document.body.setAttribute("dir", "ltr");
      localStorage.setItem("ltr", "ltr");
    } else {
      if (!arr.includes(e)) {
        //localStorage.setItem("lang", "en");
        langList = "en";
        localStorage.setItem("langList", e);
      } else {
        //  localStorage.getItem("lang")
        // localStorage.setItem("langList", e);
      }
      document.getElementById("rtlsz").style.fontSize = "64px";
      document.body.setAttribute("dir", "ltr");
      localStorage.setItem("ltr", "ltr");
    }
    i18n.changeLanguage(langList);
    this.props.getRefetch({ variables: { categoryRefetch: true } });
  };

  componentWillMount() {
    let { siteInfo, getLanguages, currencyInfo } = this.props;
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      let {
        iosLink,
        androidLink,
        name,
        fbLink,
        twLink,
        instagramLink,
        image,
        footerLogo,
        footerBatch,
        footerBackground
      } = siteInfo.getSiteInfo;
      this.setState({
        iosLink: iosLink,
        androidLink: androidLink,
        sitename: name,
        facebookLink: fbLink,
        twitterLink: twLink,
        instagramLink: instagramLink,
        image: image,
        footerLogo: footerLogo,
        footerBatch: footerBatch,
        footerBackground: footerBackground
      });
    }

    getLanguages.refetch({}).then(({ data }) => {
      if (data) {
        let langData = data && data.getLanguages;
        this.setState({
          totalLanguages: langData
        });
      }
    });

    currencyInfo.refetch({}).then(({ data }) => {
      if (data && data.getCurrencies) {
        let check = data.getCurrencies.find(cat => {
          if (cat.code === localStorage.getItem("currency")) {
            this.setState({
              currency: localStorage.getItem("currency")
            });
          }
          return cat.code === localStorage.getItem("currency");
        });

        if (check === undefined) {
          if (this.props.siteInfo && this.props.siteInfo.getSiteInfo) {
            const key = this.props.siteInfo.getSiteInfo;
            localStorage.setItem("currency", key.defaultCurrency);
            this.setState({
              currency: localStorage.getItem("currency")
            });
          }
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteInfo && nextProps.siteInfo.getSiteInfo) {
      let {
        iosLink,
        androidLink,
        name,
        fbLink,
        twLink,
        instagramLink,
        utubeLink,
        image,
        footerLogo,
        footerBatch,
        footerBackground
      } = nextProps.siteInfo.getSiteInfo;
      this.setState({
        iosLink: iosLink,
        androidLink: androidLink,
        sitename: name,
        facebookLink: fbLink,
        twitterLink: twLink,
        instagramLink: instagramLink,
        utubeLink: utubeLink,
        image: image,
        footerLogo: footerLogo,
        footerBatch: footerBatch,
        footerBackground: footerBackground,
        currency: localStorage.getItem("currency")
      });
    }
  }
  playStore = link => {
    window.open(link, "_blank");
  };

  socialMedia = url => {
    window.open(url, "_blank");
  };

  render() {
    let { classes, t, i18n, currencyInfo, staticPagesTerms } = this.props;
    var {
      iosLink,
      androidLink,
      sitename,
      facebookLink,
      twitterLink,
      instagramLink,
      utubeLink,
      currency,
      footerLogo,
      totalLanguages,
      footerBatch,
      footerBackground
    } = this.state;

    return (
      <div>
        <div className={classes.container}>
          <div id="ldmr">
            {this.state.androidLink || this.state.iosLink !== "" ? (
              <section
                className={
                  localStorage.getItem("lang") === "fr" && "ar"
                    ? "footerpart friss"
                    : "footerpart"
                }
              >
                <div className="phone-bgf" id="footerId">
                  <div
                    className={
                      localStorage.getItem("lang") === "fr" && "ar"
                        ? "leftpartfoot frissus"
                        : "leftpartfoot"
                    }
                  >
                    <h1
                      className={
                        localStorage.getItem("lang") === "fr" && "ar"
                          ? "get-freeapp1 frissues"
                          : "get-freeapp"
                      }
                      id="rtlsz"
                    >
                      {" "}
                      {t("footer._freeapp")}
                    </h1>

                    <div
                      className={
                        localStorage.getItem("lang") === "fr" && "ar"
                          ? "app-dow friss"
                          : "app-dow"
                      }
                    >
                      <ul>
                        {this.state.androidLink !== "" ? (
                          <li onClick={() => this.playStore(androidLink)}>
                            <img src={googleplay} alt="" />
                          </li>
                        ) : (
                          ""
                        )}
                        {this.state.iosLink !== "" ? (
                          <li onClick={() => this.playStore(iosLink)}>
                            <img src={appstroe} alt="" />
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="newdynamicimg">
                    <img src={footerBatch} className="img-fluid" alt="" />
                  </div>
                </div>
              </section>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="footerwholeimg">
          <img src={footerBackground} className="bgimg" alt="" />
          <div className="kQtQHd">
            <div className={classes.container}>
              <div className={classes.NqLdW}>
                <div className="texralignfliter">
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <div className="footer-logos">
                        <img src={footerLogo} alt="" />
                        <p className="krSyul">
                          @ {sitename} {1900 + new Date().getYear()}{" "}
                        </p>
                      </div>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={5}>
                      <div className="aboutpass">
                        <ul>
                          <li>
                            <Link to="/Info/contact">
                              {" "}
                              {this.props.t("footer._ContactUs")}{" "}
                            </Link>{" "}
                          </li>
                          {staticPagesTerms.getstaticPageDetails &&
                            staticPagesTerms.getstaticPageDetails.map(
                              (p, index) => {
                                return (
                                  <li key={index}>
                                    {" "}
                                    <Link to={p.url}> {p.title} </Link>{" "}
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </div>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={4}>
                      <div className="centeralgn">
                        <div class="select-wrapper">
                          {/* <select value={localStorage.getItem("lang")}
                    onChange={(e) => this.changeLng(e.target.value, i18n)}  className="selectboxsize"> 
                     {totalLanguages &&
                        totalLanguages.map((item, index) => {   return (
                              <option
                                key={index}
                                value={item.value}
                              >
                                {item.name}
                              </option>
                            );
                        })}
                   </select> */}

                          <FormControl
                            // fullWidth
                            className={
                              classes.selectFormControl + " " + "currenctycon"
                            }
                          >
                            <InputLabel
                              htmlFor="lang"
                              className={classes.selectLabel}
                            >
                              {localStorage.getItem("lang")}
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className:
                                  classes.selectMenu + " " + "slectcurrency"
                              }}
                              classes={{
                                select: classes.select
                              }}
                              value={localStorage.getItem("lang")}
                              onChange={e =>
                                this.changeLng(e.target.value, i18n)
                              }
                              inputProps={{
                                name: "lang",
                                id: "lang"
                              }}
                              disableUnderline={true}
                            >
                              {totalLanguages &&
                                totalLanguages.map((item, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                      }}
                                      value={item.value}
                                    >
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              : ""}
                            </Select>
                          </FormControl>
                        </div>
                        <div class="select-wrapper">
                          {/* <select value={currency}
                    onChange={(event) => this.change(event)}  className="selectboxsize"> 
                    {
                        currencyInfo.getCurrencies ? 
                        currencyInfo.getCurrencies.map((cur, i) => {
                          return (
                            <option key={i} value={cur.code}>
                              {cur.code}
                            </option>
                          )
                        })
                      : ""}
                   </select> */}

                          <FormControl
                            // fullWidth
                            className={
                              classes.selectFormControl + " " + "currenctycon"
                            }
                          >
                            <InputLabel
                              htmlFor="currency"
                              className={classes.selectLabel}
                            >
                              {localStorage.getItem("currency")}
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className:
                                  classes.selectMenu + " " + "slectcurrency"
                              }}
                              classes={{
                                select: classes.select
                              }}
                              value={currency}
                              onChange={event => this.change(event)}
                              inputProps={{
                                name: "currency",
                                id: "currency"
                              }}
                              disableUnderline={true}
                            >
                              {currencyInfo.getCurrencies
                                ? currencyInfo.getCurrencies.map((cur, i) => {
                                    return (
                                      <MenuItem
                                        key={i}
                                        classes={{
                                          root: classes.selectMenuItem,
                                          selected:
                                            classes.selectMenuItemSelected
                                        }}
                                        value={cur.code}
                                      >
                                        {cur.code}
                                      </MenuItem>
                                    );
                                  })
                                : ""}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </GridItem>
                  </GridContainer>

                  <div className="soci-wrp">
                    <div className="ftsocial">
                      <ul>
                        {this.state.facebookLink !== "" ? (
                          <li
                            className="socialIconFooter"
                            onClick={() => this.socialMedia(facebookLink)}
                          >
                            <a title="facebook" target="_blank">
                              <i class="fa fa-facebook" aria-hidden="true"></i>
                            </a>
                          </li>
                        ) : (
                          ""
                        )}
                        {this.state.twitterLink !== "" ? (
                          <li
                            className="socialIconFooter"
                            onClick={() => this.socialMedia(twitterLink)}
                          >
                            <a title="twitter" target="_blank">
                              <i class="fa fa-twitter" aria-hidden="true"></i>
                            </a>
                          </li>
                        ) : (
                          ""
                        )}

                        {this.state.instagramLink !== "" ? (
                          <li
                            className="socialIconFooter"
                            onClick={() => this.socialMedia(instagramLink)}
                          >
                            <a title="instagram" target="_blank">
                              <i class="fa fa-instagram" aria-hidden="true"></i>
                            </a>
                          </li>
                        ) : (
                          ""
                        )}
                        {this.state.utubeLink !== "" ? (
                          <li
                            className="socialIconFooter"
                            onClick={() => this.socialMedia(utubeLink)}
                          >
                            <a title="youtube" target="_blank">
                              <i
                                class="fa fa-youtube-play"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var footer = compose(
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(GET_ALL_PRODUCTS, {
    name: "productsInfo",
    options: () => ({
      variables: {
        filter: {}
      }
    })
  }),

  graphql(GET_CATEGORIES, {
    name: "categoryInfo",
    options: () => ({
      fetchPolicy: "cache and network"
    })
  }),
  graphql(GET_STATIC_PAGE, { name: "staticPagesTerms" }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),
  graphql(GET_CURRENCIES, { name: "currencyInfo" }),
  graphql(GET_LANGUAGES, { name: "getLanguages" }),
  graphql(CATE_LANG_REFETCH, { name: "getRefetch" })
)(Footer);

export default withTranslation("common")(withStyles(pagesStyle)(footer));
