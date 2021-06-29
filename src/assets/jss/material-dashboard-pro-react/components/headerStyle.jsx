// ##############################
// // // Header styles
// #############################

import {
  containerFluid,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor
} from "../../material-dashboard-pro-react.jsx";

const headerStyle = theme => ({
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    borderBottom: "0",
    marginBottom: "0",
    position: "absolute",
    width: "100%",
    paddingTop: "10px",
    zIndex: "1029",
    color: "#555555",
    border: "0",
    borderRadius: "3px",
    padding: "10px 0",
    transition: "all 150ms ease 0s",
    minHeight: "50px",
    display: "block"
  },
  container: {
    ...containerFluid,
    minHeight: "50px"
  },
  flex: {
    flex: 1
  },
  title: {
    ...defaultFont,
    lineHeight: "30px",
    fontSize: "18px",
    borderRadius: "3px",
    textTransform: "none",
    color: "inherit",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    margin: "0 !important",
    "&:hover,&:focus": {
      background: "transparent"
    }
  },
  primary: {
    backgroundColor: primaryColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  info: {
    backgroundColor: infoColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  success: {
    backgroundColor: successColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  warning: {
    backgroundColor: warningColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  danger: {
    backgroundColor: dangerColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  sidebarMinimize: {
    float: "left",
    padding: "0 0 0 15px",
    display: "block",
    color: "#555555"
  },
  sidebarMinimizeRTL: {
    padding: "0 15px 0 0 !important"
  },
  sidebarMiniIcon: {
    width: "20px",
    height: "17px"
  },
  logo: {
    cursor:"pointer",
    '& img': {
      width: "80px"
    }
  },
  navbarBrand: {
    display: 'inline-block',
    paddingTop: '0.32rem',
    paddingBottom: '0.32rem',
    marginRight: '1rem',
    fontSize: '1.125rem',
    lineHeight: 'inherit',
    whiteSpace: 'nowrap',
    "&,&:hover,&:focus": {
      textDecoration: 'none'
    }
  },
  dInlineBlock: {
    display: "inline-block !important"
  },
  themeColor: {
    color: '#fe3a56',
    width: 80
  },
  imgFluid: {
    maxWidth: '100%',
    height: 'auto'
  },
  headerSearch: {
    color: "#757575",
    background: 'rgb(238, 238, 238)',
    padding: "0 0 0 15px",
    WebkitBoxFlex: 1,
        Msflex: 1,
            flex: 1,
    borderRadius: "20px",
    "& input": {
      background: 'transparent',
      border: 0,
      height: "35px",
      outline: 'none',
      color: 'rgb(97, 97, 97)',
      marginLeft: -10,
      "&::placeholder":{
          color: 'rgb(148, 148, 148)'
      },
      '&::-webkit-input-placeholder': { /* Edge */
          color: 'rgb(148, 148, 148)'
      },
      '&:-ms-input-placeholder': { /* Internet Explorer 10-11 */
          color: 'rgb(148, 148, 148)'
      }
    }
  },
  dFlex: {
    display: '-webkit-box !important',
    display: '-ms-flexbox !important',
    display: 'flex !important'
  },
  alignItemsCenter: {
    WebkitBoxAlign: "center !important",
    MsFlexAlign: "center !important",
    alignItems: "center !important"
  },
  mrmd3: {
    marginRight: '1rem !important'
  },
  mr2: {
    marginRight: '0.5rem !important'
  },
  // mx2: {
  //   marginRight: '1rem !important',
  //   marginLeft: '0.5rem !important'
  // },
  // ml2: {
  //   marginLeft: '0.5rem !important'
  // },

  mx2: {
    marginLeft: '0.5rem !important'
  },
  iconMagnifyingGlass: {
    fontSize: '26px',
    color: 'rgb(148, 148, 148)',
    marginLeft: -8,
    marginBottom: -2
  },
  filterButton: {
  fontSize: '30px',
  color: '#757575'
  },
  dBlock: {
    display: 'block !important'
  },
  dMdNone: {
    display: 'none !important'
  },
  btn1: {
    cursor:"pointer",
    border:"1px solid #ccc",
    borderRadius:"32px",
    fontSize:"16px",
    fontWeight:"600",
    padding: "8px 18px",
    textTransform:"capitalize"
 },
 responssell:{
 
  
 },
 btn: {
  "display":"inline-block",
  },
 dNone: {
  display: "none"
},
dMdBlock: {
  display: 'block'
},
notigi:{
"display":'inline-block',
"padding":'10px 18px'
},
  btnSecondary: {
    color: '#fe3a56',
    background: '#fff',
    borderColor: '#fe3a56',
    '&:hover': {
      color: '#fe3a56',
     // background: '#efdada',
      borderColor: '#fe3a56'
    }
  },
  chatBubble: {
    //  "height": "20px",
    //   "fontSize":"30px",
    //   "width": "40px",
    //   "paddingTop": "10px",
    //   "lineHeight":"34px",
    
      "color":"#969696",
      "& :before": {  
        "lineHeight":"27px",
        "verticalAlign":"bottom"
     },
      "& :hover": {
      color: '#fe3a56'
      }
  },
  sellBtn: {
    "position":"fixed",
    "bottom":"15px",
    "left":"50%",
    "WebkitTransform":"translate3d(-49%, 0, 0)",
    "transform":"translate3d(-49%, 0, 0)",
    "padding":"6px 12px 4px",
    "fontSize":"13px"
 },
 btnPrimary: {
  borderColor: '#fe3a56',
  color: '#fff',
  background: '#fe3a56',
  "&:hover, &:active, &:focus": {
    "background":"#f56f7e",
    "color":"#fff",
    "borderColor":"#f56f7e",
    "WebkitBoxShadow":"none",
    "boxShadow":"none"
 }
},
notification: {
  color: '#969696',
  boxShadow: "none",
  color: '#969696',
  background: "white"
},
textNoWrap: {
  whiteSpace: "nowrap !important"
},
// iconCamera: {
//   "&:before": {
//     content: "w"
//   }
// },
// icon: {
//   "fontSize":"15px",
//   "lineHeight":"15px",
//   "textAlign":"center"
// },
msgIcon: {
  // "fontSize":"30px",
  // "lineHeight":"34px",
  // // "margin":"0 20px",
  // "color":"#969696",
  "&:before": {
    "lineHeight":"27px",
    "verticalAlign":"bottom"
 },
 "&:hover": {
  color:"#fe3a56"
 }
},
iconChatBubbles: {
  '&:before': {
    content: "f"
  }
},
mainMenu: {
  '& .navOverlay': {
    "position":"fixed",
    "top":"0",
    "right":"0",
    "left":"0",
    "bottom":"0",
    "background":"rgba(255, 255, 255, 0.5)",
    "zIndex":"9"
 }
},
navbarToggler: {
  "padding":"0.25rem 0.75rem",
  "fontSize":"1.125rem",
  "lineHeight":"1",
  "backgroundColor":"transparent",
  "border":"1px solid transparent",
  boxShadow: "none",
  color: '#969696',
  "borderRadius":"0.25rem",
  "&:hover,&:focus": {
    "backgroundColor":"transparent",
    color: '#969696',
    textDecoration: 'none',
    boxShadow: 'none'
  }
},
navbarTogglerIcon: {
  "display":"inline-block",
  "width":"1.5em",
  "height":"1.5em",
  "verticalAlign":"middle",
  "content":"\"\"",
  "background":"no-repeat center center",
  "backgroundSize":"100% 100%"
},
fixedTop: {
  "position":"fixed",
  "top":"0",
  "right":"0",
  "left":"0",
  "zIndex":"1030"
},
topPanel: {},
navbar: {
  "top": "0px",
  "boxSizing": "border-box",
  "display": "flex",
  "-moz-box-align": "center",
  "alignitems": "center",
  "position": "fixed",
  "backgroundColor": "rgb(255, 255, 255)",
  "width": "100%",
  "minWidth": "320px",
  "height": "56px",
  "padding": "4px 12px",
  "zIndex": "98",
  "boxShadow": "rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.2) 0px 3px 8px 0px",
  "left":"0px",
  "right":"0px"
},
flexNoWrap: {
  "MsFlexWrap":"nowrap !important",
  "flexWrap":"nowrap !important"
},
dMdFlex: {"display":"flex !important"},
navbarLight: {
  '& .navbarBrand': {
  color: "rgba(0, 0, 0, 0.9)",
  "& :hover, &:focus": {
    color: "rgba(0, 0, 0, 0.9)",
  }
}
},
Input: {
  "margin":"0",
  "fontFamily":"inherit",
  "fontSize":"inherit",
  "lineHeight":"inherit",
  "overflow":"visible",
  "border":"1px solid #ccc",
  "borderRadius":"2px",
  "width":"100%",
  "height":"40px",
  "padding":"0 15px",
  "& :focus": {
    "border":"0",
    "WebkitBoxShadow":"none !important",
    "boxShadow":"none",
    "outline":"0"
  }
},
koIpSk: {
  "display":"block",
  "width":"100%",
  "fontSize":"14px",
  "color":"rgb(117, 117, 117)",
  "paddingLeft":"4px",
  "lineHeight":"35px",
  "borderWidth":"initial",
  "borderStyle":"none",
  "borderColor":"initial",
  "borderImage":"initial",
  "margin":"0px",
  "background":"transparent"
},
"kXpwzh":{
  "boxSizing":"border-box",
  "display":"block",
  "paddingLeft":"calc(0rem)",
  "paddingRight":"calc(0rem)",
  "alignSelf":"auto",
  "flex":"0 0 auto",
  "@media (min-width: 48rem)": {"paddingLeft":"calc(0rem)","paddingRight":"calc(0rem)"},
  "@media (min-width: 30rem)": {"paddingLeft":"calc(0rem)","paddingRight":"calc(0rem)"}
},
"gocXI":{
  "boxSizing":"border-box",
  "WebkitAppearance":"none",
  "display":"inline-block",
  "textAlign":"center",
  "userSelect":"none",
  "whiteSpace":"nowrap",
  "WebkitTapHighlightColor":"rgba(0, 0, 0, 0)",
  "textOverflow":"ellipsis",
  "maxWidth":"100%",
  "fontFamily":"Roboto, Helvetica, Arial, sans-serif !important",
  "minHeight":"30px",
  "color":"white",
  "width":"auto",
  "height":"40px",
  "fontSize":"16px !important",
  "fontWeight":"500 !important",
  "position":"relative",
  "pointerEvents":"none",
  "cursor":"not-allowed",
  "opacity":"0.5",
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
  "borderRadius":"100em",
  textTransform: "unset",
  "&:hover,&:focus": {
    opacity: 1,
    "color":"white",
    "background":"rgb(255, 63, 85)",
    pointerEvents: "unset !important",
    cursor: "pointer !important"
  }
},
  "enabledState": {
    opacity: 1,
    pointerEvents: "unset !important",
    cursor: "pointer !important"
},
"dcMBRc":{
  "boxSizing":"border-box",
  "display":"block",
  "paddingLeft":"calc(6px)",
  "paddingRight":"calc(6px)",
  "alignSelf":"auto",
  "flex":"1 1 0%",
  "@media (min-width: 48rem)": {"paddingLeft":"calc(8px)","paddingRight":"calc(8px)"},
  "@media (min-width: 30rem)": {"paddingLeft":"calc(6px)","paddingRight":"calc(6px)"}
},
"pdTeD":{
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
  "height":"39px",
  "bottom":"0px",
  "backgroundColor":"rgb(238, 238, 238)",
  "borderRadius":"8px 16px 16px 8px",
  "margin":"0px",
  "@media (min-width: 48rem)": {"marginLeft":"calc(0rem)","marginRight":"calc(0rem)"},
  "@media (min-width: 30rem)": {"marginLeft":"calc(-0rem)","marginRight":"calc(-0rem)"}
},
"iJwhBC":{"width":"100%","marginBottom":"0px"},
"kHpzoU":{"boxSizing":"border-box","padding":"10px"},
"cWKbaS":{"height":"auto","overflowY":"auto","margin":"0px","padding":"4px 0px","listStyle":"none"},
"jjjjkf": {
  "position":"absolute",
  "minWidth":"270px",
  "zIndex":"6",
  "fontSize":"16px",
  "textAlign":"left",
  "backgroundColor":"white",
  "boxShadow":"rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.2) 0px 3px 8px 0px",
  "display":"block",
  "borderRadius":"8px",
  "top":"100%","marginTop":"4px"
},

jdjXhR: {
  width: "100%",
  "& > div": {
      "minWidth":"304px",
      "left":"50%",
      "transform":"translate(-50%, 0px)"
   }
},
headerProfileList: {
  "position":"fixed",
  opacity: 1,
  pointerEvents: 'all',
  "zIndex":"6",
  "backgroundColor":"white",
  "boxShadow":"rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.2) 0px 3px 8px 0px",
  "transition":"right 250ms ease-in-out 0s",
  "width":"300px",
  "top":"0px",
  "height":"100%",
  right: '0px',
  "transition":"right 250ms ease-in-out 0s"
},
profileSet: {
  "boxSizing":"border-box",
  "height":"180px",
  "width":"100%",
  "backgroundColor":"rgb(255, 63, 85)",
  "color":"rgb(255, 255, 255)",
  "padding":"24px 16px"
},
profileName: {
  "cursor":"pointer",
  "fontFamily":"Roboto, Helvetica, sans-serif",
  "fontWeight":"400",
  "fontSize":"20px",
  "marginTop":"10px"
},
profilePlace: {
  "cursor":"pointer",
  "fontFamily":"Roboto, Helvetica, sans-serif",
  "fontWeight":"400",
  "fontSize":"14px",
  "marginTop":"2px",
  color: 'rgb(255, 178, 187)'
}

});

export default headerStyle;
