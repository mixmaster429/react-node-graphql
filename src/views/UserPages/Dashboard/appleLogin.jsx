import React, { Component } from "react";
import Modal from "react-modal";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import { SOCIAL_LOGIN } from "../../../queries";
import { compose, graphql } from "react-apollo";
import * as Toastr from "../Toast.jsx";
import { getUserId } from "../../../helper";
const REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const customStyles2 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "auto",
  },
};

class appleLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModelPopup: false,
      errors: {},
      inputValue: "",
      modelState: false,
    };
  }

  componentWillMount() {
    let { match } = this.props;
    if (match.params.id) {
      this.setState({
        showModelPopup: true,
        modelState: true,
      });
    }
  }

  updateEmailValue = (type, evt) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let { errors } = this.state;
    if (!emailRex.test(evt.target.value)) {
      this.setState({
        isButtonDisabled: true,
      });
      errors.popEmail = "Invalid Email Id";
    } else {
      errors.popEmail = "";
      this.setState({
        isButtonDisabled: false,
        inputValue: evt.target.value,
      });
    }
  };

  updateUsername = (type, evt) => {
    this.setState({
      isButtonDisabled: false,
      InputUserName: evt.target.value,
    });
  };

  closeModel = () => {
    this.setState({
      showModelPopup: false,
      modelState: false,
    });
    this.props.history.push("/");
  };

  updateSocialLogin = (email, name) => {
    let { socialLogin, match } = this.props;
    let { errors } = this.state;
    if (email && name) {
      if (match.params.id) {
        let userResponseData = getUserId(match.params.id);
        if (userResponseData && userResponseData.sub) {
          socialLogin({
            variables: {
              data: {
                email: email,
                userName: name,
                appleId: userResponseData.sub,
              },
            },
          })
            .then(async ({ data }) => {
              console.log("data", data);
              this.props.history.push("/");
            })
            .catch((error) => {
              console.log("error", error);
              this.props.history.push("/");
            });
        } else {
          this.setState({
            isButtonDisabled: true,
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
              <div>
                Please Check the Apple login credentials and try again later
              </div>
            </div>
          );
        }
      } else {
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
            <div>Invalid Apple Id. Please Try again later</div>
          </div>
        );
        this.history.push("/");
      }
    } else {
      this.setState({
        isButtonDisabled: true,
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
          <div>Please Fill the Required Fields</div>
        </div>
      );
    }
  };

  render() {
    let { classes } = this.props;
    let { showModelPopup, errors, modelState } = this.state;
    return (
      <div>
        {modelState && (
          <Modal
            isOpen={showModelPopup}
            contentLabel="Minimal Modal Example"
            style={customStyles2}
          >
            <div className="botnbtn">
              <p>
                <b>
                  Below fields are required for further flow. So please submit
                  your details here
                </b>
              </p>
              <div className="text-left">
              <label> Email: <span className="validatcolor">*</span>{" "} </label>
              <Input
                defaultValue={this.state.inputValue}
                //className={classes.popsp}
                fullWidth
                inputProps={{
                  onChange: (e) => this.updateEmailValue("email", e),
                }}
              />
              <FormHelperText error={errors.popEmail}>
                {errors.popEmail}
              </FormHelperText>
              </div>
            <div className="text-left">
             <label> UserName: <span className="validatcolor">*</span> </label>
              <Input
                defaultValue={this.state.InputUserName}
                //className={classes.popsp}
                fullWidth
                inputProps={{
                  onChange: (e) => this.updateUsername("userName", e),
                }}
              />
              <FormHelperText error={errors.userName}>
                {errors.userName}
              </FormHelperText>
              </div>
              <div className="brbtn">
                <button
                  disabled={this.state.isButtonDisabled}
                  type="button"
                  className="reporlst"
                  onClick={(e) =>
                    this.updateSocialLogin(
                      this.state.inputValue,
                      this.state.InputUserName
                    )
                  }
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="reporcl"
                  onClick={this.closeModel}
                >
                  {" "}
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

var appleLoginComp = compose(graphql(SOCIAL_LOGIN, { name: "socialLogin" }))(
  appleLogin
);

export default appleLoginComp;
