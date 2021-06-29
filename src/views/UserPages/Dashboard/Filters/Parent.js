import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import { graphql, compose } from "react-apollo";
import {
  GET_PRICE_DETAILS,
  PRICE,
  REDIRECT_HOME,
  GET_REDIRECT_STATE
} from "../../../../queries";
import { withTranslation } from "react-i18next";
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { priceRange: { min: "", max: "" } };
  }

  handlePriceMinMax = () => {
    const priceRange = this.state.priceRange;
    this.props.getPrice({
      variables: { max: priceRange.max, min: priceRange.min }
    });
    this.props.data(this.state.priceRange);
    (async function() {
      // this.props.change(this.state.priceRange);
    })();
  };

  cng = e => {
    //eslint-disable-next-line
    const reg = /^[0-9\b]+$/;
    if (e.target.value === "" || reg.test(e.target.value)) {
      this.setState({
        priceRange: {
          ...this.state.priceRange,
          [e.target.name]: e.target.value
        }
      });
    }
  };

  rest = () => {
    this.setState({
      priceRange: { min: "", max: "" }
    });
    this.props.getPrice({ variables: { max: 0, min: 0 } });
    //this.props.redirectHome({ variables: { pageCount: true } });
    this.props.data({ min: "", max: "" });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.resetPrice !== this.props.resetPrice) {
      this.rest();
    }
    if (nextProps.reset !== this.props.reset) {
      if (nextProps.reset === false) {
        this.rest();
      }
    }
  }

  render() {
    const { t } = this.props;
    const {priceRange} = this.state;
    return (
      <div className="form-group">
        {localStorage.getItem("lang") === "ar" ? (
          <>
            <input
              type="text"
              className="float-left min-price"
              value={this.state.priceRange.max}
              onChange={this.cng}
              name="max"
              placeholder={t("Homepagefilter._Min")}
            />
            <span className="float-left intedement-val">
              {t("Homepagefilter._To")}
            </span>
            <input
              type="text"
              className="float-left max-price"
              value={this.state.priceRange.min}
              onChange={this.cng}
              name="min"
              placeholder={t("Homepagefilter._Max")}
            />{" "}
          </>
        ) : (
          <>
            <input
              type="text"
              className="float-left min-price"
              value={this.state.priceRange.min}
              onChange={this.cng}
              name="min"
              placeholder={t("Homepagefilter._Min")}
            />
            <span className="float-left intedement-val">
              {t("Homepagefilter._To")}
            </span>
            <input
              type="text"
              className="float-left max-price"
              value={this.state.priceRange.max}
              onChange={this.cng}
              name="max"
              placeholder={t("Homepagefilter._Max")}
            />
          </>
        )}

      
      {(priceRange.min && priceRange.min.length > 0 || priceRange.max && priceRange.max.length > 0)
         && <button type="submit" onClick={this.rest} className="btn2 mt1">{t('Homepagefilter._Reset')}</button>}

      {(priceRange.min && priceRange.min.length > 0 || priceRange.max && priceRange.max.length > 0) && <button type="submit" onClick={this.handlePriceMinMax} className="btn1 float-right mt1">{t('Homepagefilter._Apply')}</button>}
      </div>
    );
  }
}

var PriceDetails = compose(
  graphql(PRICE, { name: "getPrice" }),
  graphql(GET_PRICE_DETAILS, {
    name: "getPriceData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(REDIRECT_HOME, {
    name: "redirectHome"
  }),
  graphql(GET_REDIRECT_STATE, {
    name: "getLoadCount",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  })
)(Parent);

export default withTranslation("common")(withStyles(styles)(PriceDetails));
