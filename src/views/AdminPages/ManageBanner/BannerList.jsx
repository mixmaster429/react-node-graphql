import React from "react";
import { compose,graphql,Query } from "react-apollo";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// material ui icons
import ReactTable from "react-table";
import "react-table/react-table.css";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Dialogue from "../../../components/Dialog/index.jsx";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import {downloadCSV, onTableViewChange, dateSet, downloadXLSX, exportData} from "../../../helper.js";
import {DELETE ,GET_BANNER_INFO, UPDATE_TOGGLE_STATUS,GET_TOGGLE_STATUS} from "../../../queries";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";

const keys = [
  {key: "id", value: "ID"},
  {key: "name", value: "Name"},
  {key: "status", value: "Status"},
  {key: "createdAt", value: "CreatedAt"}
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


// const initialState = {
//     name: "",
//     description: "",
//     status: "",
//     popUpDetails: [],
//     errors: {},
//     editData: {},
//     currentChosen: {},
//     canDelete: false,
//     open: false
// };

class ManageBanner extends React.Component {
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
    var {getAdBannerInfo} = props;
      if (getAdBannerInfo && getAdBannerInfo.getAdBannerInfo) {
          this.setState({
            data: getAdBannerInfo.getAdBannerInfo.map((ban, key) => {
              return {
                id: ban.id,
                name: ban.name,
                status: ban.status,
                createdAt : dateSet(ban.createdAt),
                actions: (
                  // we"ve added some custom button actions
                  <div className="actions-right">
                    {/* use this button to add a edit kind of action */}
                    <Button
                      justIcon
                      round
                      simple
                      onClick={() => {
                        let obj = this.state.data.find((o) => o.id === ban.id);
                        if (obj.id) {
                          this.props.history.push(`/admin/manageBanner-editBanner/${obj.id}`);
                        }
                      }}
                      color="twitter"
                      className="edit"
                    >
                      <Edit />
                    </Button>{" "}
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
                        currentChosen: ban
                      });
                    }}
                    color="danger"
                    className="remove"
                  >
                    <Delete />
                  </Button>{" "}
                    {/* use this button to remove the data row */}
                    
                  </div>
                )
              };
            })
          });
        }
    }
 
    componentWillMount() {
      let {getAdBannerInfo} = this.props;
      //console.log("object", getAdBannerInfo)
      getAdBannerInfo.refetch({fetch: "all"});
      if (getAdBannerInfo) {
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
    const { classes } = this.props;
    let {currentChosen, dataToexport} = this.state;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader  icon>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) => {
              downloadCSV(
              e,
                exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                );}}>CSV</Button>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) => {
              downloadXLSX(
              e,
              exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys)
                );}}>Excel</Button>
                {/* <Button
                  
                  size="sm"
                  className={classes.smallButton}
                >Print
                </Button> */}
                <Button
                onClick={() => {this.props.history.push("/admin/manageBanner-addBanner");}}
                color="success"
                className={classes.buttonStyle}
                >
                  Add Banner
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
                    Header: "CreatedAt",
                    accessor: "createdAt",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" }
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
                        variables: { id: Number(currentChosen.id), typeConfig: "banner" }
                      }).then(async (d) => {
                        if(d.data.delete) {
                          this.props.getAdBannerInfo.refetch({fetch: "all"});
                      //data.splice(i, 1);
                      this.props.updateToggle({
                        variables: {
                          toggleStatus: true,
                          message: "Banner Deleted Successfully"
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
          open={!!data.toggleStatus}
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

var fBanner = compose(
  graphql(GET_BANNER_INFO, {name: "getAdBannerInfo"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"}),
  graphql(DELETE, {name: "delete"})
)(ManageBanner);


export default withStyles(styles)(fBanner);
