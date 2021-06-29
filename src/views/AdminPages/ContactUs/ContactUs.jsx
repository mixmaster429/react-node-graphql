import React from "react";
import { compose, graphql } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
//import "react-table/react-table.css";
import "../../../assets/scss/material-dashboard-pro-react/plugins/_plugin-react-table.scss";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import {GET_CONTACT_DETAILS} from "../../../queries";
import {downloadCSV, onTableViewChange, downloadXLSX, exportData} from "../../../helper.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
const {REACT_APP_EDIT_MODE} = process.env;
const keys = [
  {key: "name", value: "Name"},
  {key: "email", value: "Email"},
  {key: "feedback", value: "Feedback"}];

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  buttonStyle:{
    float: "right",
    position: "relative",
    marginTop: "20px"
  },
  smallButton: {
    marginRight: "5px",
    backgroundColor: "#00acc1 !important",
    marginTop: "25px"
  }
};


class contactList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      deleted: false,
      data: []
    };
    this.dataMapper = this.dataMapper.bind(this);
  }

  onTableChange = () => {
    this.setState({
      dataToexport: onTableViewChange(this.reactTable.current)
    });
}
  
  dataMapper(props) {
  var {getAllContactUs} = props;
  if (getAllContactUs && getAllContactUs.getAllContactUs) {
    this.setState({
      data: getAllContactUs.getAllContactUs.map((val, key) => {
        var b = "***";
        var c = val.email.split("@");
        var a = c[0].slice(0, -3);
        var d = a.concat(b).concat("@").concat(c[1]);
        return {
          name: val.name,
          email: REACT_APP_EDIT_MODE === "prod" ? d : val.email,
          feedback: val.feedback
        };
      })
    });
  }

  }

  componentWillMount() {
    let {getAllContactUs} = this.props;
    getAllContactUs.refetch();
    if (getAllContactUs) {
      this.dataMapper(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.dataMapper(nextProps);
  }
  render() {
    const { classes } = this.props;
    const {dataToexport} = this.state;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader  icon>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) => downloadCSV(e, exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys))}
            >CSV</Button>
                <Button
                  
                  size="sm"
                  className={classes.smallButton}
                  onClick={(e) => downloadXLSX(e, exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys))}
                >
                  Excel
                </Button>
                {/* <Button
                  
                  size="sm"
                  className={classes.smallButton}
                >Print
                </Button> */}
            </CardHeader>
            <CardBody>
              <ReactTable
              // style={{overflow:"wrap"}}
                data={this.state.data}
                minRows={0}
                ref={this.reactTable}
                onPageChange={this.onTableChange}
                onPageSizeChange={this.onTableChange}
                onSortedChange={this.onTableChange}
                onExpandedChange={this.onTableChange} 
                onFilteredChange={this.onTableChange}
                onResizedChange={this.onTableChange}
                filterable
                columns={[
                  {
                    Header: "Name",
                    style: { "whiteSpace": "unset", "lineHeight": "1.42857143" },
                    //width: getColumnWidth(this.state.data, "id", "ID"),
                    accessor: "name",
                    sortMethod: (a, b, desc) => {
                      // force null and undefined to the bottom
                      a = a === null || a === undefined ? -Infinity : a;
                      b = b === null || b === undefined ? -Infinity : b;
                      // force any string values to lowercase
                      a = typeof a === "string" ? Number(a) : a;
                      b = typeof b === "string" ? Number(b) : b;
                      // Return either 1 or -1 to indicate a sort priority
                      if (a > b) {
                        return 1;
                      }
                      if (a < b) {
                        return -1;
                      }
                      // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
                      return 0;
                    }
                  },
                  {
                    Header: "Email",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    //width: getColumnWidth(this.state.data, "fromName", "Username"),
                    accessor: "email",
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Feedback",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    accessor: "feedback",
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  // {
                  //   Header: "",
                  //   accessor: "actions",
                  //   sortable: false,
                  //   filterable: false
                  // }
                ]}
                defaultSorted={[
                  {
                    id: "id",
                    desc: true
                  }
                ]}
                defaultPageSize={10}
                // showPaginationTop={false}
                // showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var ContactUsList = compose(
  graphql(GET_CONTACT_DETAILS, {name: "getAllContactUs"})
)(contactList);

export default withStyles(styles)(ContactUsList);

