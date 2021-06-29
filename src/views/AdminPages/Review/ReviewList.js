import React from "react";
import { compose, graphql } from "react-apollo";
// react component for creating dynamic tables
import ReactTable from "react-table";
import "react-table/react-table.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import {GET_REVIEWS} from "../../../queries";
import {downloadCSV, onTableViewChange, dateSet, downloadXLSX, exportData} from "../../../helper.js";
 
// style component
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";

const keys = [
  {key: "id", value: "ID"},
  {key: "fromName", value: "User From"},
  {key: "toName", value: "User To"},
  {key: "ratings", value: "Ratings"},
  {key: "comment", value: "Comment"},
  {key: "feedBack", value: "FeedBack"},
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


class reviewList extends React.Component {
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
  var {reviewsInfo} = props;
  
    if (reviewsInfo && reviewsInfo.getReviews) {
        this.setState({
          data: reviewsInfo.getReviews.map((review, key) => {
            return {
              id: review.id,
              fromName: review.fromName,
              toName: review.toName,
              ratings: review.ratings,
              comment: review.comment,
              feedBack: review.feedBack.toString(),
              createdAt: dateSet(review.createdAt),
              //updatedAt: dateSet(review.updatedAt),
              actions: (
                // we"ve added some custom button actions
                <div className="actions-right">
                  {/* use this button to add a edit kind of action */}
                  {/* <Button
                    justIcon
                    round
                    simple
                    onClick={() => {
                      let obj = this.state.data.find(o => o.id === review.id);
                      if (obj.id) {
                        this.props.history.push(`/admin/editReview/:${obj.id}`);
                      }
                    }}
                    color="warning"
                    className="edit"
                  >
                    <Edit />
                  </Button>{" "} */}
                  {/* use this button to remove the data row */}
                </div>
              )
            };
          })
        });
      }
  }
  

  componentWillMount() {
    let {reviewsInfo} = this.props;
    reviewsInfo.refetch();
    if (reviewsInfo) {
      this.dataMapper(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.dataMapper(nextProps);
  }
  render() {
    const { classes } = this.props;
    let {data, dataToexport} = this.state;
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
            </CardHeader>
            <CardBody>
              <ReactTable
                data={data}
                minRows={0}
                // style={{overflow:"wrap"}}
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
                    Header: "User From",
                    accessor: "fromName",
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
                    Header: "User To",
                    accessor: "toName",
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
                    Header: "Ratings",
                    accessor: "ratings",
                    style: { "whiteSpace": "unset" }
                  },
                  {
                    Header: "Comment",
                    accessor: "comment",
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
                    Header: "FeedBack",
                    accessor: "feedBack",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" },
                    filterMethod: (filter, row) => {
                      return (
                        (row[filter.id] !== undefined  && row[filter.id] !== null) ?
                        String(row[filter.id].toLowerCase()).includes(filter.value.toLowerCase())
                        : true
                      );
                    }
                  },
                  {
                    Header: "CreatedAt",
                    accessor: "createdAt",
                    style: { "whiteSpace": "unset",  "lineHeight": "1.42857143" }
                  },
                  // {
                  //   Header: "UpdatedAt",
                  //   accessor: "updatedAt",
                  // },
                  {
                    Header: "",
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
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

var ReviewList = compose(
  graphql(GET_REVIEWS, {name: "reviewsInfo"})
)(reviewList);

export default withStyles(styles)(ReviewList);

