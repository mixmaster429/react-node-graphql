import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import powericon from "../../../assets/img/powericon.png";
import { compose, graphql } from "react-apollo";
import {
  GET_FEATURELIST_DETAILS,
  GET_PAYMENT_TOKEN,
  UPDATE_PAYMENT,
  GET_PRODUCT_ID,
  UPDATE_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_PRODUCT,
  CLOSE_MODEL,
  GET_SITE_INFO,
  GET_STRIPE_SECRET,
} from "../../../queries";
import { BraintreeDropIn } from "braintree-web-react";
import { getSymbol } from "../../../helper.js";
import * as Toastr from "../Toast.jsx";
import Modal from "react-modal";
import { withTranslation } from "react-i18next";
//import StripeCheckout from 'react-stripe-checkout';
import PaypalExpressBtn from "react-paypal-express-checkout";
import CardForm from "./CardForm.js";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { StripeProvider, Elements } from "react-stripe-elements";
import paypal from 'paypal-checkout';
import Braintree from 'braintree-web';
import PaypalCheckout from 'braintree-web/paypal-checkout';
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height: "auto",
    maxHeight: "100%",
    padding:"0 0 10px 0px"
  },
};

// const theme = createMuiTheme({
//   overrides: {
//     MuiTabs: {
//       indicator: {
//         backgroundColor: orange[700]
//       }
//     },
//     MuiTab: {
//       root: {},
//       selected: {
//         backgroundColor: "rgb(255, 63, 85)!important",
//         color: "#fff!important"
//       }
//     }
//   }
// });

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
}

// function getList() {
//   return new Promise(function(resolve) {
//     setTimeout(() => resolve([1, 2, 3]), 1000);
//   });
// }

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  bigIndicator: {
    backgroundColor: "transparent",
  },
});

const PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

class SimpleTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      featured: [],
      clientToken: null,
      modalIsOpen: false,
      productId: "",
      //isLoading: false,
      show: false,
      isLoadingfuture: false,
      showfuture: false,
      paymentId: 1,
      clicked: true,
      PayButtonEnabled: false,
      buttonDisabled: false,
      braintreeOptions: true,
      payGetproduct: this.props.pathPush,
      braintree: false,
      stripe: false,
      paypal: false,
      paypalAppId: "",
      stripePublishKey: "",
      stripeClientSecret: "",
      paymentOptions: [],
      selectedPaymentOption: "",
      handleFeaturedData: {},
      commit: true,
      Environment:""
     //env: 'sandbox',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.purchase = this.purchase.bind(this);
  }

  instance;

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentWillMount() {
    let { getFeatureddetails, siteInfo } = this.props;
    // let featured = [];
    getFeatureddetails.refetch().then(({ data }) => {
      if(data){
        let paymentData = data.getFeaturedDetails.paymentInfo;
        paymentData.filter(x=> x.payment_type === "Paypal").map((z) => {
              this.setState({
                paypalClientKey : z.key
            })
        })
        this.setState({
          featured: data.getFeaturedDetails.featuredInfo,
        });
      }
    });
  
    siteInfo.refetch();
    if (siteInfo.getSiteInfo) {
      //let info = siteInfo.getSiteInfo;
      let {
        braintree,
        stripe,
        paypal,
        stripePublishKey,
        Environment
      } = siteInfo.getSiteInfo;
    
      let paymentOptions = [];
      if (braintree) {
        paymentOptions.push(this.props.t("Productdetails.Braintree"));
      }
      if (stripe) {
        paymentOptions.push(this.props.t("Productdetails.Stripe"));
      }
      if (paypal) {
        paymentOptions.push(this.props.t("Productdetails.Paypal"));
      }

      this.setState({
        braintree,
        stripe,
        paypal,
        stripePublishKey,
        paymentOptions,
        Environment
      });
    }
  }

  getData = () => {
    this.props
      .getPaymentToken()
      .then(({ data }) => {
        this.setState({
          clientToken: data.createClientToken.clientToken,
          modalIsOpen: true,
          isLoadingfuture: false,
          showfuture: false,
        });
      })
      .catch((error) => {
        var message = error.graphQLErrors.map((x) => x.message);
        Toastr.success(
          <div className="msgg">
            <div>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                style={{ fill: "red" }}
              >
                <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
              </svg>
            </div>
            <div>{message[0]}</div>
          </div>
        );
        this.props.isModelClose({ variables: { closeModel: true } });
        this.props.closeSlidingPanel();
      });
  };

  handleSubmit = (e, item) => {
    this.setState({
      modalIsOpen: true,
      showfuture: false,
      isLoadingfuture: true,
      price: item.price,
      featuredId: parseInt(item.id),
      handleFeaturedData: item,
    });
  };

  closeModal() {
    this.setState({
      modalIsOpen: false,
      isLoadingfuture: false,
      PayButtonEnabled: false,
    });
  }

  purchase = async (price, id) => {
    let { getCacheProductId } = this.props;
    let productId = getCacheProductId.productId;
    if (this.state.disabled) {
      return;
    }
    this.setState({ disabled: true });
    const { nonce } = await this.instance.requestPaymentMethod();
    var setResponse = {
      data: {
        nonce: nonce,
        productId: parseInt(productId),
        amount: price,
        featuredId: parseInt(id),
        paymentMode: "Braintree"
      },
    };
    this.props
      .updatePayment({
        variables: setResponse,
      })
      .then(async ({ data }) => {
        if (data.ChargePaymentMethod.success === true) {
          this.setState({
            pay: data.ChargePaymentMethod.success,
            PayButtonEnabled: false,
          });

          var result = {
            // featured : data.ChargePaymentMethod.transaction.id,
            featuredTransactionId: data.ChargePaymentMethod.transaction.id,
          };

          this.props
            .updateProduct({
              variables: { id: Number(productId), data: result },
              refetchQueries: [
                { query: GET_ALL_PRODUCTS, variables: { filter:{} } },
                { query: GET_PRODUCT, variables: { id: Number(productId) } },
              ],
            })
            .then(async ({ data }) => {
              //console.log(data)
            });

          Toastr.success(
            <div className="msgg">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  style={{ fill: "green" }}
                >
                  <path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path>
                </svg>
              </div>
              <div>{this.props.t("Sellerdetails._Paymentplaced")} </div>
            </div>
          );
          this.setState({
            modalIsOpen: false,
            show: false,
            PayButtonEnabled: false,
            disabled: true,
          });
          this.props.isModelClose({ variables: { closeModel: true } });
          this.props.closeSlidingPanel();

          document.body.style = "overflow-y:scroll !important";
        } else {
          this.setState({
            pay: data.ChargePaymentMethod.success,
          });

          Toastr.success(
            <div className="msgg">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  style={{ fill: "red" }}
                >
                  <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
                </svg>
              </div>
              <div>{this.props.t("Sellerdetails._PaymentProcess")}</div>
            </div>
          );
          this.setState({
            modalIsOpen: false,
            show: false,
            PayButtonEnabled: false,
            disabled: true,
          });
          this.props.isModelClose({ variables: { closeModel: true } });
          this.props.closeSlidingPanel();
          document.body.style = "overflow-y:scroll !important";
        }
      })
      .catch((error) => {
        var message = error.graphQLErrors.map((x) => x.message);
        Toastr.success(
          <div className="msgg">
            <div>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                style={{ fill: "red" }}
              >
                <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
              </svg>
            </div>
            <div>{message[0]}</div>
          </div>
        );
        this.setState({
          modalIsOpen: false,
          PayButtonEnabled: false,
          disabled: true,
        });
        this.props.isModelClose({ variables: { closeModel: true } });
        this.props.closeSlidingPanel();
      });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  showHide = (id) => {
    this.setState({
      paymentId: id,
      value: "",
    });
    document.body.style = "overflow-y:hidden !important";
  };

  handleResponse = async (res) => {
    res.on("paymentMethodRequestable", (event) => {
      if (event.type === "CreditCard") {
        this.setState({
          PayButtonEnabled: true,
        });
      } else if (event.type === "PayPalAccount") {
        this.setState({
          PayButtonEnabled: true,
        });
      }
    });
  };

  paymentChange = (e) => {
    let { handleFeaturedData } = this.state;
    this.setState({
      selectedPaymentOption: e.target.value,
    });
    if (e.target.value === this.props.t("Productdetails.Braintree")) {
      this.getData();
    }

    if (e.target.value === this.props.t("Productdetails.Stripe")) {
      let tokenInput = {
        data: {
          featuredId: parseInt(handleFeaturedData.id),
        },
      };
      this.props
        .getStripeClientToken({
          variables: tokenInput,
        })
        .then(({ data }) => {
          if (data.createStripeClientToken) {
            this.setState({
              stripeClientSecret: data.createStripeClientToken.clientSecret,
            });
          }
        }).catch((error) => { 
          var message = error.graphQLErrors.map((x) => x.message);
          Toastr.success(
            <div className="msgg">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  style={{ fill: "red" }}
                >
                  <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
                </svg>
              </div>
              <div>{message[0]}</div>
            </div>
          );
          this.props.isModelClose({ variables: { closeModel: true } });
          this.props.closeSlidingPanel();
          
        })
    }

    if(e.target.value === this.props.t("Productdetails.Paypal")){
       let {paypalClientKey} = this.state;
       if(paypalClientKey == ""){
        Toastr.success(
          <div className="msgg">
            <div>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                style={{ fill: "red" }}
              >
                <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
              </svg>
            </div>
            <div>{this.props.t("Productdetails.PaypalCredentials")}</div>
          </div>
        );
        this.props.isModelClose({ variables: { closeModel: true } });
        this.props.closeSlidingPanel();
        this.props.history.push("/")
       }

    }
  };

  closePopup = (e) => {
    this.setState({
      modalIsOpen: false,
      isLoadingfuture: false,
      PayButtonEnabled: false,
      selectedPaymentOption: "",
      clientToken: null,
    });
  };

   payment(data, actions) {
    return actions.braintree.create({
      flow: 'checkout',
      amount: this.state.price.toString(), // be sure to validate this amount on your server
      currency: 'USD'
    });
  }

  onAuthorize(payload, actions) {
    let { getCacheProductId } = this.props;
    let productId = getCacheProductId.productId;
    var setResponse = {
      data: {
        nonce: payload.nonce,
        productId: parseInt(productId),
        amount: this.state.price,
        featuredId: this.state.featuredId,
        paymentMode: "Paypal"
      },
    };
    this.props
      .updatePayment({
        variables: setResponse,
      })
      .then(async ({ data }) => {
        if (data.ChargePaymentMethod.success === true) {
          this.setState({
            pay: data.ChargePaymentMethod.success,
            PayButtonEnabled: false,
          });

          var result = {
            // featured : data.ChargePaymentMethod.transaction.id,
            featuredTransactionId: data.ChargePaymentMethod.transaction.id,
          };

          this.props
            .updateProduct({
              variables: { id: Number(productId), data: result },
              refetchQueries: [
                { query: GET_ALL_PRODUCTS, variables: { filter:{} } },
                { query: GET_PRODUCT, variables: { id: Number(productId) } },
              ],
            })
            .then(async ({ data }) => {
              //console.log(data)
            });

          Toastr.success(
            <div className="msgg">
              <div>
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  style={{ fill: "green" }}
                >
                  <path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path>
                </svg>
              </div>
              <div>{this.props.t("Sellerdetails._Paymentplaced")} </div>
            </div>
          );
           this.props.isModelClose({ variables: { closeModel: true } });
           this.props.closeSlidingPanel();

         // document.body.style = "overflow-y:scroll !important";
        } else {
          this.setState({
            pay: data.ChargePaymentMethod.success,
          });

          // Toastr.success(
          //   <div className="msgg">
          //     <div>
          //       <svg
          //         viewBox="0 0 24 24"
          //         width="32"
          //         height="32"
          //         style={{ fill: "red" }}
          //       >
          //         <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
          //       </svg>
          //     </div>
          //     <div>{this.props.t("Sellerdetails._PaymentProcess")}</div>
          //   </div>
          // );
          // this.setState({
          //   modalIsOpen: false,
          //   show: false,
          //   PayButtonEnabled: false,
          //   disabled: true,
          // });
          // this.props.isModelClose({ variables: { closeModel: true } });
          // this.props.closeSlidingPanel();
          // document.body.style = "overflow-y:scroll !important";
        }
      })
      .catch((error) => {
        var message = error.graphQLErrors.map((x) => x.message);
        Toastr.success(
          <div className="msgg">
            <div>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                style={{ fill: "red" }}
              >
                <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
              </svg>
            </div>
            <div>{message[0]}</div>
          </div>
        );
        this.setState({
          modalIsOpen: false,
          PayButtonEnabled: false,
          disabled: true,
        });
        this.props.isModelClose({ variables: { closeModel: true } });
        this.props.closeSlidingPanel();
      });
  }

  render() {
    let {
      value,
      featured,
      clientToken,
      pay,
      paymentId,
      stripePublishKey,
      paymentOptions,
      paypalClientKey,
      selectedPaymentOption,
      Environment
    } = this.state;
    
     let { classes, t } = this.props;

    const paypalSandboxConf = {
      currency: "USD",
      env: 'sandbox',
      client:{
        sandbox: paypalClientKey
      },
      style:{
        label:"pay",
        size:"medium",
        shape:"rect",
        color:"gold"
      }
    }

    const paypalProductionConf = {
      currency: "USD",
      env: 'production',
      client:{
        producution: paypalClientKey
      },
      style:{
        label:"pay",
        size:"medium",
        shape:"rect",
        color:"gold"
      }
    }

    const envData = Environment === "Sandbox" ? paypalSandboxConf : paypalProductionConf
  
    return (
      <div className="paymentwrapper">
        <div className="paymenttitle titlebgspsce">
          <h5>
            <span>
              <img src={powericon} alt="" />
            </span>
            {t("Productdetails._REACHMORE")}
          </h5>
          <h6> {t("Productdetails._UpgradeProduct")} </h6>
        </div>
        <div className={classes.root}>
          <div>
            <div
              className={
                featured.length > 3
                  ? "reactbuy"
                  : "reactbuy centeralignteactbuy"
              }
            >
              <ul value={value} onChange={this.handleChange}>
                {featured
                  .filter((item) => item.status !== "Inactive")
                  .map((item, index) => (
                    <span>
                      <li
                        className={
                          paymentId === item.id || value === index
                            ? "paymentactive btncolorchange"
                            : "noactivepayment btncolorchange"
                        }
                        onClick={() => this.showHide(item.id)}
                        title={item.name}
                      >
                        {" "}
                        <span> {item.name} </span>{" "}
                      </li>
                    </span>
                  ))}
              </ul>
            </div>
            {featured
              .filter((item) => item.status !== "Inactive")
              .map((item, index) => {
                //console.log(item)
                return (
                  <div>
                    <div>
                      {value === index || paymentId === item.id ? (
                        <div className="tabcontebt">
                          <div className="paymenttitle">
                            {/* <h5> Attract {item.name} more buyers</h5> */}
                            <p>{item.description}</p>
                          </div>
                          <div className="tabimgvw">
                            <div className="centealgnimg">
                              <img
                                src={item.image}
                                className="img-fluid"
                                alt=""
                              />
                            </div>

                            <div className="sav_chang paymentbtnres">
                              <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={this.state.isLoadingfuture}
                                onClick={(e) => this.handleSubmit(e, item)}
                              >
                                {this.state.isLoadingfuture
                                  ? t("Productdetails._Loading")
                                  : t("Productdetails._FeatureIt")}{" "}
                                <span className="rtlchage">
                                  {" "}
                                  {getSymbol(item.currencySymbol)}{" "}
                                </span>
                                {item.price}
                              </button>
                            </div>
                            {localStorage.getItem("currency") !== "USD" && (
                              <div className="rtlwrapper">
                                <span className="rtlcenter">
                                  <span className="rtlchage">
                                    {t("Productdetails.note")}
                                  </span>{" "}
                                  <b>
                                    <span className="rtlchage">
                                      {getSymbol(
                                        localStorage.getItem("currencySymbol")
                                      )}
                                    </span>{" "}
                                    <span className="rtlchage">
                                      {item.beforeconversionMsg}{" "}
                                    </span>
                                    <span className="rtlchage">
                                      {t("Productdetails._convertions")}{" "}
                                    </span>{" "}
                                    <span className="rtlchage"> $ </span>
                                    <span className="rtlchage">
                                      {" "}
                                      {item.afterconversionMsg}
                                    </span>
                                  </b>
                                </span>
                              </div>
                            )}
                            <Modal
                              isOpen={this.state.modalIsOpen}
                              onAfterOpen={this.afterOpenModal}
                              //onRequestClose={this.closeModal}
                              style={customStyles}
                              contentLabel="Example Modal"
                            >
                              <div class="closeabou cls_paymodal">
                                <div className="fKYHrH">
                                  <div className="modal-header">
                                  <h5 class="modal-title">Payment Details</h5>
                                    <button
                                      onClick={this.closePopup}
                                      type="button"
                                      class="close"
                                      data-dismiss="modal"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="innercongrat">
                                      {selectedPaymentOption === "" && (
                                        <GridContainer>
                                          <GridItem xs={12} sm={12}>
                                            <FormControl
                                              fullWidth
                                              className={
                                                classes.selectFormControl
                                              }
                                            >
                                              <InputLabel
                                                htmlFor="unit"
                                                className={classes.selectLabel}
                                              >
                                                {!selectedPaymentOption &&
                                                  t(
                                                    "Sellerdetails._choosepaymemt"
                                                  )}
                                              </InputLabel>
                                              <Select
                                                MenuProps={{
                                                  className: classes.selectMenu,
                                                }}
                                                classes={{
                                                  select: classes.select,
                                                }}
                                                value={selectedPaymentOption}
                                                onChange={(event) =>
                                                  this.paymentChange(event)
                                                }
                                                inputProps={{
                                                  name: "selectedPaymentOption",
                                                  id: "selectedPaymentOption",
                                                }}
                                              >
                                                <MenuItem
                                                  disabled
                                                  classes={{
                                                    root:
                                                      classes.selectMenuItem,
                                                  }}
                                                >
                                                  {t(
                                                    "Sellerdetails._choosepaymemt"
                                                  )}
                                                </MenuItem>
                                                {paymentOptions.length > 0 &&
                                                  paymentOptions.map((u, i) => {
                                                    return (
                                                      <MenuItem
                                                        key={i}
                                                        classes={{
                                                          root:
                                                            classes.selectMenuItem,
                                                          selected:
                                                            classes.selectMenuItemSelected,
                                                        }}
                                                        value={u}
                                                      >
                                                        {u}
                                                      </MenuItem>
                                                    );
                                                  })}
                                              </Select>
                                            </FormControl>
                                          </GridItem>
                                        </GridContainer>
                                      )}
                                      {this.state.selectedPaymentOption ===
                                        this.props.t("Productdetails.Braintree") && !clientToken ? (
                                        <div className="payloadingcss">
                                          <div className="fixedpayment">
                                            {/* <Loader
                                        type="Oval"
                                        color="#dc3545"
                                        height={100}
                                        width={100}
                                        timeout={10000} //3 secs
                                      /> */}
                                            <h3>
                                              {" "}
                                              {t("Productdetails._Loading")}
                                            </h3>
                                          </div>
                                        </div>
                                      ) : (
                                        <div>
                                          <BraintreeDropIn
                                            options={{
                                              authorization: clientToken,
                                              // paypal: {
                                              //   flow: "checkout",
                                              //   amount: item.price,
                                              //   currency: "USD",
                                              //   // intent: 'capture'
                                              // },
                                            }}
                                            onInstance={(instance) => {
                                              this.handleResponse(instance);
                                              this.instance = instance;
                                            }}
                                          />
                                          <div
                                            className={
                                              pay == true ? "nobtnvw" : "btnvw"
                                            }
                                          >
                                            <div className="sav_chang paymentchng">
                                              {/* <button  className="btn btn-danger" disabled={this.state.isLoading} onClick={() =>this.purchase(productId,item.price,item.name)}>{this.state.isLoading ? "Loading..." : "Pay"} {getSymbol(item.currencySymbol)}{item.price}</button> */}
                                              {/* {getSymbol(item.currencySymbol)}{item.price} */}
                                              {this.state.PayButtonEnabled && (
                                                <button
                                                  className="btn btn-danger"
                                                  onClick={() =>
                                                    this.purchase(
                                                      item.price,
                                                      item.id
                                                    )
                                                  }
                                                  disabled={this.state.disabled}
                                                >
                                                  {this.state.disabled ? (
                                                    t("Productdetails._Paying")
                                                  ) : (
                                                    <>
                                                      {" "}
                                                      {t(
                                                        "Productdetails._Pay"
                                                      )}{" "}
                                                      {getSymbol(
                                                        item.currencySymbol
                                                      )}
                                                      {item.price}{" "}
                                                    </>
                                                  )}
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                          {/* <button onClick={this.purchase.bind(this)}>Submit</button>  */}
                                        </div>
                                      )}

                                      {this.state.selectedPaymentOption ===
                                        this.props.t("Productdetails.Stripe") && (
                                        <div className="stripedf cls_stripe">
                                          <StripeProvider
                                            apiKey={stripePublishKey}
                                          >
                                            <Elements>
                                              <CardForm
                                                stripeClientSecret={
                                                  this.state.stripeClientSecret
                                                }
                                                item={item}
                                                closeSlidingPanel={
                                                  this.props.closeSlidingPanel
                                                }
                                                history={this.props.history}
                                              />
                                            </Elements>
                                          </StripeProvider>
                                        </div>
                                      )}
                                      {this.state.selectedPaymentOption ===
                                        this.props.t("Productdetails.Paypal") && (
                                        <div className="PaypalExpressBtn">
                                          {/* <PaypalExpressBtn
                                            env={paypalEnvironment}
                                            commit="true"
                                            client={envData}
                                            currency="USD"
                                            total={item.price}
                                            onError={this.onError}
                                            onSuccess={this.onSuccess}
                                            onCancel={this.onCancel}
                                          />      */}
                                          <PayPalButton
                                              braintree={Braintree}
                                              commit={ this.state.commit }
                                              env={ envData.env }
                                              client={envData.client}
                                              payment={ (data, actions) => this.payment(data, actions) }
                                              onAuthorize={ (data, actions) => this.onAuthorize(data, actions) }
                                              style={envData.style}
                                          />
                                      </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Modal>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}{" "}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

var categorylist = compose(
  graphql(GET_FEATURELIST_DETAILS, {
    name: "getFeatureddetails",
  }),
  graphql(GET_PAYMENT_TOKEN, {
    name: "getPaymentToken",
  }),
  graphql(GET_STRIPE_SECRET, {
    name: "getStripeClientToken",
  }),
  graphql(UPDATE_PAYMENT, {
    name: "updatePayment",
  }),
  graphql(GET_PRODUCT_ID, {
    name: "getCacheProductId",
  }),
  graphql(GET_SITE_INFO, { name: "siteInfo" }),

  graphql(UPDATE_PRODUCT, { name: "updateProduct" }),
  graphql(CLOSE_MODEL, { name: "isModelClose" })
)(SimpleTabs);

export default withTranslation("common")(withStyles(styles)(categorylist));
