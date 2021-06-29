const pagesStyle = theme => ({
  wrapper: {
    // height: "auto",
    height: "100vh",
    position: "relative",
    top: "0"
  },

  homeContent: {
    margin: "auto 0",
    width: "100%",
    height: "calc(100vh - 170px)",
    paddingBottom: "50px"
  },

  homeContentWrap: {
    display: "flex",
    alignItems: "flex-end",
    height: "100%",

    "& h3": {
      margin: "0",
      color: "#fff",
      fontSize: "27px",
      fontFamily: "sans-serif",
      fontStyle: "italic",
      letterSpacing: "2px",
      },

       "@media (max-width: 767px)": {
    flexWrap: "wrap",
        },
  },

  container: {
  paddingRight: "15px",
  paddingLeft: "15px",
  marginRight: "auto",
  marginLeft: "auto",
  maxWidth: "100%",
  height: "100%",
  boxSizing: "border-box",
  "@media (min-width: 768px)": {
    width: "750px"
  },
  "@media (min-width: 992px)": {
    width: "970px"
  },
  "@media (min-width: 1200px)": {
    width: "1170px"
  },
  "&:before,&:after": {
    display: "table",
    content: '" "'
  },
  "&:after": {
    clear: "both"
  }
},

startsBlock: {
 display: "flex",
 marginLeft: "auto",
 alignItems: "flex-end",
 "@media (max-width: 767px)": {
flexWrap: "wrap",
margin: "auto",
  },
 },

 startsInfo: {
  marginBottom: "50px",
  marginRight: "50px",
  "@media (max-width: 991px)": {    
        "& img": {
  width: "200px",
          },
     },
  "@media (max-width: 767px)": {    
  marginBottom: "15px",
  marginRight: "10px",
    "& h3": {
fontSize: "14px",
      },
      "& img": {
width: "100px",
marginLeft: "45px",
        },
   },
  },

  startsImage: {
    marginLeft: "auto",
 "@media (max-width: 767px)": {
"& img": {
height: "200px",
  },
  },
    },

  appButton: {
      display: "inline-block",
      marginBottom: "50px",

      "& span": {
        color: "#fff",
        fontSize: "18px",
        display: "block",
        fontStyle: "italic",
        fontFamily: "sans-serif",
        letterSpacing: "2px",
        marginTop: "10px",
        textAlign: "right",
        padding: "0 34px",
      },
      "@media (max-width: 1024px)": {
        "& span": {
padding: "0 10px",
        },
      },
      "@media (max-width: 991px)": {
        "& span": {
padding: "0",
textAlign: "left",
        },
      },
    "@media (max-width: 767px)": {
      display: "block",
      padding: "25px 0",
      margin: "0 auto",
      textAlign: "center"
    }
  },

  appImage: {
    display: "inline-block",
    padding: 0,
    width: "140px",
    "@media (max-width: 1024px)": {
    width: "100px"
  },
    "@media (max-width: 767px)": {
    width: "90px"
  }
},
  ahref: {
    display: "inline-block",
    padding: "7px 15px 5px",
    border: "1px solid #fff",
    margin: "0 15px 0 0",
    borderRadius: "7px",
    "&:hover": {
     background: "rgba(255,255,255,.2)",
     transition: "all 0.5s ease-out"
   },
   "@media (max-width: 991px)": {
    margin: "10px 0",
   },
   "@media (max-width: 767px)": {
    margin: "0px 7px",
   },
  },
  fullPage: {
    padding: "120px 0 0",
    position: "relative",
    display: "flex!important",
    margin: "0",
    border: "0",
    color: "#fff",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    //height: "calc(100% - 120px)",
    height:"100%",
    [theme.breakpoints.down("sm")]: {
      //minHeight: "fit-content!important",
    },
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%",
      border: "none !important"
    },
    "&:before": {
      backgroundColor: "rgba(0, 0, 0, 0)"
    },
    "@media (max-width: 991px)": {
 padding: "90px 0 0",
 //height: "calc(100% - 90px)",
 height:"100%"
      },
      "@media (max-width: 767px)": {
 padding: "70px 0 0",
// height: "calc(100% - 70px)",
height:"100%"
      },
  }
});

export default pagesStyle;
