import React from "react";
import "../../css/style.css";
import SortFilter1 from "./SortFilter1.js";
import { withTranslation } from "react-i18next";
class SortFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      value: "Most Recent"
    };
  }
  handleClick = e => {
    e.preventDefault();
    this.setState({ render: !this.state.render });
  };
  dataUpdate = a => {
    this.setState({ value: a });
    this.props.change(a);
  };

  componentWillReceiveProps(nextprops) {
    if (nextprops.reset !== true) {
      this.setState({ value: this.props.t("Homepagefilter._MostRecent") });
    }
  }

  render() {
    const { t,getSortByData } = this.props;

    const options = [
      "Homepagefilter._MostRecent",
      "Homepagefilter._lowtohigh",
      "Homepagefilter._hightolow",
      "Homepagefilter._ClosestFirst"
    ];
    
    const sortValue = getSortByData &&  getSortByData.sort 
    ? options.find((e,i) => i == getSortByData.sort) 
    : options.find((e,i) => i == getSortByData)

    return (
      <div className="dropdown pric">
        <div
          className="location-filter respimg newpri price-filt dropdown-toggle"
          data-toggle="dropdown"
          onClick={this.handleClick}
        >
          <div className="locatext locatingval">
            {" "}
            {this.props.t("Homepagefilter._SortBy")}
          </div>
          <div className="etw locmap popress">  { sortValue === undefined ? t("Homepagefilter._MostRecent") : t(sortValue) }</div>
        </div>
        <div class="dropdown-menu sortby">
          {this.state.render && (
            <SortFilter1
              value={this.dataUpdate}
              data={this.data}
              resetSort={this.props.resetSort}
              change={this.props.change}
              reset={this.props.reset}
            />
          )}
        </div>
      </div>
    );
  }
}
export default withTranslation("common")(SortFilter);