import React from "react";
import { compose, graphql, Query } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Dialogue from "../../../components/Dialog/index.jsx";
import Close from "@material-ui/icons/Delete";

// core components
import Snackbar from "../../../components/Snackbar/Snackbar.jsx";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";

import {GET_ALL_USERS, DELETE, GET_TOGGLE_STATUS, UPDATE_TOGGLE_STATUS} from "../../../queries";
import {downloadCSV, onTableViewChange, dateSet, downloadXLSX, exportData} from "../../../helper.js";
 
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
const {REACT_APP_EDIT_MODE} = process.env;


const keys = [
  {key: "id", value: "ID"},
  {key: "userName", value: "User Name"},
  {key: "email", value: "Email"},
  {key: "status", value: "Status"},
  {key: "createdAt", value: "Created At"},
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


class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.reactTable = React.createRef();
    this.state = {
      data: [],
      currentChosen: {},
      canDelete: false,
      open: false
    };
    this.dataMapper = this.dataMapper.bind(this);
  }
  onTableChange = () => {
    this.setState({
      dataToexport: onTableViewChange(this.reactTable.current)
    });
}
  
  dataMapper(props) {
  var {usersInfo} = props;
    if (usersInfo && usersInfo.getAllUsers) {
        this.setState({
          data: usersInfo.getAllUsers.map((user, key) => {
            var b = "***";
            var c = user.email.split("@");
            var a = c[0].slice(0, -3);
            var d = a.concat(b).concat("@").concat(c[1]);

            return {
              id: user.id,
              userName: user.userName,
              email: REACT_APP_EDIT_MODE === "prod" ? d : user.email,
              createdAt: dateSet(user.createdAt),
              //updatedAt: dateSet(user.updatedAt),
              status: user.status,
              actions: (
                // we"ve added some custom button actions
                <div className="actions-right">
                  {/* use this button to add a edit kind of action */}
                  <Button
                    justIcon
                    round
                    simple
                    onClick={() => {
                      let obj = this.state.data.find((o) => o.id === user.id);
                      if (obj.id) {
                        this.props.history.push(`/admin/users-editUser/${obj.id}`);
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
                        currentChosen: user
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
    let {usersInfo} = this.props;
    this.props.usersInfo.refetch();
    if (usersInfo) {
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
    if (this.state.count && this.state.count !== nextProps.usersInfo.getAllUserslength) {
      nextProps.usersInfo.getAllUsers.refetch();
    }
    this.dataMapper(nextProps);
  }
  render() {
    const { classes } = this.props;
    let {data, dataToexport, currentChosen} = this.state;
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
          <CardHeader icon>
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
                onClick={() => {this.props.history.push("/admin/users-addUser");}}
                color="success"
                className={classes.buttonStyle}
                >
                  Add User
                </Button>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={data}
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
                    Header: "User Name",
                    accessor: "userName",
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
                    Header: "Email",
                    accessor: "email",
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
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
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
              var self = this;
              this.setState({
                open: false,
                canDelete: true
              },() => { 
                if (this.state.canDelete) {
                  var data = self.state.data;
                  data.find((o, i) => {
                    if (o.id === currentChosen.id) {
                      self.props.delete({
                        variables: { id: Number(currentChosen.id), typeConfig: "user" }
                      }).then(async (d) => {
                        if(d.data.delete) {
                          this.props.usersInfo.refetch({fetch: "all"});
                      //data.splice(i, 1);
                      this.props.updateToggle({
                        variables: {
                          toggleStatus: true,
                          message: "User Deleted Successfully"
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

var users = compose(
  graphql(GET_ALL_USERS, {name: "usersInfo"}),
  graphql(DELETE, {name: "delete"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(UserList);
export default withStyles(styles)(users);

