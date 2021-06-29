import React from "react";
import { compose, graphql } from "react-apollo";
import {
  CREATE_ROOM,
  POPUP_STATE_UPDATE,
  SEND_MESSAGE,
  GET_ROSTER
} from "../../../queries";
import loginStyles from "../../../assets/jss/material-dashboard-pro-react/components/loginComponent.jsx";
import headerStyles from "../../../assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import "../css/style.css";
import withStyles from "@material-ui/core/styles/withStyles";
import * as Toastr from "../Toast.jsx";
import { withTranslation } from "react-i18next";

var styles = {
  ...loginStyles,
  ...headerStyles(),
  customBtn: {
    borderColor: "white !important",
    "&:hover": {
      borderColor: "white !important"
    }
  }
};

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  handleChange(e) {
    e.preventDefault();
    this.setState({ chat: e.target.value });
  }

  handleKeyPress = (e, chat, history) => {
    if (e.key === "Enter") {
      this.handleSend(e, chat, history);
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onClick();
    }
  }

  handleSend(e, chat, history) {
    e.preventDefault();
    let { userId, id } = this.props.productInfo;
    let { currentUser, updateLoginPopupStatus } = this.props;
    if (currentUser.getCurrentUser != null) {
      this.props
        .createRoom({
          variables: {
            userId: Number(currentUser.getCurrentUser.id),
            productId: Number(id),
            productuserId: Number(userId)
          }
        })
        .then(async ({ data }) => {
          if (data) {
            var roomId = data.createRoom.id;
            if (chat.trim() !== "") {
              var variables = {
                message: chat,
                room: Number(roomId)
              };
              this.props
                .sendMessage({ 
                  variables: variables,
                  refetchQueries: [
                    { query: GET_ROSTER, variables: { type: "All" } }
                ] 
                })
                .then(async ({ data }) => {
                  if (data) {
                    Toastr.success(
                      <div className="msgg">
                        <div>
                          <svg
                            viewBox="0 0 24 24"
                            width="32"
                            height="32"
                            style={{
                              fill: "green"
                            }}
                          >
                            <path d="M21.621,12.166 C21.621,6.953 17.38,2.711 12.166,2.711 C6.952,2.711 2.711,6.953 2.711,12.166 C2.711,17.38 6.952,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 M23.332,12.166 C23.332,18.324 18.323,23.333 12.166,23.333 C6.009,23.333 1,18.324 1,12.166 C1,6.009 6.009,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 M17.274,8.444 C17.43,8.61 17.512,8.829 17.504,9.058 C17.495,9.287 17.398,9.499 17.23,9.654 L10.507,15.93 C10.348,16.078 10.141,16.159 9.925,16.159 C9.695,16.159 9.48,16.07 9.319,15.909 L7.078,13.667 C6.917,13.507 6.827,13.292 6.827,13.064 C6.826,12.835 6.916,12.619 7.078,12.457 C7.4,12.134 7.965,12.134 8.287,12.457 L9.944,14.114 L16.065,8.402 C16.393,8.094 16.965,8.113 17.274,8.444"></path>
                          </svg>
                        </div>
                        <div>{this.props.t("Sellerdetails._messagesent")}</div>
                      </div>
                    );
                  }
                })
                .catch(error => {
                  var message = error.graphQLErrors.map((x) => x.message);
                  Toastr.success(
                    <div className="msgg">
                      <div>
                        <svg
                          viewBox="0 0 24 24"
                          width="32"
                          height="32"
                          style={{
                            fill: "red"
                          }}
                        >
                          <path d="M11.09,12.167 L7.589,15.669 C7.291,15.966 7.291,16.448 7.589,16.745 C7.886,17.043 8.368,17.043 8.665,16.745 L12.167,13.244 L15.669,16.745 C15.966,17.043 16.448,17.043 16.745,16.745 C17.042,16.448 17.042,15.966 16.745,15.669 L13.243,12.167 L16.745,8.665 C17.042,8.368 17.042,7.886 16.745,7.589 C16.448,7.291 15.966,7.291 15.669,7.589 L12.167,11.09 L8.665,7.589 C8.368,7.291 7.886,7.291 7.589,7.589 C7.291,7.886 7.291,8.368 7.589,8.665 L11.09,12.167 Z M2.711,12.166 C2.711,17.38 6.953,21.622 12.166,21.622 C17.38,21.622 21.621,17.38 21.621,12.166 C21.621,6.952 17.38,2.711 12.166,2.711 C6.953,2.711 2.711,6.952 2.711,12.166 Z M1,12.166 C1,6.009 6.01,1 12.166,1 C18.323,1 23.332,6.009 23.332,12.166 C23.332,18.323 18.323,23.333 12.166,23.333 C6.01,23.333 1,18.323 1,12.166 Z"></path>
                        </svg>
                      </div>
                      <div>{message[0]}</div>
                    </div>
                  );
                });
              this.setState({ chat: "" });
            }
          }
        });
    } else {
      updateLoginPopupStatus({
        variables: {
          isOpen: true
        }
      });
    }
    return this.props.onClick();
  }
  render() {
    let { classes, history, t } = this.props;
    let { chat } = this.state;
    var enabled = !!chat ? classes.enabledState : "";
    return (
      <div className="bgclaye">
        {" "}
        <div
          className={classes.jjjjkf + " submiresposndive"}
          open=""
          ref={this.setWrapperRef}
        >
          <ul className={classes.cWKbaS + " typingrebox"}>
            <li>
              <div className={classes.kHpzoU}>
                <form className={classes.iJwhBC}>
                  <div className={classes.pdTeD + " nobrderdisu"}>
                    <div className={classes.dcMBRc}>
                      <input
                        autocomplete="off"
                        type="text"
                        onChange={this.handleChange}
                        placeholder={t("Sellerdetails._Typemessagehere")}
                        className={classes.koIpSk + " newclass"}
                        value={chat}
                        onKeyPress={(e) => this.handleKeyPress(e, chat, history)}
                      />
                    </div>
                    <div className={classes.kXpwzh}>
                      <Button
                        className={classes.gocXI + " " + `${enabled}`}
                        disabled={false}
                        onClick={(e) => this.handleSend(e, chat, history)}
                      >
                        {t("Sellerdetails._Send")}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

var CI = compose(
  graphql(CREATE_ROOM, { name: "createRoom" }),
  graphql(SEND_MESSAGE, { name: "sendMessage" }),
  graphql(POPUP_STATE_UPDATE, { name: "updateLoginPopupStatus" })
)(ChatInput);

export default withTranslation("common")(withStyles(styles)(CI));
