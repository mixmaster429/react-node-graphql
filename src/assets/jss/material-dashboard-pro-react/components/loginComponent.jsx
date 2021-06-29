const loginStyle = {
    popupInner: {
        position: "absolute",
        left: "25%",
        right: "25%",
        top: "25%",
        bottom: "25%",
        margin: "auto",
        background: "white",
        borderRadius:"8px",
        height: "640px",
        width: "50%",
        display: "inline-flex"
      },
    popUp: {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        zIndex: "1050",
        left: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        backgroundColor: "rgba(0,0,0, 0.5)"
    },
    socialLogin: {
        "& li": {
            display: "block",
            WebkitBoxAlign: "center",
            MsFlexAlign: "center",
            alignItems: "center",
            WebkitBoxPack: "center",
            MsFlexPack: "center",
            justifyContent: "center",
            borderRadius: "30px"
        },
        "& li img": {
            display: "inline-block",
            WebkitBoxFlex: 0,
            MsFlex: "0 0 auto",
            flex: "0 0 auto",
            width: "30px",
            height: "30px"
        },
        "& li a": {
            colour: "#fff",
            display: "-webkit-box",
            display: "-ms-flexbox",
            display: "flex",
            WebkitBoxAlign: "center",
            MsFlexAlign: "center",
            alignItems: "center",
            padding: "10px",
            fontSize: "16px"
        },
        "& li a span": {
            WebkitBoxFlex: 1,
            MsFlex: "1 1 0px",
            flex: "1 1 0"
        },
        "& li.facebook": {
            background: "#37538e"
        },
        "& li.google": {
            background: "#4285f4"
        },
        "& li + li": {
            marginTop: "10px"
        }
    },
    loginBottomLinks: {
        "& p": {
            margin: 0,
            color: "#757575",
            fontSize: "13px",
            textAlign: "center"
        },
        "& p a": {
            color: "#000"
        }
    },
    logLinks: {
        "& li": {
            display: "inline-block"
        },
        "& li a": {
            color: "#fe3a56",
            display: "inline-block",
            fontSize: "16px",
            padding: "8px 15px",
            textDecoration: "none !important",
            textTransform: "capitalize"
          },
          "& li + li": {
            marginLeft: "-4px",
            border: "1px solid #ccc",
            borderWidth: "0 0 0 1px"
          }
    },
    loginContent: {
        "& .popupInfo > p": {
            fontSize: "16px",
            fontWeight: 400
        },
        "& .popupInfo > img": {
            width: "160px",
            marginBottom: "25px"
        }
    },
    colmd7: {
        WebkitBoxFlex: 0,
        MsFlex: "0 0 58.33333333%",
        flex: "0 0 58.33333333%",
        maxWidth: "58.33333333%"
      },
    loginRight: {
        // padding: "50px 15px 20px"
    },
    py5: {
        paddingTop: "3rem !important"
      },
    continueWith: {
        marginTop: "1.5rem !important"
      },
    popupInfo: {
        fontSize: "16px"
    },
    textCenter: {
        textAlign: "center !important"
      },
    popupLogo: {
        "& img": {
            width: "160px",
            marginBottom: "25px"
        }
    },
    or: {
        display: "block",
        WebkitBoxAlign: "center",
        MsFlexAlign: "center",
        alignItems: "center",
        position: "relative",
        "& span": {
            fontSize: "14px",
            margin: "0 40px",
            padding: "0 20px",
            display: "inline-block",
            background: "#fff",
            position: "relative",
            zIndex: 1,
            color: "#757575",
        },
        "&:before": {
            content: "",
            display: "inline-block",
            height: "1px",
            background: "#a9a9a9",
            width: "100%",
            position: "absolute",
            top: "50%",
            left: 0
          }
    },
    eTPvTw: {
        "boxSizing":"border-box",
        "position":"relative",
        "display":"inline-flex",
        "WebkitBoxPack":"start",
        "justifyContent":"flex-start",
        "WebkitBoxAlign":"center",
        "alignItems":"center",
        "flexDirection":"column",
        "cursor":"pointer",
        "textAlign":"center",
        "width":"auto",
        "maxWidth":"56px",
        "opacity":"1",
        "margin":"0px 5px",
        "& .delete": {
            "position":"absolute",
            "backgroundColor":"white",
            "zIndex":"1",
            "right":"-10px",
            "top":"-10px",
            "borderRadius":"500em"
         }
     },
     alignSelf: {
        marginBottom: "8px"
     },
     
     textAlign: {
        "textTransform":"uppercase",
        "fontSize":"11px",
        "fontWeight":"500",
        "color":"rgb(117, 117, 117)!important",
        "maxWidth":"56px",
        "overflowWrap":"break-word",
        "textDecorationLine":"none",
        "display":"block"
     },
     hXGgNA: {"WebkitBoxPack":"justify","justifyContent":"space-between"},
     fkJmKQ: {
        "display":"flex",
        "flexWrap":"nowrap",
        "overflowX":"visible",
        "overflowY":"visible",
        "& button": {"boxShadow":"rgba(0, 0, 0, 0.12) 0px 1px 3px 0px"},
        "justify-content": "center"
     },
     ziseO: {
        "boxSizing":"border-box",
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)",
        "maxWidth":"100%",
        "display":"block",
        "alignSelf":"auto",
        "flex":"0 0 100%",
        "@media (min-width: 30rem)": {"paddingLeft":"calc(6px)","paddingRight":"calc(6px)"},
        "@media (min-width: 48rem)":{
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)",
            "display":"block"
         },
         "@media (min-width: 60rem)":{
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)"
         }
     },
     nqLdW: {
        "boxSizing":"border-box",
        "marginLeft":"calc(-6px)",
        "marginRight":"calc(-6px)",
        "display":"flex",
        "flexDirection":"row",
        "flexWrap":"wrap",
        "WebkitBoxPack":"center",
        "justifyContent":"center",
        "WebkitBoxAlign":"stretch",
        "alignItems":"stretch",
        "alignContent":"stretch",
        "@media (min-width: 30rem)": {"marginLeft":"calc(-6px)","marginRight":"calc(-6px)"},
        "@media (min-width: 48rem)": {"marginLeft":"calc(-8px)","marginRight":"calc(-8px)"},
        "@media (min-width: 60rem)": {"marginLeft":"0","marginRight":"0"}
     },
     cFmmbG: {
        "boxSizing":"border-box",
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)",
        "maxWidth":"100%",
        "display":"block",
        "alignSelf":"auto",
        "flex":"0 0 100%",
        "@media (min-width: 60rem)": {
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)",
            "flexBasis":"83.3333%",
            "maxWidth":"83.3333%",
            "display":"block"
         },
        "@media (min-width: 30rem)": {
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)"
        },
        "@media (min-width: 48rem)": {
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)"
        }
     },

     googAd: {
        "boxSizing":"border-box",
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)",
        "maxWidth":"100%",
        "display":"block",
        "alignSelf":"auto",
        "flex":"0 0 100%",
        "@media (min-width: 60rem)": {
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)",
            "flexBasis":"16.6667%",
            "maxWidth":"16.6667%",
            "display":"block"
         },
        "@media (min-width: 30rem)": {
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)"
        },
        "@media (min-width: 48rem)": {
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)"
        }
     },
     
     blMHsv: {
        "boxSizing":"border-box",
        "width":"100%",
        "margin":"0px auto",
        "@media (min-width: 48rem)": {"paddingLeft":"16px","paddingRight":"16px"},
        "@media (min-width: 60rem)": {"width": "960px"}
     },
     dUMWSw: {
        "paddingTop": "12px",
        "paddingBottom": "8px",
        "background": "white",
        "overflow": "auto",
        "display": "flex",
        "flexwrap": "nowrap"
    },
    wrap: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    inActive: {
        "pointerEvents":"none",
        "cursor":"default",
        "textDecoration":"none",
        "color":"black"
     },
    dioYWW: {
        "boxSizing":"border-box",
        "WebkitAppearance":"none",
        "cursor":"pointer",
        "userSelect":"none",
        "whiteSpace":"nowrap",
        "WebkitTapHighlightColor":"rgba(0, 0, 0, 0)",
        "textOverflow":"ellipsis",
        "maxWidth":"100%",
        "minHeight":"1rem",
        "display":"-webkit-inline-box",
        "position":"relative",
        "WebkitBoxAlign":"center",
        "alignItems":"center",
        "WebkitBoxPack":"center",
        "justifyContent":"center",
        "justifyItems":"center",
        "textAlign":"center",
        "fontSize":"1em",
        "width":"30px",
        "height":"30px",
        "color":"rgb(189, 189, 189)",
        "boxShadow":"rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
        "borderWidth":"initial",
        "borderStyle":"none",
        "borderColor":"initial",
        "borderImage":"initial",
        "outline":"none",
        "textDecoration":"none",
        "padding":"0px",
        "margin":"0px",
        "flex":"0 0 auto",
        "overflow":"initial",
        "background":"transparent",
        "borderRadius":"32px"
     },
     eBmutg: {
        "fill":"currentcolor",
        "userSelect":"none",
        "display":"inline-block",
        "verticalAlign":"middle",
        "lineHeight":"1",
        "transition":"fill 0.25s ease 0s"
     },
     NqLdW: {
        "boxSizing":"border-box",
        "marginLeft":"calc(-6px)",
        "marginRight":"calc(-6px)",
        "display":"flex",
        "flexDirection":"row",
        "flexWrap":"wrap",
        "WebkitBoxPack":"center",
        "justifyContent":"left",
        "WebkitBoxAlign":"stretch",
        "alignItems":"stretch",
        "alignContent":"stretch",
        "@media (min-width: 48rem)": {"marginLeft":"calc(-6px)","marginRight":"calc(-6px)"},
        "@media (min-width: 30rem)": {"marginLeft":"calc(-8px)","marginRight":"calc(-8px)"},
        "@media (min-width: 60rem)": {"marginLeft":"calc(-8px)","marginRight":"calc(-8px)"}
     },
     eraWF: {
        "boxSizing":"border-box",
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)",
        "maxWidth":"100%",
        "display":"block",
        "alignSelf":"auto",
        "flex":"0 0 100%",
        "@media (min-width: 30rem)": {"paddingLeft":"calc(6px)","paddingRight":"calc(6px)"},
        "@media (min-width: 48rem)": {"paddingLeft":"calc(8px)","paddingRight":"calc(8px)"},
        "@media (min-width: 60rem)": {
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)",
            "flexBasis":"83.3333%",
            "maxWidth":"83.3333%",
            "display":"block"
         }
     },
     blMHsv: {
        "boxSizing":"border-box",
       
        "margin":"0px auto"
     },
     bgrJYF: {
        marginTop: "2px"
    },
    lotuhp: {
        "boxSizing":"border-box",
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)",
        "maxWidth":"100%",
        "display":"block",
        "alignSelf":"auto",
        "position":"relative",
        "flex":"0 0 100%",
        "@media (min-width: 60rem)": {"paddingLeft":"calc(8px)","paddingRight":"calc(8px)"},
        "@media (min-width: 48rem)": {"paddingLeft":"calc(8px)","paddingRight":"calc(8px)"},
        "@media (min-width: 30rem)": {"paddingLeft":"calc(6px)","paddingRight":"calc(6px)"}
     },
     lpmTFP:{
        "boxSizing":"border-box",
        "display":"flex",
        "flexDirection":"row",
        "flexWrap":"wrap",
        "WebkitBoxPack":"start",
        "justifyContent":"flex-start",
        "WebkitBoxAlign":"stretch",
        "alignItems":"stretch",
        "alignContent":"stretch",
        "width":"100%",
        "position":"relative",
        "marginTop":"14px",
        "marginLeft":"0px",
        "marginRight":"0px",
        "flex":"0 1 auto",
        "@media (min-width: 30rem)": {"marginLeft":"calc(-6px)","marginRight":"calc(-6px)"},
        "@media (min-width: 48rem)": {"marginLeft":"calc(-8px)","marginRight":"calc(-8px)"},
        "@media (min-width: 60rem)": {"marginLeft":"calc(-8px)","marginRight":"calc(-8px)"}
     },
     "foIXbw":{
        "boxSizing":"border-box",
        "paddingLeft":"calc(6px)",
        "paddingRight":"calc(6px)",
        "maxWidth":"50%",
        "display":"block",
        "alignSelf":"auto",
        "flex":"0 0 50%",
        "@media (min-width: 30rem)": {
            "paddingLeft":"calc(6px)",
            "paddingRight":"calc(6px)",
            "flexBasis":"33.3333%",
            "maxWidth":"33.3333%",
            "display":"block"
         },
        "@media (min-width: 48rem)": {
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)",
            "flexBasis":"25%",
            "maxWidth":"25%",
            "display":"block"
         },
        "@media (min-width: 60rem)": {
            "paddingLeft":"calc(8px)",
            "paddingRight":"calc(8px)"
         }
     },
     GUWDi: {
        marginBottom: "8px"
    },
    vbiXn: {
        position: "relative",
        "& .inner": {
            "paddingBottom":"100%",
            "display":"block",
            "position":"relative",
            "WebkitBoxPack":"center",
            "backgroundColor":"rgb(255, 255, 255)",
            "borderRadius":"6px",
            "& img": {
                "height":"100%",
                position: "absolute",
                width: "100%",
                "objectFit":"cover",
                "opacity":"1",
                "transition":"opacity 0.5s ease-in-out 0s"
             }
         },
         "& .footer": {
            "display":"flex",
            "flexDirection":"column",
            "WebkitBoxPack":"center",
            "justifyContent":"center",
            "minHeight":"68px",
            "boxSizing":"border-box"
         },
         "& .footer .main p": {
            fontSize: "14px",
            "@media (min-width: 48rem)": {
                fontSize: "18px"
            }
        },
        "& .footer a": {
            color: "rgb(44, 44, 44)",
            textDecoration: "none"
        },
        "& .footer .secondary p": {
            fontSize: "14px",
            "@media (min-width: 48rem)": {
                fontSize: "16px"
            }
        }
    },
    ijFtv: {
        boxSizing: "border-box",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
        position: "relative",
        background: "rgb(255, 255, 255)",
        borderRadius: "8px",
        "& div > section": {
            "boxSizing":"border-box",
            "overflowX":"hidden",
            "overflowY":"auto",
            "height":"auto",
            "padding":"0px"
         }
    },
    fOiDZW: {
        "& div > section": {
            overflowX: "initial !important",
            overflowY: "initial !important"
        }
    },
    iOHpjI: {
        padding: "4px"
    },
    hIHtqB: {
        padding: "10px",
        "borderWidth":"1px",
        "borderStyle":"solid",
        "border-top-color":"rgb(238, 238, 238)",
        "border-bottom-color": "transparent",
        "border-left-color": "transparent",
        "border-right-color": "transparent"
    },
    rqHAf: {
        "boxSizing":"border-box",
        "display":"flex",
        "flexDirection":"row",
        "flexWrap":"nowrap",
        "WebkitBoxPack":"start",
        "justifyContent":"flex-start",
        "WebkitBoxAlign":"center",
        "alignItems":"center",
        "alignContent":"stretch"
     },
     "exWZiu":{
        "boxSizing":"border-box",
        "display":"block",
        "alignSelf":"auto",
        "flex":"1 1 0%"
     },
     RlATG: {
        position: "relative",
        display: "inline-block",
        boxSizing: "border-box",
    },
    "jrOmri":{
        "boxSizing":"border-box",
        "WebkitAppearance":"none",
        "cursor":"pointer",
        "display":"inline-block",
        "textAlign":"center",
        "userSelect":"none",
        "whiteSpace":"nowrap",
        "WebkitTapHighlightColor":"rgba(0, 0, 0, 0)",
        "textOverflow":"ellipsis",
        "maxWidth":"100%",
        "fontFamily":"Roboto, Helvetica, Arial, sans-serif",
        "minHeight":"30px",
        
        "height":"40px",
        "fontSize":"16px",
        "fontWeight":"500",
        "color":"rgb(255, 63, 85)",
        "borderImage":"initial",
        "outline":"none",
        "textDecoration":"none",
        "overflow":"hidden",
        "margin":"0px",
        "background":"white",
        "transition":"background-color 0.25s ease 0s",
        "borderRadius":"100em",
        "borderColor":"rgb(255, 63, 85)",
        "borderWidth":"1px",
        "borderStyle":"solid",
        "& span": {
            "display":"inline",
            "verticalAlign":"middle",
            "lineHeight":"1.5em"
         }
    },
    "gyDxPI":{
        "height":"32px",
        "fontSize":"14px",
        "borderWidth":"1px",
        "borderStyle":"solid",
        "borderColor":"rgb(238, 238, 238)",
        "borderImage":"initial"
     },
     fZrGwr: {
        boxSizing: "border-box",
        display: "block",
        alignSelf: "auto",
        flex: "0 0 auto"
    },
    dimzFh: {
        marginLeft: "8px"
    },
    "dKRXVt":{
        "width":"32px",
        "height":"32px",
        "borderWidth":"1px",
        "borderStyle":"solid !important",
        "borderColor":"rgb(238, 238, 238) !important",
        "borderImage":"initial",
        "transition":"border 0.2s ease-in-out 0s",
        "& svg": {
            width: "20px",
            height: "20px",
            transition: "fill 0.2s ease-in-out 0s"
        },
        "&:hover": {
            borderColor: "rgb(224, 224, 224) !important"
        }
     },
     "egQXgJ":{
        "boxSizing":"border-box",
        "WebkitAppearance":"none",
        "cursor":"pointer",
        "userSelect":"none",
        "whiteSpace":"nowrap",
        "WebkitTapHighlightColor":"rgba(0, 0, 0, 0)",
        "textOverflow":"ellipsis",
        "maxWidth":"100%",
        "minHeight":"1rem",
        "display":"-webkit-inline-box",
        "position":"relative",
        "WebkitBoxAlign":"center",
        "alignItems":"center",
        "WebkitBoxPack":"center",
        "justifyContent":"center",
        "justifyItems":"center",
        "textAlign":"center",
        "fontSize":"1em",
        "width":"30px",
        "height":"30px",
        "color":"rgb(189, 189, 189)",
        "boxShadow":"none",
        "borderWidth":"initial",
        "borderStyle":"none",
        "borderColor":"initial",
        "borderImage":"initial",
        "outline":"none",
        "textDecoration":"none",
        "padding":"0px",
        "margin":"0px",
        "flex":"0 0 auto",
        "overflow":"initial",
        "background":"transparent",
        "borderRadius":"40px"
     },
     fVWeqY: {
        "fill":"currentcolor",
        "userSelect":"none",
        "display":"inline-block",
        "verticalAlign":"middle",
        "lineHeight":"1",
        "transition":"fill 0.25s ease 0s"
     },
     fTOfTS: {  
        "width":"32px",
        "height":"32px",
        "color":"rgb(255, 63, 85)",
        "borderWidth":"1px",
        "borderStyle":"solid",
        "borderColor":"rgb(238, 238, 238)",
        "borderImage":"initial",
        "transition":"border 0.2s ease-in-out 0s"
     },
     iBigWB: {
        
        "paddingBottom":"4px",
        "@media (min-width: 0rem)": {"paddingRight":"8px","paddingLeft":"8px"},
        "@media (min-width: 30rem)": {"paddingRight":"12px","paddingLeft":"12px"}
     },
     idbXKU: {
        "color":"rgb(44, 44, 44)",
        "lineHeight":"1.2em",
        "fontWeight":"500",
        "fontSize":"16px",
        "maxWidth":"100%",
        "whiteSpace":"nowrap",
        "textOverflow":"ellipsis",
        "margin":"0px",
        "overflow":"hidden"
     },
     "lkKZlA":{
         
         "@media (min-width: 0rem)": {"paddingRight":"8px","paddingLeft":"8px"},
         "@media (min-width: 48rem)": {"paddingRight":"12px","paddingLeft":"12px"}
        },
    "jVEKGa": {
        "color":"rgb(117, 117, 117)",
        "lineHeight":"1.2em",
        "fontWeight":"500",
        "fontSize":"16px",
        "maxWidth":"100%",
        "whiteSpace":"nowrap",
        "textOverflow":"ellipsis",
        "margin":"0px",
        "overflow":"hidden"
     },
     jqJLdD: {
        "boxSizing":"border-box",
        "WebkitAppearance":"none",
        "cursor":"pointer",
        "display":"inline-block",
        "textAlign":"center",
        "userSelect":"none",
        "whiteSpace":"nowrap",
        "WebkitTapHighlightColor":"rgba(0, 0, 0, 0)",
        "textOverflow":"ellipsis",
        "maxWidth":"100%",
        "fontFamily":"Roboto, Helvetica, Arial, sans-serif",
        "minHeight":"30px",
        "color":"white",
        "width":"auto",
        "height":"40px",
        "fontSize":"16px",
        "fontWeight":"500",
        "borderWidth":"initial",
        "borderStyle":"none",
        "borderColor":"initial",
        "borderImage":"initial",
        "outline":"none",
        "textDecoration":"none",
        "overflow":"hidden",
        "margin":"0px",
        "background":"rgb(255, 63, 85)",
        "transition":"background-color 0.25s ease 0s",
        "padding":"0px 1.4rem",
        "borderRadius":"100em"
     },
     bSJSSe: {
        "width":"100%",
        "display":"flex",
        "WebkitBoxPack":"center",
        "justifyContent":"center",
        "margin":"10px 0px 20px"
     }
};

export default loginStyle;