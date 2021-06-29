const chatStyle = {
    chatSpace: {
        "marginTop" : "90px"
    },
    chatConv: {
        width: "70%",
        "fontFamily":"Roboto, Helvetica, Arial, sans-serif",
        "& img": {
            width: "50px",
            height: "50px",
            borderRadius: "10px"
        }
    },
    chatConvBox: {
        display: "inline-flex",
        alignItems: "center",
        borderBottom: "1px solid rgb(238, 238, 238)",
        width: "100%",
        height:"63px",
      
        "& div": {
            padding: "0px 10px",
            padding: "0px 10px"
        }
    },
    chatBox: {
        padding: "10px 0",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgb(238, 238, 238)",
        paddingBottom: "25px",
        "& div": {
            padding: "0px 10px",
            padding: "0px 10px"
        }
    },
    chatRoster: {
        width: "30%",
        borderRight: "1px solid rgb(221, 221, 221)",
    },
    chatBorder: {
        "zIndex":"1",
        "boxSizing":"border-box",
        "borderWidth":"1px",
        "borderStyle":"solid",
        "borderColor":"rgb(221, 221, 221)",
        "width":"1199px",
        "height":"75vh",
        "margin":"0px auto",
        "borderRadius":"16px",
        display: "flex"
    },
    chatArrow: {
    },
    chatName: {
        fontWeight: "normal !important",
        fontSize: "18px !important",
        flex: "1 1 0%"
    },
    chatProfile: {
        borderRadius: "50%",
        width: "40px",
        height: "40px"
    },
    chatButton: {
        "cursor":"pointer",
        width: "25%;",
        "borderTopWidth":"initial",
        "borderRightWidth":"initial",
        "borderLeftWidth":"initial",
        "borderTopColor":"initial",
        "borderRightColor":"initial",
        "borderLeftColor":"initial",
        "paddingBottom":"20px",
        "fontSize":"16px",
        "borderBottomColor":"white",
        "borderBottomWidth":"3px",
        "background":"none",
        "borderStyle":"none none solid",
        "borderImage":"initial",
        "borderRadius":"0px",
        "outline":"none",
        "fontSize":"12px",
        "WebkitBoxAlign":"center",
        "alignItems":"center",
        "WebkitBoxPack":"center",
        "justifyContent":"center",
        "height":"48px",
        "paddingBottom":"0px",
        "fontFamily":"Roboto",
        "fontWeight":"500",
     },
     buttonBottomRed: {
        color: "rgb(255, 63, 85) !important",
        borderBottomColor: "rgb(255, 63, 85)"
     },
     buttonBottomWhite: {
        color: "Black",
        borderBottomColor: "White"
     },
     chatNav: {
         height: "calc(100% - 126px)",
         overflowY: "scroll"
     },
     chatSpec: {
         padding: "10px",
         cursor: "pointer",
         display: 'flex',
         "fontFamily":"Roboto, Helvetica, Arial, sans-serif",
         "& img": {
             width: "40px",
             height: "40px",
             borderRadius: "10px"
         }
     },
     buttonUb: {
        color: 'white',
        cursor: 'pointer',
        borderWidth: 'initial',
        borderStyle: 'none',
        borderColor: 'initial',
        borderImage: 'initial',
        background: 'rgb(0, 154, 171)',
        margin: '0px',
        padding: '10px 12px',
        borderRadius: '30px'
     },
     BlockList: {
        //padding:"15px 0 0 10px",
        paddingLeft:"10px",
        flex: "0 0 80%"
     },
     chatText: {
         paddingLeft:"10px",
         flex: "0 0 70%"
     },
     chatConversation: {
        paddingLeft:"10px",
        textAlign: "right"
    },
    chatConversationBox: {
        "boxSizing":"border-box",
        "backgroundColor":"white",
        "overflowY":"scroll",
        "position":"relative",
        "overscrollBehaviorY":"contain",
        "display":"flex",
        "flexDirection":"column",
        "flex":"1 1 0%",
        "height": "calc(100% - 172px)",
        "padding":"15px"
     },
     chatMessage: {
         padding: "0 8px"
     },
     chatContainer: {
        "maxWidth":"500px",
        "minHeight":"55px",
        "marginTop":"2px",
        "padding":"8px 12px",
        borderRadius: "2px"
     },
     floatRight: {
         float: 'right',
         borderRadius: "16px 0 0 16px",
         background: "rgb(255, 223, 228)"
     },
     chatInput: {
         borderTop: "1px solid rgb(221, 221, 221)",
         width: "100%",
         display: "inline-flex",
       
         '& input': {
             "width": "100%",
            "color":"rgb(117, 117, 117)",
            "fontSize":"14px",
            "padding":"12px",
            // margin: "20px",
            "background":"rgb(244, 244, 244)",
            "borderRadius":"8px",
             outline: 'none',
            "borderStyle":"none",
         },
         '& button': {
            "fontSize":"14px",
           // "padding":"12px",
           //  margin: "20px",
             "color":"rgb(255, 63, 85)",
            "borderStyle":"none",
            outline: 'none',
            backgroundColor: 'white',
            fontSize: "18px",
            fontWeight: "500",
            cursor: 'pointer'
         }
     },
     alignChatInput: {
         display: 'flex',
         '& button': {
            "color":"white",
            "fontSize":"12px",
            "marginRight":"8px",
            "textAlign":"center",
            "cursor":"pointer",
            "borderRadius":"500em",
            "background":"rgb(255, 63, 85)",
            "padding":"2px 12px",
            "borderStyle":"none",
            outline: "none"
         }
     },
     customButton:{
         margin: "14px",
         display: "inline-flex",
         '& div': {
             paddingRight: "5px",
         },
         "& button": {
            "color":"white",
            "fontSize":"12px",
            "marginRight":"8px",
            "textAlign":"center",
            "cursor":"pointer",
            "borderRadius":"500em",
            "background":"rgb(255, 63, 85)",
            "padding":"2px 12px",
            "borderStyle":"none",
            outline: "none"
         }
     },
     chatOperations: {
        "right":"0px",
        "cursor":"pointer",
       // "left":"1000px",
        
        "position":"absolute",
        "minWidth":"225px",
        "zIndex":"99",
paddingTop:"10px !important",
        "backgroundColor":"white",
        "boxShadow":"rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.2) 0px 3px 8px 0px",
        "borderRadius":"10px",
        '& ul': {
            padding: '4px 0px',
            listStyle: 'none',
            fontSize: '16px'
         }
     },
 }
 export default chatStyle;
