import React from "react";
import { compose, graphql } from "react-apollo";
import {
  GET_ROSTER,
  INACTIVE,
  GET_OPEN_STATE,
  ISOPEN,
  BLOCK_USER,
  SEND_MESSAGE,
  ROSTER_GROUPID,
  GET_ROSTER_GROUPID_DETAILS,
  GET_CURRENT_USER,
  CHATLIST_SUBSCRIPTION,
  GET_MESSAGES
} from "../../../queries";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/chatStyle.jsx";
import { getRoster } from "../../../helper.js";
import MessageList from "./MessageList.jsx";
import Modal from "react-modal";
import prgd2 from "../../../assets/img/prgd2.png";
import * as Toastr from "../Toast.jsx";
import { withTranslation } from "react-i18next";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    padding: "25px"
  }
};

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeClick: "All",
      currConv: {},
      messages: [],
      chatText: "",
      isOpen: false,
      rosterGroupId: "",
      initialload: true,
      DeleteModelBlock: false,
      clickWithbutton: false,
      responsivemode: true,
      rightresponse: true,
      autoOpen: "",
      ChangeInRoaster: Math.floor(Math.random() * 10000),
      preventEnter: true,
      msgDiv: false,
      unRead: true,
      subscriberNewMsgs: false
    };

    this.gobackHandler = this.gobackHandler.bind(this);
    this.getConversation = this.getConversation.bind(this);
    //this.handleInput = this.handleInput.bind(this);
    //this.handleSend = this.handleSend.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    //this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCloseBlockModal = this.handleCloseBlockModal.bind(this);
    this.resizeFunction = this.resizeFunction.bind(this);
  }

  resizeFunction() {
    if (window.innerWidth < 991 && this.state.initialload === false) {
      this.setState({ responsivemode: false });
    } else if (window.innerWidth > 991 && this.state.initialload === false) {
      this.setState({ responsivemode: true });
    } else {
      this.setState({ responsivemode: true });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeFunction);
  }

  handleSelect() {
    this.refs.fileUploader.click();
  }

  handleClick = () => {
    this.setState({ responsivemode: true, initialload: true });
  };

  componentWillMount() {
    let { currentUser } = this.props
    if (!currentUser.getCurrentUser) currentUser.refetch();
    this.setState({
      cUser: currentUser.getCurrentUser && currentUser.getCurrentUser.id
    });
     let currentUserData = currentUser.getCurrentUser && currentUser.getCurrentUser.id
     this.unsubscribe = this.subscribe(Number(currentUserData), "All");
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      if (this.state.autoOpen && this.state.autoOpen.length > 0 && this.state.preventEnter && (nextProps.getCacheRosterId.rosterGroupId !== undefined )) {
        if(nextProps.rosters && nextProps.rosters.getRoster && nextProps.rosters.getRoster.filter(rosterInfo => rosterInfo.groupId === nextProps.getCacheRosterId.rosterGroupId)){
          const get = nextProps.rosters && nextProps.rosters.getRoster && nextProps.rosters.getRoster.filter(rosterInfo => rosterInfo.groupId === nextProps.getCacheRosterId.rosterGroupId);
            this.props.getRosterGroupId({
              variables: { rosterGroupId: this.state.autoOpen }
            });
            this.setState({ 
              initialload: false, 
              currConv: get && get[0],
              preventEnter: false, 
              rosterGroupId: this.state.autoOpen, 
              msgDiv: true 
            });
        }
      }
    }
     
    if(nextState.rosterGroupId != this.state.rosterGroupId){
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(Number(this.state.cUser),"All");
    }
 
  }

  componentWillReceiveProps(nxt) {
    let {rosters} = nxt;
    if(nxt.getCacheRosterId.rosterGroupId !== undefined){
      this.setState({ 
        autoOpen: nxt.getCacheRosterId.rosterGroupId, 
        rosterGroupId: nxt.getCacheRosterId.rosterGroupId 
      });
    }
   
    // if(nxt.getCacheRosterId.rosterGroupId != this.props.getCacheRosterId.rosterGroupId){
    //   console.log("inside chat")
    //   if (this.unsubscribe) {
    //     this.unsubscribe();
    //   }
    //   this.unsubscribe = this.subscribe(Number(this.state.cUser),"");
    // }
    if(nxt != this.props){
        rosters.refetch({type: "All"})
    }
   
  }


  subscribe = (userId,type) =>  
      this.props.rosters.subscribeToMore({
        document: CHATLIST_SUBSCRIPTION,
        variables: { userId:userId,type:type },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;
          let rosterData = subscriptionData.data.newrosterAdded
          return {
              getRoster: [
                ...rosterData
              ]
          };
          
        }
  });

  componentWillUnmount() {
    this.props.getRosterGroupId({
      variables: { rosterGroupId: "" }
    });
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }

  handleOpen() {
    this.props.isOpenScreen({ variables: { open: true } });
  }

  selectFile() { }
  handleBlock(e, cc, flag, type) {
    e.persist();
    let { currentUser, isOpenScreen, rosters } = this.props;

    if (currentUser && currentUser.id !== cc.userId) {
      this.props
        .blockUser({
          variables: { id: Number(cc.userId) },
         // refetchQueries: [{ query: GET_ROSTER, variables: { type: "All" } }]
        })
        .then(({ data }) => {
          if (window.innerWidth < 991 && this.state.initialload === false) {
            this.setState({ initialload: false });
          } else {
            this.changeTab(e, "All");
          }
          if (flag) {
            if (data.blockUser.status)
              cc.isBlocked = data.blockUser.status === "blocked";
            this.setState({ currConv: cc });
            isOpenScreen({ variables: { open: false } });
            this.setState({
              DeleteModelBlock: false,
              clickWithbutton: false
            });
            if (this.state.clickWithbutton === true) {
              this.setState({
                initialload: true
              });
            } else {
              this.setState({
                initialload: false
              });
            }
            this.setState({
              clickWithbutton: false
            });
          }
        });
    }
  }

  gobackHandler(e) {
    e.preventDefault();
    this.props.history.goBack();
  }
  getConversation = async (e, currConv) => {
    e.preventDefault();
    let { currentUser } = this.props;
    currentUser.refetch();
    this.setState({
      unRead: currentUser.unreadMessage,
      msgDiv: true
    });
    await this.setState({
      unRead: false
    });
    await this.props.getRosterGroupId({
      variables: { rosterGroupId: currConv.groupId }
    });

    await this.setState({
      rosterGroupId: currConv.groupId,
      initialload: false
    });
    await this.setState({
      ChangeInRoaster: Math.floor(Math.random() * 10000)
    });

    if (window.innerWidth < 991 && this.state.initialload === false) {
      this.setState({ responsivemode: false });
    } else {
      this.setState({ responsivemode: true });
    }
  };

  // handleInput(e) {
  //   e.preventDefault();
  //   this.setState({
  //     chatText: e.target.value
  //   });
  // }

  chatWithUser = async userData => {
    await this.setState({
      currConv: userData
    });
  };


  changeTab = (e, buttonVal) => {
    e.preventDefault();
    this.setState({ preventEnter: false });
    let { rosters } = this.props;
    rosters
      .refetch({ type: "All" })
      .then(({ data, errors }) => {
        if (data && !errors) {
          if (data.getRoster) return getRoster(data.getRoster);
        }
      })
      .then(data => {
        this.setState({
          //typeClick: buttonVal,
          initialload: true
        });
      });
  };

  handleBlockModel = async (userData, type) => {
    if (type === "InButton") {
      this.setState({
        clickWithbutton: true
      });
    }
    this.setState({
      initialload: false,
      DeleteModelBlock: true
    });
  };

  handleCloseBlockModal = () => {
    this.setState({ ...this.state.DeleteModelBlock }, () => {
      this.setState({
        DeleteModelBlock: false,
        clickWithbutton: false
      });
    });
  };

  render() {
    let { typeClick, currConv, DeleteModelBlock } = this.state;

    let {
      rosters: { loading, getRoster, startPolling },
      classes,
      t
    } = this.props;
  
  
    return (
      <div className={classes.chatSpace + " " + "chatmgn"}>
        <div className={classes.chatBorder + " " + "chatreswrapper"}>
          {this.state.responsivemode ? (
            <div className={classes.chatRoster + " " + "reschatview"}>
              <div className="chatsmallscreen">
                <div className={classes.chatBox + "  " + "chatvw"}>
                  <div className={classes.chatArrow}>
                    <nav className={classes + " " + classes}>
                      <div
                        onClick={this.gobackHandler}
                        style={{ cursor: "pointer" }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="sc-VigVT fVWeqY"
                        >
                          <path d="M7.513 13.353l3.73 3.863a1.403 1.403 0 0 1-2.016 1.948l-6.082-6.298a1.39 1.39 0 0 1-.393-.998c.006-.359.149-.715.428-.985l6.298-6.082a1.402 1.402 0 0 1 1.948 2.017L7.562 10.55l12.309.215a1.402 1.402 0 1 1-.048 2.804l-12.31-.215z" />
                        </svg>
                      </div>
                    </nav>
                  </div>
                  <div className={classes.chatName + " " + "rtlarrowchat"}>
                    <span>{t("Sellerdetails._chats")}</span>
                  </div>
                  {/* <div>
                <img
                  className={classes.chatProfile}
                  src={ambassador}
                />
              </div> */}
                </div>
                <div className="chatjht">
                  {/* <div className="chatSp">
                    {["All", "Selling", "Buying", "Blocked"].map(
                      (button, index) => {
                        var bStyle =
                          typeClick === button
                            ? classes.buttonBottomRed
                            : classes.buttonBottomWhite;
                        return (
                          <button
                            key={index}
                            className={classes.chatButton + " " + bStyle}
                            onClick={e => this.changeTab(e, button)}
                          >
                            {button === "All"
                              ? this.props.t("Productdetails._All")
                              : button === "Selling"
                                ? this.props.t("Productdetails._Selling")
                                : button === "Buying"
                                  ? this.props.t("Productdetails._Buying")
                                  : this.props.t("Productdetails._Blocked")}
                          </button>
                        );
                      }
                    )}
                  </div> */}
                </div>
              </div>
              <nav className={classes.chatNav}>
                <div className="respchar">
                  {getRoster != undefined &&
                    getRoster.map((rf, i) => {
                      if (typeClick !== "Blocked" && !!rf.image) {
                        return (
                          <div
                            onClick={() => this.chatWithUser(rf)}
                            className={
                              currConv.groupId === rf.groupId
                                ? " testactivechat"
                                : ""
                            }
                          >
                            <div
                              onClick={e => this.getConversation(e, rf)}
                              className={
                                classes.chatSpec + " " + "rtlechatuimg"
                              }
                              key={i}
                            >
                              <div className="trlaonlyadd">
                               
                                <img src={rf.image} />

                                <div
                                  className={
                                    classes.chatText + " " + "productvwtrl"
                                  }
                                >
                                  <div>
                                    <span
                                      className="testclg"
                                      style={{ fontSize: "16px" }}
                                    >
                                      {rf.userName}
                                    </span>

                                    <div>
                                      <span
                                        className="testclg1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {rf.productName}
                                      </span>
                                    </div>

                                    { <div className="urgent1_new">
                                       {rf.role === "buyer" ?  <div className="buying_color"> {t("Productdetails._Buying")} </div> : 
                                      rf.role === "seller" ?  <div className = "selling_color"> {t("Productdetails._Selling")}  </div> : "" }
                                  </div> }

                                    <div className="unblock_sect">
                                      <span
                                        className="testclg2"
                                        style={{ fontSize: "12px" }}
                                      >
                                        {!!rf.isBlocked ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="18"
                                              height="24"
                                              fill="#FF3F55"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t(
                                                "Sellerdetails._blockedthisuser"
                                              )}
                                            </span>
                                          </div>
                                        ) : !!rf.blockedBy ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="18"
                                              height="24"
                                              fill="#FF3F55"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t(
                                                "Sellerdetails._blockedbyuser"
                                              )}
                                            </span>
                                          </div>
                                        ) : !!rf.sellingStatus ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="16"
                                              height="24"
                                              class="sc-VigVT eRlXQh"
                                              fill="#00A8A8"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t("Sellerdetails._Sold")}
                                            </span>
                                          </div>
                                        ) : (
                                                <h6>{rf.lastseen}</h6>
                                              )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="pos_rel">
                              { (rf.unreadMessage > 0 ) ? 
                                  <div className="notification">
                                    {rf.unreadMessage}
                                  </div> : ""
                              } 
                                <img
                                  src={rf.profileImage}
                                  style={{ borderRadius: "50%" }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      } else if (!!rf.image) {
                        return (
                          <div
                            onClick={() => this.chatWithUser(rf)}
                            className={
                              currConv.groupId === rf.groupId
                                ? " testactivechat"
                                : ""
                            }
                          >
                            <div
                              onClick={e => this.getConversation(e, rf)}
                              className={
                                classes.chatSpec + " " + "rtlechatuimg"
                              }
                              key={i}
                            >
                              <div className="trlaonlyadd">
                                <img src={rf.image} />

                                <div
                                  className={
                                    classes.chatText + " " + "productvwtrl"
                                  }
                                >
                                  <div>
                                    <span
                                      className="testclg"
                                      style={{ fontSize: "16px" }}
                                    >
                                      {rf.userName}
                                    </span>

                                    <div>
                                      <span
                                        className="testclg1"
                                        style={{ fontSize: "14px" }}
                                      >
                                        {rf.productName}
                                      </span>
                                    </div>
                                    <div>
                                      <span
                                        className="testclg2"
                                        style={{ fontSize: "12px" }}
                                      >
                                        {!!rf.isBlocked ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="18"
                                              height="24"
                                              fill="#FF3F55"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t(
                                                "Sellerdetails._blockedthisuser"
                                              )}
                                            </span>
                                          </div>
                                        ) : !!rf.blockedBy ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="18"
                                              height="24"
                                              fill="#FF3F55"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t(
                                                "Sellerdetails._blockedbyuser"
                                              )}
                                            </span>
                                          </div>
                                        ) : !!rf.sellingStatus ? (
                                          <div
                                            style={{ display: "inline-flex" }}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              width="16"
                                              height="24"
                                              class="sc-VigVT eRlXQh"
                                              fill="#00A8A8"
                                            >
                                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-9.143V7.143C13 6.512 12.552 6 12 6s-1 .512-1 1.143v5.714c0 .631.448 1.143 1 1.143s1-.512 1-1.143zM13 16a.999.999 0 0 0-1-.999A.999.999 0 1 0 12 17a1 1 0 0 0 1-1z" />
                                            </svg>
                                            <span style={{ paddingTop: "5px" }}>
                                              {t("Sellerdetails._Sold")}
                                            </span>
                                          </div>
                                        ) : (
                                                <h6>{rf.lastseen}</h6>
                                              )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>

                <div className="adminadd">
                  <img src={prgd2} className="img-fluid" />
                </div>
              </nav>
            </div>
          ) : (
              ""
            )}

          <Modal
            isOpen={DeleteModelBlock}
            contentLabel="Minimal Modal Example"
            style={customStyles}
          >
            <section className="iHQQug">
              {!currConv.isBlocked && (
                <>
                  <div className="bwXZIf">
                    <header>
                      {" "}
                      <h1>{t("Sellerdetails._Blockuser")} </h1>
                    </header>
                  </div>
                  <article>
                    <span>{t("Sellerdetails._goingtoblock")} </span>
                  </article>
                  <div class="sav_chang cancee">
                    <button
                      type="submit"
                      onClick={e =>
                        this.handleBlock(e, currConv, true, "blockUser")
                      }
                      class="btn btn-danger btn-block"
                    >
                      {t("Sellerdetails._Blockuser")}
                    </button>
                  </div>
                  <div class="sav_chang">
                    <button
                      type="submit"
                      onClick={this.handleCloseBlockModal}
                      class="btn iDhWYa btn-block"
                    >
                      {t("Productdetails._Cancel")}
                    </button>
                  </div>
                </>
              )}
              {currConv.isBlocked && (
                <>
                  {" "}
                  <div className="bwXZIf">
                    <header>
                      {" "}
                      <h1>{t("Sellerdetails._UnBlockuser")} </h1>
                    </header>
                  </div>
                  <article>
                    <span>{t("Sellerdetails._goingtounblock")}</span>
                  </article>
                  <div class="sav_chang cancee">
                    <button
                      type="submit"
                      onClick={e =>
                        this.handleBlock(e, currConv, true, "UnblockUser")
                      }
                      class="btn btn-danger btn-block"
                    >
                      {t("Sellerdetails._UnBlockuser")}
                    </button>
                  </div>
                  <div class="sav_chang">
                    <button
                      type="submit"
                      onClick={this.handleCloseBlockModal}
                      class="btn iDhWYa btn-block"
                    >
                      {t("Productdetails._Cancel")}
                    </button>
                  </div>{" "}
                </>
              )}
            </section>
          </Modal>

          {this.state.msgDiv ? (
            <MessageList
              getConversation={this.getConversation}
              handleBlock={this.handleBlock}
              handleCloseBlockModal={this.handleCloseBlockModal}
              handleClick={this.handleClick}
              handleBlockModel={this.handleBlockModel}
              currConv={this.state.currConv}
              initialload={this.state.initialload}
              rosterGroupId={this.state.rosterGroupId}
              handleSelect={this.handleSelect}
              DeleteModelBlock={this.state.DeleteModelBlock}
              //handleSend={this.handleSend}
              //chatText={this.state.chatText}
              //handleInput={this.handleInput}
              //handleKeyPress={this.handleKeyPress}
            />
          ) : "" 
          }
        </div>
      </div>
    );
  }
}

var ChatComp = compose(
  graphql(GET_ROSTER, {
    name: "rosters",
    options: props => ({
      variables: { type:"All" },
      fetchPolicy: "network-only"
    })
  }),
  graphql(INACTIVE, { name: "inActiveScreen" }),
  graphql(ISOPEN, { name: "isOpenScreen" }),
  graphql(BLOCK_USER, { name: "blockUser" }),
  graphql(SEND_MESSAGE, { name: "sendMessage" }),
  graphql(ROSTER_GROUPID, {
    name: "getRosterGroupId",
    options: () => ({
      fetchPolicy: "no-cache"
    })
  }),
  graphql(GET_ROSTER_GROUPID_DETAILS, {
    name: "getCacheRosterId",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_OPEN_STATE, {
    name: "getCacheData",
    options: () => ({
      fetchPolicy: "cache-only"
    })
  }),
  graphql(GET_CURRENT_USER, {
    name: "currentUser"
  }),
)(ChatComponent);

export default withTranslation("common")(withStyles(styles)(ChatComp));