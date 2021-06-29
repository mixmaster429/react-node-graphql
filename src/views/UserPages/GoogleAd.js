import React, {Component} from "react";
import PropTypes from "prop-types";

export default class GoogleAd extends Component {
  static propTypes = {
    client: PropTypes.string,
    slot: PropTypes.string,
    format: PropTypes.string,
    wrapperDivStyle: PropTypes.object
  }
  
  
  componentDidMount () {
    (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-app-pub-8900152228324034~2828283056",
          enable_page_level_ads: true
     });
}

  render() {
    return (
      <div style={this.props.wrapperDivStyle} > 
        <ins className="adsbygoogle"  
          style={{'display': 'block'}}
          data-ad-client={this.props.client}
          data-ad-slot={this.props.slot}
          data-ad-format={this.props.format}>
        </ins>
      </div>
    );
  }
}
