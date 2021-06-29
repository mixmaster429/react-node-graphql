import React from "react";
import { compose, graphql, Query } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Delete";

// core components
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import Dialogue from "../../../components/Dialog/index.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import {GET_CURRENCIES,DELETE, GET_TOGGLE_STATUS, UPDATE_TOGGLE_STATUS} from "../../../queries";
import {downloadCSV, onTableViewChange, downloadXLSX, exportData} from "../../../helper.js";
//style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";


const keys = [
  {key: "id", value: "ID"},
  {key: "name", value: "Name"},
  {key: "code", value: "Code"},
  {key: "symbol", value: "Symbol"},
  {key: "rate", value: "Rate"},
  {key: "status", value: "Status"}
];

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


class DTList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      popUpDetails: "",
      canDelete: false,
      open: false,
      currentChosen: {},
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
  var {currenciesInfo} = props;
    if (currenciesInfo && currenciesInfo.getCurrencies) {
        this.setState({
          data: currenciesInfo.getCurrencies.map((curr, key) => {
            return {
              id: curr.id,
              name: curr.name,
              symbol: curr.symbol,
              code: curr.code,
              rate: curr.rate,
              status: curr.status,
              actions: (
                // we"ve added some custom button actions
                <div className="actions-right">
                  {/* use this button to add a edit kind of action */}
                  <Button
                    justIcon
                    round
                    simple
                    onClick={() => {
                      let obj = this.state.data.find((o) => o.id === curr.id);
                      if (obj.id) {
                        this.props.history.push(`/admin/currencies-editCurrency/${obj.id}`);
                      }
                    }}
                    color="twitter"
                    className="edit"
                  >
                    <Edit />
                  </Button>{" "}
                  {/* use this button to remove the data row */}
                  <Button
                    justIcon
                    round
                    simple
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.updateToggle({variables: {
                        toggleStatus: false,
                        message: ""
                      }});
                      this.setState({
                        open: true,
                        currentChosen: curr
                      });
                    }}
                    color="danger"
                    className="remove"
                  >
                    <Close />
                  </Button>{" "}
                </div>
              )
            };
          })
        });
      }
  }

  componentWillMount() {
    let {currenciesInfo} = this.props;
    currenciesInfo.refetch({fetch: "all"});
    if (currenciesInfo) {
      this.dataMapper(this.props);
    }
  }

  componentWillUnmount() {
    this.props.updateToggle({
      variables: {
        toggleStatus: false,
        message: ""
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.dataMapper(nextProps);
  }
  render() {
    let {currentChosen, dataToexport} = this.state;
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader  icon>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) => 
              downloadCSV(
                e,
                  exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                  )} >CSV</Button>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) => 
              downloadXLSX(
                e,
                exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                  )} >Excel</Button>
                {/* <Button
                  
                  size="sm"
                  className={classes.smallButton}
                >Print
                </Button> */}
                <Button
                onClick={() => {this.props.history.push("/admin/currencies-addCurrency");}}
                color="success"
                className={classes.buttonStyle}
                >
                  Add Currency
                </Button>
            </CardHeader>
            <CardBody>
              <ReactTable
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
                    Header: "ID",
                    accessor: "id",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
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
                    Header: "Name",
                    accessor: "name",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Code",
                    accessor: "code",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Symbol",
                    accessor: "symbol",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    Cell: (prop) => {
                      const parser = new DOMParser();
                      return parser.parseFromString(`<!doctype html><body>${prop.value}`, "text/html").body.textContent;
                    },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Rate",
                    accessor: "rate",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    // filterMethod: (filter, row) => {
                    //   return (
                    //     (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                    //     String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                    //     : true
                    //   );
                    // }
                  },
                  {
                    Header: "Status",
                    accessor: "status",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "Actions",
                    accessor: "actions",
                    sortable: false,
                    filterable: false
                  }
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
            <Dialogue open={this.state.open} 
            handleClickOpen={() => {
              this.setState({
                open: false,
                canDelete: true
              },() => { 
                if (this.state.canDelete) {
                  var data = this.state.data;
                  data.find((o, i) => {
                    if (o.id === currentChosen.id) {
                      this.props.delete({
                        variables: { id: Number(currentChosen.id), typeConfig: "currency" }
                      }).then(async (d) => {
                        if(d.data.delete) {
                          this.props.currenciesInfo.refetch({fetch: "all"});
                      //data.splice(i, 1);
                      this.props.updateToggle({
                        variables: {
                          toggleStatus: true,
                          message: "Currency Deleted Successfully"
                        }
                      });
                        }
                    }).catch((error) => {
                      this.props.updateToggle({
                        variables: {
                          toggleStatus: true,
                          message: error.graphQLErrors.map((x) => x.message)
                        }
                      });
                    });
                      // here you should add some custom code so you can delete the data
                      // from this component and from your server as well
                      return true;
                    }
                    return false;
                  });
                  this.setState({ data, canDelete: false });
                }
              });
            }}
            handleClose={() => {
              this.setState({
                open: false
              });
            }}
            />
<Query query={GET_TOGGLE_STATUS}>
            {({loading, data}) => 
          <Snackbar place="tc"
          color="rose"
          message={data.message}
          open={data.toggleStatus}
          closeNotification={() => 
            this.props.updateToggle({variables: { 
              toggleStatus: false,
              message: ""
            }})
            }
          close />
          }
            </Query>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var dtList = compose(
  graphql(GET_CURRENCIES, {
    name: "currenciesInfo",
    options: () => ({
      variables: {
        fetch: "all"
      }
    })
  }),
  graphql(DELETE, {name: "delete"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(DTList);

export default withStyles(styles)(dtList);

