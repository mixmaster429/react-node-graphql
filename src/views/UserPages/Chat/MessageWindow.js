import React, { Component } from "react";
import styles from "../../../assets/jss/material-dashboard-pro-react/components/chatStyle";
import { withTranslation, Trans } from "react-i18next";
import withStyles from "@material-ui/core/styles/withStyles";
import { compose, graphql, Query, Subscription } from "react-apollo";
import * as Toastr from "../Toast.jsx";
import Modal from "react-modal";
import {
    GET_ROSTER,
    ISOPEN,
    BLOCK_USER,
    GET_CURRENT_USER,
    SUBSCRIPTIONS,
    GET_MESSAGES,
    SEND_MESSAGE
} from "../../../queries";
import { dateAdd } from "../../../helper.js";

const findTimeStamp = (d, t, lang) => {
    return dateAdd(d, t, lang);
};


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

class MessageWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            toggleShow:[true,true],
            newArray: [],
            newObj: {},
            currentBlockedUser: {},
            subscribedArray: [],
            subscribedToNewLinks:true,
            unSubId: ""
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    


    toggleMenu = (num) => {
        this.setState((prevState) => {
            const newItems = [...prevState.toggleShow];
            newItems[num] = !newItems[num];
            return {toggleShow: newItems};
        });
    }


    handleKeyPress = (e, currConv, chatObj) => {
        if (e.key === "Enter") {
          this.handleSend(e, currConv, chatObj);
        }
    };

    openChat = (i,groupName) => {
        this.props.openCloseChat(i,groupName)
    }

    handleSend(e, cc, newObj) {
        e.preventDefault();
        var roomId = cc.groupId;
        if (newObj[cc.groupId] && newObj[cc.groupId].trim() !== "") {
            var variables = {
                message: newObj[cc.groupId],
                room: Number(roomId)
            };
            this.props
                .sendMessage({
                    variables: variables,
                    refetchQueries: [
                        { query: GET_MESSAGES, variables: { id: Number(roomId) } }
                    ]
                })
                .then(async ({ data }) => {
                    if (data) {
                        //console.log("data",this.props)
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
            this.setState({ newObj: {} });
        }
    }


    handleInput = (e) => {
        e.preventDefault();
        const { id, value } = e.target;
        //let {currConv} = this.props;
        let { newArray, newObj } = this.state;
        const targetIndex = newArray.filter(x => x.groupId == id).map(datum => {
            return datum.groupId == id;
        });
        if (targetIndex !== -1) {
            newObj[id] = value
            this.setState({ newObj });
        }
    }

    componentDidMount() {
        this.scrollToBottom();
        let { currentUser } = this.props;
        this.setState({
            currentUser: currentUser.getCurrentUser && currentUser.getCurrentUser,
            currentUserpage: currentUser.getCurrentUser && currentUser.getCurrentUser.id
        });
    }

    scrollToBottom = () => {
        if(this.props.currConv.length > 0){
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
      };
    
    componentDidUpdate(prevProps,prevState){
      // if(this.props.currConv.length > 0 && (this.props.currConv != prevProps.currConv)){
            this.scrollToBottom();
       // }
    }   

    componentWillMount(){
        this.unsubscribe = this.subscribe(this.props.rosterGroupId);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.rosterGroupId !== this.props.rosterGroupId) {
            this.props.client.query({
                query: GET_ROSTER,
                variables: { type: "All" }
                })
                .then(({ data, loading, error }) => {
                if (data) {
                    //console.log(data)
                }
                });
            if (this.unsubscribe) {
              this.unsubscribe();
            }
            this.unsubscribe = this.subscribe(newProps.rosterGroupId);
          }
          if(newProps.currConv != this.props.currConv ){
           let newId =  newProps.currConv.filter(x => x.groupId != newProps.rosterGroupId).map(z => {
                return z.groupId
            })       
             if(newId[0] !== newProps.rosterGroupId){
                 this.setState({
                     unSubId : newId[0],
                     subscribedToNewLinks: false
                 })
             }
          }
    }

   
    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    subscribe = channelId =>
        this.props.getMessages.subscribeToMore({
            document: SUBSCRIPTIONS,
            variables: { chatroomId: Number(channelId) },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                return ({
                    getMessages: {
                        message: [
                            ...prev.getMessages.message,
                            subscriptionData.data.messageAdded
                        ],
                        __typename: prev.getMessages.__typename,
                    }
                })
            }
        });



    _subscribeToNewLinks = (subscribeToMore,groupId) => {
        subscribeToMore({
            document: SUBSCRIPTIONS,
            variables: { chatroomId: Number(groupId) },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                return ({
                    getMessages: {
                        message: [
                            ...prev.getMessages.message,
                            subscriptionData.data.messageAdded
                        ],
                        __typename: prev.getMessages.__typename,
                    }
                })
            }
        });
        
        this.setState({subscribedToNewLinks:true})
    }


    handleBlockModel = (x) => {
        this.setState({
            currentBlockedUser: x,
            DeleteModelBlock: true
        });
    };

    handleBlock(e, cc, flag, type) {
        e.persist();
        let { isOpenScreen } = this.props;
        let { currentUser } = this.state;

        if (currentUser && currentUser.id !== cc.userId) {
            this.props
                .blockUser({
                    variables: { id: Number(cc.userId) },
                    refetchQueries: [{ query: GET_ROSTER, variables: { type: "All" } }]
                })
                .then(({ data }) => {
                    if (flag) {
                        if (data.blockUser.status)
                            cc.isBlocked = data.blockUser.status === "blocked";
                        isOpenScreen({ variables: { open: false } });
                        this.setState({ DeleteModelBlock: false });
                    }
                });
        }
    }


    handleCloseBlockModal = () => {
        this.setState({ ...this.state.DeleteModelBlock }, () => {
            this.setState({
                DeleteModelBlock: false
                //clickWithbutton: false
            });
        });
    };

    render() {
        const timestamp = Date.now();
        let { classes, t, currConv } = this.props;
        let { newArray, currentBlockedUser } = this.state;
        return (
            <div className="chatNow chatmsg_new">
                {
                    currConv && currConv.length > 0 && currConv.map((x, index) => (
                        <div id={index} className={`chatboxheader${index}`}>
                            <div className="chatboxtitle">
                                <div className="chatleft">
                                 <img src={x.profileImage} />
                                    <div className="chatleft img1">
                                       
                                        <h6> {x.userName} </h6>
                                        <span className="prduchnme">{x.productName}</span>
                                    </div>
                                </div>
                                <div className="chatright">
                                    <ul>
                                        <li class="dropdown">
                                            <span data-toggle="dropdown">  <i class="fa fa-ellipsis-v" aria-hidden="true"></i> </span>
                                            <ul class="dropdown-menu">
                                                <li onClick={() => this.handleBlockModel(x)}>
                                                    {!!x.isBlocked ? t("Sellerdetails._UnBlockuser")
                                                        : t("Sellerdetails._Blockuser")}</li>
                                            </ul>
                                        </li>
                                        {/*  onClick={() =>this.toggleMenu1(index)} */}
                                        {/* <li  onClick={() =>this.toggleMenu(index)}>  <span> <i class="fa fa-minus" aria-hidden="true"></i> </span> </li> */}
                                        <li onClick={() => this.openChat(index,x.groupName)}> <span> <i class="fa fa-times" aria-hidden="true"></i> </span> </li>
                                    </ul>
                                </div>
                            </div>


                            {this.state.toggleShow[index] && <>
                                <div className="chatconver">
                                    {x.isBlocked ? (
                                        <div
                                            className={
                                                x.isBlocked ? "newpdd isblock" : "newpdd"
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
                                    ) : x.blockedBy ? (
                                        <div
                                            className={
                                                x.blockedBy ? "newpdd isblock" : "newpdd"
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
                                    ) : (x.sellingStatus === "SoldOut" ||
                                        x.sellingStatus === "Soldout") &&
                                        x.role === "seller" ? (
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
                                                ) : (x.sellingStatus === "Soldout" ||
                                                    x.sellingStatus === "SoldOut") &&
                                                    x.role === "buyer" ? (
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
                               <div className={(x.sellingStatus == "SoldOut" || x.sellingStatus == "Soldout") || x.role == "seller" && x.role == "buyer" === x.blockedBy || x.isBlocked ? classes.chatConversationBox + " " + "rtlchatboct sellhgt omni_chat" : classes.chatConversationBox + " " + "rtlchatboct omni_chat"}>
                               <Query query={GET_MESSAGES} variables={{ id: Number(x.groupId) }}>
                                            {({ data, loading, error, subscribeToMore }) => {
                                                 if(!this.state.subscribedToNewLinks &&
                                                    ((this.state.unSubId !== undefined && this.state.unSubId != "" && this.state.unSubId == x.groupId) && x.groupId !== this.props.rosterGroupId)){
                                                    this._subscribeToNewLinks(subscribeToMore,x.groupId)
                                                }

                                                if (loading) {
                                                    return <div>loading</div>;
                                                }
                                                if (error) {
                                                    return <div>error</div>;
                                                }
                                                if (data && data.getMessages && data.getMessages.message) {
                                                    return <>
                                                        {data.getMessages.message.map((z) => (
                                                            <div
                                                                className={
                                                                    z.userId == this.state.currentUserpage
                                                                        ? "senderpart"
                                                                        : "receivepart"
                                                                }
                                                                key={`${z.id}-message`}
                                                            >
                                                                <div className="leftpart">
                                                                    <div className={localStorage.getItem('lang') === 'ar' ? 'rtltranschat' : 'nortltrans'}>{z.message}</div>
                                                                    <span className="dateseen">
                                                                        {findTimeStamp(z.createdAt, timestamp, t)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </>
                                                }
                                            }}

                                        </Query>
                                        <div style={{ float: "left", clear: "both" }}  ref={el =>{this.messagesEnd = el; }}
                                        ></div>
                                     </div>
                                     </div>

                                <div className={classes.chatInput}>
                                    <div key={index} style={{ width: "90%" }}>
                                        <input
                                            type="text"
                                            id={x.groupId}
                                            value={this.state.newObj[x.groupId] || ""}
                                            placeholder={t("Sellerdetails._Typemessage")}
                                            onChange={(e) => this.handleInput(e)}
                                            onKeyPress={e =>
                                                this.handleKeyPress(
                                                  e,
                                                  x,
                                                  this.state.newObj
                                                )
                                              }
                                        />
                                    </div>
                                    <div style={{ display: "flex" }} className="rtlissuesfx">
                                        <button className="boredrradus"
                                            style={{ marginLeft: "0px", paddingLeft: "0px" }}
                                            onClick={e =>
                                                this.handleSend(e, x, this.state.newObj)
                                            }
                                        >
                                            {t("Sellerdetails._Send")}
                                        </button>
                                    </div>
                                </div>
                            </>
                            }
                            <Modal
                                isOpen={this.state.DeleteModelBlock}
                                contentLabel="Minimal Modal Example"
                                style={customStyles}
                            >
                                <section className="iHQQug">
                                    {!currentBlockedUser.isBlocked && (
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
                                                        this.handleBlock(e, currentBlockedUser, true, "blockUser")
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
                                    {currentBlockedUser.isBlocked && (
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
                                                        this.handleBlock(e, currentBlockedUser, true, "UnblockUser")
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
                        </div>
                    ))
                }
            </div>
        )
    }
}

var ChatComp = compose(
    graphql(GET_ROSTER, { name: "rosters" }),
    graphql(SEND_MESSAGE, { name: "sendMessage" }),
    graphql(ISOPEN, { name: "isOpenScreen" }),
    graphql(BLOCK_USER, { name: "blockUser" }),
    graphql(GET_MESSAGES, {
        name: "getMessages",
        options: props => ({
          variables: { id: Number(props.rosterGroupId) },
          fetchPolicy: "network-only"
        })
      })
)(MessageWindow);

export default withTranslation("common")(withStyles(styles)(ChatComp));