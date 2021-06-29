// ##############################
// // // Dashboard View styles
// #############################

import {
  successColor,
  tooltip,
  cardTitle
} from "../../material-dashboard-pro-react.jsx";

import hoverCardStyle from "../../material-dashboard-pro-react/hoverCardStyle.jsx";

const dashboardStyle = {
  ...hoverCardStyle,
  tooltip,
  cardTitle: {
    ...cardTitle,
    marginTop: "0px",
    marginBottom: "3px",
    paddingTop: "10px",
    fontWeight: '700px !important',
    fontSize: '30px !important',
    color: '#91979a'
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  cardProductTitle: {
    ...cardTitle,
    marginTop: "0px",
    marginBottom: "3px",
    textAlign: "center"
  },
  cardCategory: {
    color: "#999999",
    fontSize: "15px",
    paddingTop: "10px",
    marginBottom: "0",
    marginTop: "0",
    margin: "0",
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif !important"
  },
  cardProductDesciprion: {
    textAlign: "center",
    color: "#999999"
  },
  stats: {
    color: "#999999",
    fontSize: "12px",
    lineHeight: "22px",
    display: "inline-flex",
    "& svg": {
      position: "relative",
      top: "4px",
      width: "16px",
      height: "16px",
      marginRight: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      position: "relative",
      top: "4px",
      fontSize: "16px",
      marginRight: "3px"
    }
  },
  productStats: {
    paddingTop: "7px",
    paddingBottom: "7px",
    margin: "0"
  },
  successText: {
    color: successColor
  },
  upArrowCardCategory: {
    width: 14,
    height: 14
  },
  underChartIcons: {
    width: "17px",
    height: "17px"
  },
  price: {
    color: "inherit",
    "& h4": {
      marginBottom: "0px",
      marginTop: "0px"
    }
  }
};

export default dashboardStyle;
