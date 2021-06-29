import React from "react";
import Parent from "./Parent.js";
import { withTranslation } from "react-i18next";
import "../../css/style.css";
import { getSymbol } from "../../../../helper.js";

class PriceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      priceRange: { min: "", max: "" }
    };
  }
  handleClick = () => {
    this.setState({ render: !this.state.render });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.getPriceData !== this.props.getPriceData) {
      let { getPriceData } = nextProps;
      this.setState({
        min: getPriceData.min,
        max: getPriceData.max
      });
    }
  }

  data = a => {
    this.setState({
      priceRange: a
    });
    this.props.change(a);
  };

  resetParent = () => {
    this.setState({
      priceRange: { min: "", max: "" }
    });
  };

  render() {
    const { getPriceData } = this.props;
    const minL = getPriceData && getPriceData.min;
    const maxL = getPriceData && getPriceData.max;
    const minC =
      getPriceData && getPriceData.min
        ? getSymbol(localStorage.getItem("currencySymbol")) + getPriceData.min
        : "";
    const maxC =
      getPriceData && getPriceData.max
        ? " -" + getSymbol(localStorage.getItem("currencySymbol")) + getPriceData.max
        : "";

    return (
      <div className="dropdown pric">
        <div className="location-filter respimg newpri price-filt dropdown-toggle" data-toggle="dropdown"
          onClick={this.handleClick}>
          <div className="locatext locatingval "> {this.props.t('Homepagefilter._Price')} </div>
          <div className="etw locmap popress rtlprice">
            {((minL === undefined) || (minL === 0)|| (minL === "")) &&
              ((maxL === undefined) || (maxL === 0) || (maxL === "")) &&
              this.props.t("Homepagefilter._Anyprice")}
            {(minL > 0 || maxL > 0) &&
              (((minL === 0) || (minL === "")) ? "Negotiable" : "") + minC + maxC}
          </div>
        </div>
        <div class="dropdown-menu priSpace">
          {this.state.render && <Parent resetPrice={this.props.resetPrice} data={this.data} reset={this.props.reset} />}
        </div>
      </div>
    );
  }
}

export default withTranslation("common")(PriceFilter);