import React, { Component } from "react";
import SideAd from "../../../assets/img/sideAd.jpg";

export default class Ads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carfillter: true
    };
  }
  // scrollFix = () => {
  //     let el = document.getElementById("elId");
  //     el.style.position = "relative";
  //     let elr = document.getElementById("elId").getBoundingClientRect().top;
  //     var el1 = document.getElementById("ldmr");
  //     var elTop = elr - document.body.getBoundingClientRect().top;
  //     var elTop1 =
  //       el1.getBoundingClientRect().top -
  //       document.body.getBoundingClientRect().top;
  //     window.addEventListener("scroll", function() {
  //       if (document.documentElement.scrollTop > elTop - 100) {
  //         el.style.position = "fixed";
  //         el.style.top = "130px";
  //         el.style.bottom = "inherit";
  //         if (document.documentElement.scrollTop > elTop1) {
  //           el.style.position = "absolute";
  //           el.style.top = "inherit";
  //           el.style.bottom = "0";
  //         }
  //       } else {
  //         el.style.position = "relative";
  //         el.style.top = "auto";
  //       }
  //     });
  //   };

  //   componentWillReceiveProps(nextProps){
  //       if(nextProps.update !== this.props.update){
  //         this.scrollFix()
  //       }
  //   }

  render() {
    return (
      // <div className={classes.googAd + (allProducts.length < 8 ? " none" : "")}>
      <div className={this.state.carfillter === true ? "addbanner" : ""}>
        <div className={this.props.length < 8 ? " none" : ""}>
          <div className="ipKAwf" id="elId">
            <div className="lkyypg">
              <div className="qagQv">
                <img className="responsive" src={SideAd} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
