import React from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { compose, graphql } from "react-apollo";
import { withTranslation } from "react-i18next";

import {
  UPDATE_PAYMENT,
  GET_PRODUCT_ID,
  GET_ALL_PRODUCTS,
  GET_PRODUCT,
  UPDATE_PRODUCT,
  CLOSE_MODEL,
} from "../../../queries";
import * as Toastr from "../Toast.jsx";

// You can customize your Elements to give it the look and feel of your site.
const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "Open Sans, sans-serif",
        letterSpacing: "0.025em",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#c23d4b",
      },
    },
  };
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

class CardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      payGetproduct: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = ({ error }) => {
    if (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    let { stripeClientSecret, getCacheProductId, item } = this.props;
    let productId = getCacheProductId.productId;
    if (stripeClientSecret) {
      this.props.stripe.handleCardPayment(stripeClientSecret).then((result) => {
        if (result) {
          if (
            result.paymentIntent &&
            result.paymentIntent.status === "succeeded"
          ) {
            var setCustomerResponse = {
              data: {
                tokenId: result.paymentIntent.id,
                productId: parseInt(productId),
                amount: item.price,
                featuredId: parseInt(item.id),
                paymentMode: "Stripe"
              },
            };

            this.props
              .updatePayment({
                variables: setCustomerResponse,
              })
              .then(async ({ data }) => {
                var result = {
                  featuredTransactionId: data.id,
                };
                this.props
                  .updateProduct({
                    variables: { id: Number(productId), data: result },
                    refetchQueries: [
                      { query: GET_ALL_PRODUCTS, variables: { filter:{} } },
                      {
                        query: GET_PRODUCT,
                        variables: { id: Number(productId) },
                      },
                    ],
                  })
                  .then(async ({ data }) => {
                    //console.log(data)
                  });
                /*end Payment Update*/
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
          } else if (result.error) {
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
            this.props.isModelClose({ variables: { closeModel: true } });
            this.props.closeSlidingPanel();
          }
        }
      });
    }
  };

  render() {
    let { t } = this.props;
    return (
      <>
        <label>{t("Productdetails.card")}</label>
        <CardElement hidePostalCode={true}/>
        <button className="btn btn-danger" onClick={this.handleSubmit}>{t("Productdetails.pay")}</button>
      </>
    );
  }
}
var cardData = compose(
  graphql(UPDATE_PAYMENT, {
    name: "updatePayment",
  }),
  graphql(GET_PRODUCT_ID, {
    name: "getCacheProductId",
  }),
  graphql(UPDATE_PRODUCT, { name: "updateProduct" }),
  graphql(CLOSE_MODEL, { name: "isModelClose" })
)(CardForm);

export default withTranslation("common")(injectStripe(cardData));
