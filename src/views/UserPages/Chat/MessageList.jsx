import React from "react";
import { compose, graphql } from "react-apollo";
import {
  GET_ROSTER,
  ISOPEN,
  BLOCK_USER,
  GET_CURRENT_USER,
  SUBSCRIPTIONS,
  GET_MESSAGES,
  SEND_MESSAGE
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/chatStyle.jsx";
import { dateAdd, getSymbol, customButtonKeys } from "../../../helper.js";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import * as Toastr from "../Toast.jsx";
const findTimeStamp = (d, t, lang) => {
  return dateAdd(d, t, lang);
};

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "30%",
//     padding: "25px"
//   }
// };

class MessageRight extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cuId: {},
      chatText: "",
      message1: [],
      subscribemsgs: [],
      DeleteModelBlock: false,
      currentUser: {},
      currentUserpage: ""
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    // setTimeout(() => {
    if (this.props.initialload === false) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    //   )}, 1000);
  };
  componentDidMount() {
    this.scrollToBottom();
    let { currentUser } = this.props;
    currentUser.refetch();
    this.setState({
      currentUser: currentUser.getCurrentUser && currentUser.getCurrentUser,
      currentUserpage:
        currentUser.getCurrentUser && currentUser.getCurrentUser.id
    });
  }

  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.rosterGroupId);
  }

  componentWillReceiveProps(newProps) {
    //let { getMessages } = newProps
    if (newProps.rosterGroupId !== this.props.rosterGroupId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(newProps.rosterGroupId);
    }
  //   if(newProps.getMessages.message != this.props.getMessages.message){
  //     getMessages.refetch({id: Number(newProps.rosterGroupId)  }).then(({data}) => {
  //   })
  // }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = channelId =>
    this.props.getMessages.subscribeToMore({
      document: SUBSCRIPTIONS,
      variables: { chatroomId:Number(channelId)},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        return {
          getMessages: {
            message: [
              ...prev.getMessages.message,
              subscriptionData.data.messageAdded
            ],
            __typename: prev.getMessages.__typename
          }
        };
      }
    });

  handleSend(e, cc, chatText) {
      e.preventDefault();
      var roomId = cc.groupId;
  
      if (chatText.trim() !== "") {
        var variables = {
          message: chatText,
          room: Number(roomId)
        };
        this.props
          .sendMessage({
            variables: variables
          })
          .then(async ({ data }) => {
            if (data) {
              //console.log("Message Sent", data);
            }
          })
          .catch(error => {
            var message = error.graphQLErrors.map(x => x.message);
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
          });
        this.setState({ chatText: "" });
      }
    }

    handleKeyPress = (e, currConv, chatText) => {
        if (e.key === "Enter") {
          this.handleSend(e, currConv, chatText);
        }
    };

    handleInput = (e) => {
      e.preventDefault();
      this.setState({
        chatText: e.target.value
      });
    }
  
  render() {
    const timestamp = Date.now();
    let {
      classes,
      t,
      getMessages: { getMessages },
      initialload
    } = this.props;

    return (
      <>
        {initialload === true ? (
          <div className={classes.chatConv + " " + "righrsidewharr"}>
            <div className="gidrfw">
              <div className="kmsjzE">
                <div className="startlod">
                  <p> {t("Sellerdetails._Tapconversation")} </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              window.screen.width > 991
                ? classes.chatConv + " " + "resfullwidthh dfgdfgfg"
                : classes.chatConv + " " + "resfullwidthh"
            }
          >
            <div className={classes.chatConvBox}>
              <div
                style={{
                  display: "flex",
                  width: "90%",
                  alignItems: "center"
                }}
              >
                <div class="sc-fjdhpX jsvhtV" onClick={this.props.handleClick}>
                  <button
                    type="button"
                    //role="button"
                    class="sc-iwsKbI Messagesstyles__BackButton-sc-124z4po-35 etrQOB sc-gqjmRU jxllvb"
                    data-testid="mobile-back-button"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      class="sc-jTzLTM fznnpf"
                    >
                      <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z"></path>
                    </svg>
                  </button>
                </div>

                <div>
                  <Link to={`/SellerDetails/${this.props.currConv.userId}`}>
                    <img
                      src={this.props.currConv.profileImage}
                      style={{ borderRadius: "50%" }}
                    />
                  </Link>
                </div>

                <div className={classes.chatName + " " + "rtlarrowchat"}>
                  <span className="chatnm">{this.props.currConv.userName}</span>
                </div>

                <div
                  className={classes.chatConversation + " " + "hideprodurcha"}
                >
                  <div>
                    <h2
                      className="chatnavcl"
                      style={{
                        fontWeight: "normal",
                        maxWidth: "300px",
                        fontSize: "18px"
                      }}
                    >
                      {this.props.currConv.productName}
                    </h2>
                  </div>
                  <div>
                    <span
                      style={{
                        color: "rgb(117, 117, 117)",
                        lineHeight: "1.2em",
                        fontWeight: 500,
                        fontSize: "16px"
                      }}
                    >
                      {!!this.props.currConv.rate
                        ? `${getSymbol(this.props.currConv.currencySymbol) +
                            this.props.currConv.rate
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        : t("Editprofile._Free")}
                    </span>
                  </div>
                </div>
                <Link
                  to={{
                    pathname: `/products/${this.props.currConv.productId}/`
                  }}
                >
                  <div className="noresimgveiw">
                    <img src={this.props.currConv.image} />
                  </div>
                </Link>
              </div>
              <div
                class="dropdown overpg"
                style={{
                  position: "relative"
                }}
              >
                <div
                  onClick={this.handleOpen}
                  class=" dropdown-toggle aftercss"
                  data-toggle="dropdown"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="sc-VigVT fEbzNV"
                    fill="#757575"
                  >
                    <path d="M11.785 17.139c1.375 0 2.5 1.125 2.5 2.5s-1.125 2.5-2.5 2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5zm0-2.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5zm0-7.5a2.507 2.507 0 0 1-2.5-2.5c0-1.375 1.125-2.5 2.5-2.5s2.5 1.125 2.5 2.5-1.125 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div class="dropdown-menu chatbox">
                  <div
                    onClick={() =>
                      this.props.handleBlockModel(
                        this.props.currConv,
                        "WhileTaping"
                      )
                    }
                    ref={this.props.setRef}
                    className={classes.chatOperations}
                  >
                    <ul>
                      {/* onClick={e => this.handleBlock(e, currConv, true) */}
                      <li>
                        {!!this.props.currConv.isBlocked
                          ? t("Sellerdetails._UnBlockuser")
                          : t("Sellerdetails._Blockuser")}
                      </li>
                      {/* <Modal
                        isOpen={DeleteModelBlock}
                        contentLabel="Minimal Modal Example"
                        style={customStyles}
                      >
                        <section className="iHQQug">
                          {!this.props.currConv.isBlocked && (
                            <>
                              <div className="bwXZIf">
                                <header>
                                  {" "}
                                  <h1>{t("Sellerdetails._Blockuser")}</h1>
                                </header>
                              </div>
                              <article>
                                <span>{t("Sellerdetails._goingtoblock")}</span>
                              </article>
                              <div class="sav_chang cancee">
                                <button
                                  type="submit"
                                  onClick={e =>
                                    this.props.handleBlock(
                                      e,
                                      this.props.currConv,
                                      true,
                                      "blockUser"
                                    )
                                  }
                                  class="btn btn-danger btn-block"
                                >
                                  {t("Sellerdetails._Blockuser")}
                                </button>
                              </div>
                              <div class="sav_chang">
                                <button
                                  type="submit"
                                  onClick={this.props.handleCloseBlockModal}
                                  class="btn iDhWYa btn-block"
                                >
                                  {t("Productdetails._Cancel")}
                                </button>
                              </div>
                            </>
                          )}
                          {this.props.currConv.isBlocked && (
                            <>
                              {" "}
                              <div className="bwXZIf">
                                <header>
                                  {" "}
                                  <h1>{t("Sellerdetails._UnBlockuser")} </h1>
                                </header>
                              </div>
                              <article>
                                <span>
                                  {t("Sellerdetails._goingtounblock")}
                                </span>
                              </article>
                              <div class="sav_chang cancee">
                                <button
                                  type="submit"
                                  onClick={e =>
                                    this.props.handleBlock(
                                      e,
                                      this.props.currConv,
                                      true,
                                      "UnblockUser"
                                    )
                                  }
                                  class="btn btn-danger btn-block"
                                >
                                  {t("Sellerdetails._UnBlockuser")}
                                </button>
                              </div>
                              <div class="sav_chang">
                                <button
                                  type="submit"
                                  onClick={this.props.handleCloseBlockModal}
                                  class="btn iDhWYa btn-block"
                                >
                                  {t("Productdetails._Cancel")}
                                </button>
                              </div>{" "}
                            </>
                          )}
                        </section>
                      </Modal> */}
                      {/* <li style={{ marginTop: "20px" }}>Delete Chat</li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {this.props.currConv.isBlocked ? (
              <div
                className={
                  this.props.currConv.isBlocked ? "newpdd isblock" : "newpdd"
                }
              >
                <div className="gNaiKnBl">
                  <div className="cVYPhc">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="24"
                      class="sc-jTzLTM iUbtCy"
                      fill="red"
                    >
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                    </svg>
                    <span className="soldde">
                      {" "}
                      {t("Sellerdetails._blockedthisuser")}
                    </span>
                  </div>
                </div>
              </div>
            ) : this.props.currConv.blockedBy ? (
              <div
                className={
                  this.props.currConv.blockedBy ? "newpdd isblock" : "newpdd"
                }
              >
                <div className="gNaiKnBl">
                  <div className="cVYPhc">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="24"
                      class="sc-jTzLTM iUbtCy"
                      fill="red"
                    >
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                    </svg>
                    <span className="soldde">
                      {" "}
                      {t("Sellerdetails._blockedbyuser")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (this.props.currConv.sellingStatus === "SoldOut" ||
                this.props.currConv.sellingStatus === "Soldout") &&
              this.props.currConv.role === "seller" ? (
              <div className="newpdd">
                <div className="gNaiKn">
                  <div className="cVYPhc">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="24"
                      class="sc-jTzLTM iUbtCy"
                      fill="white"
                    >
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                    </svg>
                    <span className="soldde">
                      {" "}
                      {t("Sellerdetails._Productsold")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (this.props.currConv.sellingStatus === "Soldout" ||
                this.props.currConv.sellingStatus === "SoldOut") &&
              this.props.currConv.role === "buyer" ? (
              <div className="newpdd">
                <div className="gNaiKn">
                  <div className="cVYPhc">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="24"
                      class="sc-jTzLTM iUbtCy"
                      fill="white"
                    >
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                    </svg>
                    <span className="soldde">
                      {" "}
                      {t("Sellerdetails._listingbeensold")}{" "}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

  <div className={ (this.props.currConv.sellingStatus == "SoldOut" || this.props.currConv.sellingStatus == "Soldout") ||
              this.props.currConv.role == "seller"  && this.props.currConv.role == "buyer" === this.props.currConv.blockedBy || this.props.currConv.isBlocked ? classes.chatConversationBox + " " + "rtlchatboct sellhgt": classes.chatConversationBox + " " + "rtlchatboct"}>
              {getMessages != undefined &&
                getMessages.message.map(message => (
                  <div
                    className={
                      message.userId == this.state.currentUserpage
                        ? "senderpart"
                        : "receivepart"
                    }
                    key={`${message.id}-message`}
                  >
                    <div className="leftpart">
                      <div className={localStorage.getItem('lang') === 'ar' ? 'rtltranschat': 'nortltrans'}>{message.message}</div>
                      <span className="dateseen">
                        {findTimeStamp(message.createdAt, timestamp,t)}
                      </span>
                    </div>
                  </div>
                ))}
              <div
                style={{ float: "left", clear: "both" }}
                ref={el => {
                  this.messagesEnd = el;
                }}
              ></div>
            </div>
            <div className="chatinputsold">
              <div className={classes.customButton + " " + "customresponsive"}>
                {!this.props.currConv.isBlocked &&
                !this.props.currConv.blockedBy
                  ? customButtonKeys.map((cbk, index) => (
                      <div key={index}>
                        <button
                          className="grs"
                          onClick={e =>
                            this.handleSend(
                              e,
                              this.props.currConv,
                              t(cbk)
                            )
                          }
                        >
                          {t(cbk)}
                        </button>
                      </div>
                    ))
                  : ""}
              </div>

              <div className={classes.chatInput}>
                <div style={{ width: "90%" }}>
                  <input
                    type="text"
                    disabled={
                      !!this.props.currConv.isBlocked ||
                      !!this.props.currConv.blockedBy
                    }
                    value={this.state.chatText}
                    placeholder={t("Sellerdetails._Typemessage")}
                    onChange={(e) => this.handleInput(e)}
                    onKeyPress={e =>
                      this.handleKeyPress(
                        e,
                        this.props.currConv,
                        this.state.chatText
                      )
                    }
                  />
                </div>
                <div style={{ display: "flex" }} className="rtlissuesfx">
                  <input
                    type="file"
                    id="fileUploader"
                    hidden
                    onClick={this.props.handleSelect}
                    ref="fileUploader"
                  />
                  <button
                    id="plus"
                    style={{ margin: "0px", padding: "0 10px 0 40px" }}
                  />
                  <button
                    className="boredrradus"
                    style={{ marginLeft: "0px", paddingLeft: "0px" }}
                    onClick={e =>
                      this.handleSend(
                        e,
                        this.props.currConv,
                        this.state.chatText
                      )
                    }
                    disabled={
                      !!this.props.currConv.isBlocked ||
                      !!this.props.currConv.blockedBy
                    }
                  >
                    {t("Sellerdetails._Send")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

var ChatComp = compose(
  graphql(GET_ROSTER, { name: "rosters" }),
  graphql(SEND_MESSAGE, { name: "sendMessage" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(BLOCK_USER, { name: "blockUser" }),
  graphql(GET_CURRENT_USER, { name: "currentUser" }),
  graphql(GET_MESSAGES, {
    name: "getMessages",
    options: props => ({
      variables: { id: Number(props.rosterGroupId) },
      fetchPolicy: "network-only"
    })
  })
)(MessageRight);

export default withTranslation("common")(withStyles(styles)(ChatComp));
