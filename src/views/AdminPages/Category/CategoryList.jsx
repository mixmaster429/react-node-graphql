import React from "react";
import { compose, graphql, Query } from "react-apollo";

// react component for creating dynamic tables
import ReactTable from "react-table";
import "../../../assets/scss/material-dashboard-pro-react/plugins/_plugin-react-table.scss";

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

// style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
import {GET_ADMIN_CATEGORIES,DELETE, GET_TOGGLE_STATUS, UPDATE_TOGGLE_STATUS} from "../../../queries";
import {downloadCSV, onTableViewChange, dateSet, downloadXLSX, exportData} from "../../../helper.js";


const keys = [
  {key: "id", value: "ID"},
  {key: "name", value: "Name"},
  {key: "isFeatured", value: "Is Featured"},
  {key: "status", value: "Status"},
  {key: "createdAt", value: "Created At"}
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


class CategoryList extends React.Component {
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
  var {categoriesInfo} = props;
    if (categoriesInfo && categoriesInfo.getAdminCategoryDetails) {
      let test = categoriesInfo.getAdminCategoryDetails;
    this.setState({
        data: test.map((cate, key) => {
          let c1 = cate.language.filter((v) => v.langCode === "en").map((v) => {
              return v.name;
          })
          return {
            id: cate.id,
            name: c1[0],
            isFeatured: !!cate.isFeatured ? "Yes" : "No",
            status: cate.status,
            createdAt: dateSet(cate.createdAt),
            actions: (
              // we"ve added some custom button actions
              <div className="actions-right">
                {/* use this button to add a edit kind of action */}
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    let obj = this.state.data.find((o) => o.id === cate.id);
                    if (obj.id) {
                      this.props.history.push(`/admin/categories-editCategory/${obj.id}`);
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
                      currentChosen: cate
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
      })
    }
    }
  

  componentWillMount() {
    let {categoriesInfo} = this.props;
    categoriesInfo.refetch();
    if(categoriesInfo) {
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
              exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys))}
                >CSV</Button>
          <Button
            
            size="sm"
            className={classes.smallButton}
            onClick={(e) =>
              downloadXLSX(
                e,
                exportData(dataToexport ? dataToexport : this.reactTable.current.getResolvedState().sortedData.slice(0, 10), keys))}
            >Excel</Button>
                {/* <Button
                  
                  size="sm"
                  className={classes.smallButton}
                >Print
                </Button> */}
                <Button
                onClick={() => {this.props.history.push("/admin/categories-addCategory");}}
                color="success"
                className={classes.buttonStyle}
                >
                  Add Category
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
                        String(row[filter.id][0].toLowerCase()).startsWith(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },                
                  {
                    Header: "Is Featured",
                    accessor: "isFeatured",
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
              this.setState({
                open: false,
                canDelete: true
              },() => { 
                if (this.state.canDelete) {
                  var data = this.state.data;
                  data.find((o, i) => {
                    if (o.id === currentChosen.id) {
                      this.props.delete({
                        variables: { id: Number(currentChosen.id), typeConfig: "category" }
                      }).then(async (d) => {
                        if(d.data.delete) {
                          this.props.categoriesInfo.refetch({fetch: "all"});
                      //data.splice(i, 1);
                      this.props.updateToggle({
                        variables: {
                          toggleStatus: true,
                          message: "Category Deleted Successfully"
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

var category = compose(
  graphql(GET_ADMIN_CATEGORIES, {name: "categoriesInfo"}),
  graphql(DELETE, {name: "delete"}),
  graphql(UPDATE_TOGGLE_STATUS, {name: "updateToggle"})
)(CategoryList);

export default withStyles(styles)(category);

